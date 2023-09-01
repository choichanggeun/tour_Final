const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', function () {
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userPassword').value;

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
      if (data.status === 200) {
        alert(data.message);
        window.location.href = '/';
      }
      alert(data.message);
    })
    .catch((error) => {
      console.error('로그인 실패:', error);
      alert(error.message);
    });
});
