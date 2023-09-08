const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('userEmail');
const passwordInput = document.getElementById('userPassword');

passwordInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    loginUser();
  }
});

loginBtn.addEventListener('click', loginUser);

function loginUser() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const formData = {
    email: email,
    password: password,
  };
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      if (data.status === 200) {
        window.location.href = '/';
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('로그인 실패:', error);
      alert(error.message);
    });
}
