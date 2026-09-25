const ROUTES = [
  ['today', 'Aujourd’hui', '⌂'],
  ['diagnostic', 'Diagnostic', '◎'],
  ['train', 'S’entraîner', '▶'],
  ['program', 'Programme', '↗'],
  ['mock', 'TOEIC blanc', '◈'],
  ['dashboard', 'Tableau de bord', '▣'],
  ['errors', 'Mes erreurs', '⚠'],
  ['vocab', 'Vocabulaire', '✦'],
  ['resources', 'Ressources', '☍'],
  ['history', 'Historique', '◷'],
  ['settings', 'Réglages', '⚙']
];

import {
  STORES,
  getAll,
  getProfile,
  saveProfile,
  addAttempt,
  addSession,
  saveSkill,
  saveError,
  exportLocalBackup,
  importLocalBackup,
  setting,
  setSetting,
  snapshot
} from './lib/db.js';
import { recomputeSkills, priorities, estimatedScores, SKILL_LABELS, pickAdaptive } from './lib/adaptive.js';
import { playQuestionAudio, stopAudio, audioCapabilities } from './lib/audio.js';
import { syncNow, syncStatus, remoteAdminExport } from './lib/sync.js';

const state = {
  route: 'today',
  questions: [],
  profile: null,
  attempts: [],
  sessions: [],
  skills: [],
  errors: [],
  currentSession: null,
  contentMeta: null,
  version: null,
  toast: '',
  sync: { pending: 0, endpoint: '', lastSyncAt: null },
};

const app = document.getElementById('app');

init().catch(err => {
  console.error(err);
  app.innerHTML = `<div class="content"><div class="card"><h2>Erreur au chargement</h2><pre>${escapeHtml(String(err.stack || err))}</pre></div></div>`;
});

async function init() {
  state.route = (location.hash.replace('#/', '') || 'today').split('?')[0];
  await loadContent();
  await hydrateState();
  setupEvents();
  await restoreLiveSession();
  await registerSW();
  await refreshSyncStatus();
  render();
}

async function loadContent() {
  const [contentRes, versionRes] = await Promise.all([
    fetch('./content/content.json'),
    fetch('./version.json').catch(() => null)
  ]);
  const content = await contentRes.json();
  state.questions = content.questions;
  state.contentMeta = content.meta;
  state.version = versionRes ? await versionRes.json() : { appVersion: 'dev', contentVersion: 'dev' };
}

async function hydrateState() {
  const [profile, attempts, sessions, skills, errors] = await Promise.all([
    getProfile(),
    getAll(STORES.attempts),
    getAll(STORES.sessions),
    getAll(STORES.skills),
    getAll(STORES.errors)
  ]);
  state.profile = profile || defaultProfile();
  if (!profile) await saveProfile(state.profile, { queue: false });
  state.attempts = attempts.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  state.sessions = sessions.sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)));
  state.skills = skills.length ? skills : recomputeSkills(state.questions, state.attempts);
  if (!skills.length) await persistSkills();
  state.errors = errors.sort((a, b) => (b.count || 0) - (a.count || 0));
}

function defaultProfile() {
  return {
    displayName: 'Damien',
    targetScore: 990,
    examDate: '',
    timePerDay: 20,
    levelEstimate: 'intermédiaire',
    lastScore: '',
    goal: 'Atteindre le score maximal au TOEIC Listening & Reading',
    onboardingComplete: false,
    updatedAt: new Date().toISOString()
  };
}

function setupEvents() {
  window.addEventListener('hashchange', () => {
    state.route = (location.hash.replace('#/', '') || 'today').split('?')[0];
    render();
  });
  window.addEventListener('online', async () => { showToast('Connexion retrouvée — synchronisation…'); await trySync(true); });
  window.addEventListener('offline', () => { showToast('Mode hors ligne activé'); render(); });
}

async function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.register('./sw.js');
  navigator.serviceWorker.addEventListener('controllerchange', async () => {
    await persistUiState();
    location.reload();
  });
  setInterval(async () => {
    try { await reg.update(); } catch {}
  }, 60_000);
}

async function refreshSyncStatus() {
  state.sync = await syncStatus();
}

async function persistSkills() {
  state.skills = recomputeSkills(state.questions, state.attempts);
  for (const s of state.skills) await saveSkill({ ...s, updatedAt: new Date().toISOString(), payload: {} }, { queue: false });
}

function navigate(route) {
  location.hash = `#/${route}`;
}

function showToast(msg) {
  state.toast = msg;
  render();
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { state.toast = ''; render(); }, 2800);
}

function render() {
  const route = ROUTES.some(([id]) => id === state.route) ? state.route : 'today';
  state.route = route;
  app.innerHTML = `
    <div class="layout">
      ${renderSidebar(route)}
      <div class="main">
        ${renderTopbar(route)}
        <div class="content">${renderRoute(route)}</div>
      </div>
      ${renderMobileNav(route)}
    </div>
    <div id="toast-slot">${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}</div>
  `;
  bindPageEvents();
}

function renderSidebar(route) {
  const primary = ['today','diagnostic','train','program','mock','dashboard'];
  const secondary = ['errors','vocab','resources','history','settings'];
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">990</div>
        <div><h1>From0to990</h1><small>Coach TOEIC indépendant</small></div>
      </div>
      <div class="nav-section">Travail</div>
      <nav class="nav">${primary.map(r => navButton(r, route)).join('')}</nav>
      <div class="nav-section">Suivi & outils</div>
      <nav class="nav">${secondary.map(r => navButton(r, route)).join('')}</nav>
      <div class="sidebar-foot">
        <div class="sync-pill"><span class="dot ${navigator.onLine ? '' : 'offline'}"></span>${navigator.onLine ? 'En ligne' : 'Hors ligne'} · ${state.sync.pending || 0} en attente</div>
      </div>
    </aside>`;
}

function renderMobileNav(route) {
  const mobile = ['today','train','mock','dashboard','settings'];
  return `<nav class="mobile-nav">${mobile.map(r => navButton(r, route, true)).join('')}</nav>`;
}

function navButton(routeId, current, compact=false) {
  const route = ROUTES.find(([id]) => id === routeId);
  return `<button data-nav="${routeId}" class="${routeId===current?'active':''}">${compact ? `<span class="icon">${route[2]}</span>` : `<span class="icon">${route[2]}</span><span>${route[1]}</span>`}</button>`;
}

function renderTopbar(route) {
  const label = ROUTES.find(([id]) => id === route)?.[1] || 'From0to990';
  const est = estimatedScores(state.questions, state.attempts);
  return `
    <header class="topbar">
      <div><h2>${escapeHtml(label)}</h2></div>
      <div class="top-actions">
        <span class="chip">Score estimé ${est.total}/990</span>
        <button class="chip" data-action="quick-train">Que travailler maintenant ?</button>
      </div>
    </header>`;
}

function renderRoute(route) {
  switch (route) {
