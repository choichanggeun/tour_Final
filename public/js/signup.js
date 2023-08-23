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
  console.log(formData);
  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('회원가입이 완료되었습니다.');
      window.location.href = '/login.js';
    })
    .catch((error) => {
      console.error('칼럼생성 실패:', error);
      alert('칼럼생성에 실패하였습니다.');
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
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    alert('이메일을 입력해주세요.');
  }
}
