document.addEventListener('DOMContentLoaded', function () {
  // 회원 가입 버튼과 필요한 입력 요소들을 가져옵니다.
  const createBtn = document.getElementById('createBtn');
  const emailInput = document.getElementById('userEmail');
  const passwordInput = document.getElementById('userPassword');
  const confirmPasswordInput = document.getElementById('userConfirmPassword');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const authEmailBtn = document.getElementById('authEmailBtn');
  const authCodeInput = document.getElementById('authCode'); // 추가: 인증 코드 입력 필드

  // 패스워드 보이기/숨기기 토글 함수
  function togglePasswordVisibility(passwordField) {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
    } else {
      passwordField.type = 'password';
    }
  }

  // 회원 가입 버튼 클릭 이벤트 핸들러
  createBtn.addEventListener('click', function () {
    const email = emailInput.value;
    const authCode = authCodeInput.value; // 수정: 인증 코드 가져오기
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const nickname = document.getElementById('userNickname').value;

    // 입력한 데이터를 객체로 만듭니다.
    const formData = {
      email: email,
      password: password,
      confirm: confirmPassword,
      nickname: nickname,
      authCode: authCode, // 추가: 인증 코드 추가
    };

    // 서버로 회원 가입 요청을 보냅니다.
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
          // 회원 가입이 성공한 경우
          alert(data.message);
          window.location.href = '/login.html'; // 로그인 페이지로 이동
        } else {
          // 회원 가입이 실패한 경우
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('회원가입 실패:', error);
        alert(error.message);
      });
  });

  // 인증 메일 전송 버튼 클릭 이벤트 핸들러
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