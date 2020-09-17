import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateData } from './updateSettings';

const mapBox       = document.getElementsById('map');
const loginForm    = document.querySelector('.form--login');
const logoutBtn    = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-settings');

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
  const name  = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  updateData(email, password);
});
