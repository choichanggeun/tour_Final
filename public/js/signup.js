const createBtn = document.getElementById('createBtn');

createBtn.addEventListener('click', function () {
  const email = document.getElementById('userEmail').value;
  const authCode = document.getElementById('authCode').value;
  const password = document.getElementById('userPassword').value;
  const confirm = document.getElementById('userConfirmPassword').value;
  const nickname = document.getElementById('userNickname').value;

  const formData = {
    email: email,
    password: password,
    confirm: confirm,
    nickname: nickname,
    authCode: authCode,
  };
  fetch('/signup', {
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
        window.location.href = '/login.html';
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('회원가입 실패:', error);
      alert(error.message);
    });
});

function authMailSending() {
  const email = document.getElementById('userEmail').value;
  if (email) {
    fetch('/users/authemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          alert(data.message);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    alert('이메일을 입력해주세요.');
  }
}
