import {esc} from './icons.js';

const brand=()=>`<div class="app-mark large">0→990</div><span class="eyebrow">FROM ZERO TO 990</span>`;
export function authScreen(state){
  const view=state.authView||'login';
  if(view==='forgot')return `<div class="onboarding-wrap"><section class="onboarding-card auth-card">${brand()}<h1>Mot de passe oublié</h1><p>Entre l’adresse e-mail de ton compte. Si elle correspond à un compte, l’administration traitera ta demande.</p><div class="form-list"><label><span>E-mail</span><input id="auth-email" type="email" autocomplete="email" inputmode="email"></label></div><button class="primary-action full" data-act="auth-forgot">Envoyer la demande</button><button class="secondary-action full" data-act="auth-show-login">Retour à la connexion</button></section></div>`;
  if(view==='forgot-sent')return `<div class="onboarding-wrap"><section class="onboarding-card auth-card">${brand()}<h1>Demande reçue</h1><p>Si cette adresse correspond à un compte, l’administration pourra générer un mot de passe provisoire et te le communiquer.</p><button class="primary-action full" data-act="auth-show-login">Retour à la connexion</button></section></div>`;
  if(view==='change-required'||view==='change-voluntary')return `<div class="onboarding-wrap"><section class="onboarding-card auth-card">${brand()}<h1>${view==='change-required'?'Choisis un nouveau mot de passe':'Changer mon mot de passe'}</h1><p>${view==='change-required'?'Ton mot de passe provisoire ne donne accès qu’à cette étape.':'Saisis ton mot de passe actuel puis choisis le nouveau.'}</p><div class="form-list">${view==='change-voluntary'?'<label><span>Mot de passe actuel</span><input id="auth-current-password" type="password" autocomplete="current-password"></label>':''}<label><span>Nouveau mot de passe</span><input id="auth-password" type="password" autocomplete="new-password" minlength="12" maxlength="128"></label><label><span>Confirmation</span><input id="auth-password2" type="password" autocomplete="new-password" minlength="12" maxlength="128"></label></div><button class="primary-action full" data-act="auth-change-password">Enregistrer</button>${view==='change-voluntary'?'<button class="secondary-action full" data-act="auth-change-cancel">Annuler</button>':'<button class="secondary-action full" data-act="auth-logout">Se déconnecter</button>'}</section></div>`;
  const register=view==='register';
  return `<div class="onboarding-wrap"><section class="onboarding-card auth-card">${brand()}<div class="auth-tabs"><button class="${!register?'active':''}" data-act="auth-show-login">Connexion</button><button class="${register?'active':''}" data-act="auth-show-register">Créer un compte</button></div>
    <h1>${register?'Crée ton compte':'Retrouve ta progression'}</h1>
    <p>${register?'Ta progression pourra être retrouvée sur tes autres appareils.':'Connecte-toi avec ton pseudo ou ton e-mail.'}</p>
    <div class="form-list">
      ${register?`<label><span>Pseudo</span><input id="auth-username" autocomplete="username" minlength="3" maxlength="32" placeholder="Ton pseudo"></label><label><span>E-mail</span><input id="auth-email" type="email" autocomplete="email" inputmode="email"></label>`:`<label><span>Pseudo ou e-mail</span><input id="auth-identifier" autocomplete="username"></label>`}
      <label><span>Mot de passe</span><input id="auth-password" type="password" autocomplete="${register?'new-password':'current-password'}" minlength="12" maxlength="128"></label>
    </div>
    <button class="primary-action full" data-act="${register?'auth-register':'auth-login'}">${register?'Créer mon compte':'Se connecter'}</button>
    ${!register?`<button class="text-action auth-forgot-link" data-act="auth-show-forgot">Mot de passe oublié ?</button>`:''}
    <small class="privacy">Le mot de passe n’est jamais enregistré dans la PWA. Seul un jeton de session est conservé sur cet appareil.</small>
  </section></div>`;
}
