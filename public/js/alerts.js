
module const hideAlert = () => {
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  const alert = document.querySelector('.alert');
  if (alert) alert.parentElement.removeChild(alert);
};

// type is either 'success' or 'error'
module const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
