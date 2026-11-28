// Bouton « Installer l'application » de Papy Gourmand.
(function () {
  var base = '/papy-gourmand/';
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(base + 'sw.js', { scope: base }).catch(function () {});
  }

  // Déjà installée et ouverte comme application : pas de bouton.
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) return;

  var style = document.createElement('style');
  style.textContent =
    '#papy-installer{position:fixed;right:16px;bottom:16px;z-index:9999;display:none;' +
    'align-items:center;gap:8px;padding:8px 14px 8px 8px;border:none;border-radius:30px;' +
    'background:#f5e6c8;color:#4a3520;font:600 15px Georgia,serif;cursor:pointer;' +
    'box-shadow:0 3px 12px rgba(0,0,0,.35)}' +
    '#papy-installer img{width:34px;height:34px;border-radius:8px}' +
    '#papy-installer:hover{background:#ffd778}' +
    '#papy-aide{position:fixed;right:16px;bottom:74px;z-index:9999;max-width:260px;display:none;' +
    'padding:12px 14px;border-radius:12px;background:#fffaf0;color:#4a3520;' +
    'font:14px Georgia,serif;box-shadow:0 3px 12px rgba(0,0,0,.35)}';
  document.head.appendChild(style);

  var bouton = document.createElement('button');
  bouton.id = 'papy-installer';
  bouton.type = 'button';
  bouton.innerHTML = '<img src="' + base + 'icones/icone-192.png" alt=""> Installer l\'application';
  var aide = document.createElement('div');
  aide.id = 'papy-aide';

  function ajouter() {
    document.body.appendChild(aide);
    document.body.appendChild(bouton);
  }
  if (document.body) ajouter(); else document.addEventListener('DOMContentLoaded', ajouter);

  var invite = null;
  // Chrome, Edge, Android : le navigateur propose l'installation.
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    invite = e;
    bouton.style.display = 'flex';
  });
  window.addEventListener('appinstalled', function () {
    bouton.style.display = 'none';
    aide.style.display = 'none';
  });

  // iPhone / iPad / Safari sur Mac : pas d'invite automatique, on explique.
  var ua = navigator.userAgent;
  var ios = /iPhone|iPad|iPod/.test(ua) || (ua.indexOf('Macintosh') > -1 && 'ontouchend' in document);
  var safariMac = !ios && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua) && /Macintosh/.test(ua);
  if (ios || safariMac) {
    setTimeout(function () { bouton.style.display = 'flex'; }, 0);
    aide.innerHTML = ios
      ? 'Touchez le bouton <b>Partager</b> (carré avec une flèche), puis <b>« Sur l\'écran d\'accueil »</b>.'
      : 'Dans le menu <b>Fichier</b> de Safari, choisissez <b>« Ajouter au Dock »</b>.';
  }

  bouton.addEventListener('click', function () {
    if (invite) {
      invite.prompt();
      invite.userChoice.then(function () { invite = null; bouton.style.display = 'none'; });
    } else {
      aide.style.display = aide.style.display === 'block' ? 'none' : 'block';
    }
  });
})();
