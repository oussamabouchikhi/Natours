import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

const mapBox       = document.getElementsById('map');
const loginForm    = document.querySelector('.form--login');
const logoutBtn    = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-settings');
const userPasswordForm = document.querySelector('.form-user-password');

if (mapBox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

loginForm && loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

if (logoutBtn) logoutBtn.addEventListener('click', logout);

userDataForm && userDataForm.addEventListener('submit', e => {
  e.preventDefault();
  const form = new FormData();
  form.append(name, document.getElementById('name').value);
  form.append(email, document.getElementById('email').value);
  form.append(photo, document.getElementById('photo').files[0]);
  updateSettings(form, 'data');
});

userPasswordForm && userPasswordForm.addEventListener('submit', async e => {
  e.preventDefault();
  const passwordCurrent  = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;
  document.querySelector('.btn--save-password').textContent = 'Updating...';

  await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

  document.querySelector('.btn--save-password').textContent = 'Save password';
  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';
});
