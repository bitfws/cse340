const passwordBtn = document.querySelector('#password-btn');
passwordBtn.addEventListener('click', function () {
  const pswdInput = document.getElementById('password');
  const type = pswdInput.getAttribute('type');
  if (type == 'password') {
    pswdInput.setAttribute('type', 'text');
    passwordBtn.innerHTML = 'Hide Password';
  } else {
    pswdInput.setAttribute('type', 'password');
    passwordBtn.innerHTML = 'Show Password';
  }
});
