document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('loginBtn');
  const emailInput = document.getElementById('userEmail');
  const passwordInput = document.getElementById('userPassword');
  const togglePassword = document.getElementById('togglePassword'); // 이 부분을 수정해서 추가함

  passwordInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      loginUser();
    }
  });

  loginBtn.addEventListener('click', loginUser);

  // 패스워드 보이기/숨기기 토글 함수
  function togglePasswordVisibility() {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  togglePassword.addEventListener('click', togglePasswordVisibility);
  
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
        }
      })
      .catch((error) => {
        console.error('로그인 실패:', error);
        alert(error.message);
      });
  }
});
