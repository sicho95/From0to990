import {esc} from './icons.js';

export function admin(state){
  const users=state.adminUsers||[];
  return `<div class="admin-layout">
    <section class="section-block">
      <div class="section-title"><div><h3>Utilisateurs</h3><span class="subtle">${state.adminLoading?'Chargement…':users.length+' compte(s)'}</span></div><button data-act="admin-refresh">Actualiser</button></div>
      <div class="admin-search"><input id="admin-query" type="search" placeholder="Pseudo ou e-mail" value="${esc(state.adminQuery||'')}"><button class="secondary-action" data-act="admin-search">Rechercher</button></div>
    </section>
    <section class="admin-user-list">
      ${users.length?users.map(u=>userCard(u,state.adminConfirmId===u.id)).join(''):'<div class="section-block empty-state">Aucun utilisateur à afficher.</div>'}
    </section>
  </div>`;
}
function userCard(u,confirmDelete){
  const blocked=u.status==='blocked';
  return `<article class="section-block admin-user">
    <div class="admin-user-main"><div class="profile-avatar small">${esc((u.username||u.email||'?').slice(0,1).toUpperCase())}</div><div><strong>${esc(u.username||'Sans pseudo')}</strong><small>${esc(u.email||'')}</small></div><span class="account-badge ${blocked?'blocked':''}">${esc(u.role||'user')} · ${esc(u.status||'active')}</span></div>
    <div class="admin-meta"><span>Créé : ${esc(formatDate(u.createdAt))}</span><span>Dernière activité : ${esc(formatDate(u.lastSeenAt))}</span></div>
    <div class="admin-actions">
      <button class="secondary-action" data-act="${blocked?'admin-unblock':'admin-block'}" data-user-id="${esc(u.id)}">${blocked?'Débloquer':'Bloquer'}</button>
      <button class="danger-action ${confirmDelete?'confirm':''}" data-act="admin-delete" data-user-id="${esc(u.id)}">${confirmDelete?'Confirmer la suppression':'Supprimer'}</button>
    </div>
  </article>`;
}
function formatDate(v){if(!v)return'—';try{return new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(v))}catch{return String(v)}}
