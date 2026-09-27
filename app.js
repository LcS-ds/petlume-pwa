const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
const installButton = document.querySelector('#installButton');
const offlineNotice = document.querySelector('#offlineNotice');
const bookingForm = document.querySelector('#bookingForm');
const formStatus = document.querySelector('#formStatus');
let deferredInstallPrompt = null;

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

function updateConnectionStatus() {
  offlineNotice.hidden = navigator.onLine;
}

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
updateConnectionStatus();

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const pet = data.get('pet');
  formStatus.textContent = `Pedido recebido para ${pet}. A equipe entrará em contato para confirmar o horário.`;
  bookingForm.reset();
});

document.querySelector('#year').textContent = new Date().getFullYear();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}
