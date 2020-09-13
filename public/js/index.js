import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

const mapBox = document.getElementsById('map');
const loginForm = document.querySelector('.form')

if (mapBox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

loginForm && loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
