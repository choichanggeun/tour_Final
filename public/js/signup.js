document.addEventListener('DOMContentLoaded', function () {
  const createBtn = document.getElementById('createBtn');
  const emailInput = document.getElementById('userEmail');
  const passwordInput = document.getElementById('userPassword');
  const confirmPasswordInput = document.getElementById('userConfirmPassword');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword'); // 확인 비밀번호의 눈 모양 아이콘
  const authEmailBtn = document.getElementById('authEmailBtn'); // 이메일 인증 버튼

  // 패스워드 보이기/숨기기 토글 함수
  function togglePasswordVisibility(passwordField) {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
    } else {
      passwordField.type = 'password';
    }
  }

  createBtn.addEventListener('click', function () {
    const email = emailInput.value;
    const authCode = document.getElementById('authCode').value;
    const password = passwordInput.value;
    const confirm = confirmPasswordInput.value;
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
        if (data.status === 201) {
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
    const email = emailInput.value;
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

  // 패스워드 눈 모양 아이콘 클릭 이벤트
  togglePassword.addEventListener('click', function () {
    togglePasswordVisibility(passwordInput);
  });

  // 확인 비밀번호 눈 모양 아이콘 클릭 이벤트
  toggleConfirmPassword.addEventListener('click', function () {
    togglePasswordVisibility(confirmPasswordInput);
  });

  // 이메일 인증 버튼 클릭 이벤트
  authEmailBtn.addEventListener('click', authMailSending);
});