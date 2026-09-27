import {esc} from './icons.js';

export function admin(state){
  const users=state.adminUsers||[];
  return `<div class="admin-layout">
    <section class="section-block"><div class="section-title"><h3>Demandes de mot de passe ${state.adminPendingCount?`<span class="admin-count">${state.adminPendingCount}</span>`:''}</h3></div>
      ${(state.adminRequests||[]).length?state.adminRequests.map(r=>`<div class="admin-request"><div><strong>${esc(r.username)}</strong> · ${esc(r.email)}<small>${esc(formatDate(r.createdAt))} · ${esc(r.status)}</small></div><button class="secondary-action" data-act="admin-focus-user" data-user-id="${esc(r.userId)}">Voir la fiche</button></div>`).join(''):'<p class="subtle">Aucune demande en cours.</p>'}</section>
    <section class="section-block">
      <div class="section-title"><div><h3>Utilisateurs</h3><span class="subtle">${state.adminLoading?'Chargement…':users.length+' compte(s)'}</span></div><button data-act="admin-refresh">Actualiser</button></div>
      <div class="admin-search"><input id="admin-query" type="search" placeholder="Pseudo ou e-mail" value="${esc(state.adminQuery||'')}"><button class="secondary-action" data-act="admin-search">Rechercher</button></div>
    </section>
    <section class="admin-user-list">
      ${users.length?users.map(u=>userCard(u,state.adminConfirmId===u.id,state.auth?.user?.id===u.id,users.filter(a=>a.role==='admin'&&a.status==='active').length,state.adminRolePendingId===u.id)).join(''):'<div class="section-block empty-state">Aucun utilisateur à afficher.</div>'}
    </section>
    ${state.temporaryDisplay?`<div class="temporary-overlay" role="dialog" aria-modal="true" aria-label="Mot de passe provisoire"><section class="section-block temporary-dialog"><h3>Mot de passe provisoire</h3><p>Cette valeur ne sera plus affichée après la fermeture.</p><code>${esc(state.temporaryDisplay.password)}</code><div class="admin-actions"><button class="secondary-action" data-act="temporary-copy">Copier</button><button class="primary-action" data-act="temporary-email">Envoyer par e-mail</button><button class="secondary-action" data-act="temporary-close">Fermer</button></div></section></div>`:''}
  </div>`;
}
function userCard(u,confirmDelete,self,activeAdminCount,rolePending){
  const blocked=u.status==='blocked';
  const passwordStatus={normal:'Normal',pending:'Reset demandé',temporary:'Provisoire actif',expired:'Mot de passe provisoire expiré'}[u.passwordStatus]||'Normal';
  return `<article class="section-block admin-user" id="user-${esc(u.id)}">
    <div class="admin-user-main"><div class="profile-avatar small">${esc((u.username||u.email||'?').slice(0,1).toUpperCase())}</div><div><strong>${esc(u.username||'Sans pseudo')}</strong><small>${esc(u.email||'')}</small></div><span class="account-badge ${blocked?'blocked':''}">${u.role==='admin'?'Administrateur':'Utilisateur'} · ${blocked?'Bloqué':'Actif'}</span></div>
    <div class="admin-meta"><span>Créé : ${esc(formatDate(u.createdAt))}</span><span>Dernière activité : ${esc(formatDate(u.lastSeenAt))}</span><span>Mot de passe : ${esc(passwordStatus)}</span></div>
    <div class="admin-actions">
      ${u.role==='user'||(u.role==='admin'&&activeAdminCount>1)?`<button class="secondary-action" data-act="admin-role" data-user-id="${esc(u.id)}" data-role="${u.role==='admin'?'user':'admin'}" ${rolePending?'disabled':''}>${rolePending?'Modification…':u.role==='admin'?'Retirer les droits administrateur':'Donner les droits administrateur'}</button>`:self?'<span class="subtle">Dernier administrateur protégé</span>':''}
      ${!self?`<button class="secondary-action" data-act="${blocked?'admin-unblock':'admin-block'}" data-user-id="${esc(u.id)}">${blocked?'Débloquer':'Bloquer'}</button><button class="secondary-action" data-act="admin-temporary" data-user-id="${esc(u.id)}" ${blocked?'disabled':''}>${u.passwordStatus==='expired'?'Générer un nouveau mot de passe provisoire':'Réinitialiser le mot de passe'}</button><button class="danger-action ${confirmDelete?'confirm':''}" data-act="admin-delete" data-user-id="${esc(u.id)}">${confirmDelete?'Confirmer la suppression':'Supprimer'}</button>`:''}
    </div>
  </article>`;
}
function formatDate(v){if(!v)return'—';try{return new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(v))}catch{return String(v)}}
