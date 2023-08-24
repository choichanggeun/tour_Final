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
      alert('로그인이 완료되었습니다.');
      window.location.href = '/';
    })
    .catch((error) => {
      console.error('로그인 실패:', error);
      alert('로그인 실패하였습니다.');
    });
});
