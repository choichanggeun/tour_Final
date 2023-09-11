// 사용자 정보 확인하여 로그인 상태에 따라 버튼 표시
function checkLoggedInStatus() {
  fetch('/users/me', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      // 응답 처리
      if (data.data) {
        const usernickname = document.getElementById('usernickname');
        usernickname.innerHTML = data.data.nickname;
        document.querySelector('#profileimg').style.display = 'block';

        // 이미지 클릭 이벤트 추가
        var profilePic = document.getElementById('profilePic');
        var dropdownMenu = document.getElementById('dropdownMenu');

        profilePic.addEventListener('click', function (event) {
          event.stopPropagation(); // Stop the event from bubbling up to the window object
          if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
          } else {
            dropdownMenu.style.display = 'block';
          }
        });

        // Window click event to hide the dropdown menu when clicked outside
        window.addEventListener('click', function (event) {
          if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
          }
        });

        document.querySelector('#loginbtn').style.display = 'none';
      } else {
        document.querySelector('#loginbtn').style.display = 'block';
        document.querySelector('#profileimg').style.display = 'none';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
document.addEventListener('DOMContentLoaded', (event) => {
  checkLoggedInStatus();
});

function popup() {
  window.open('chatting.html', 'popup01', 'width=400, height=800, scrollbars= 0, toolbar=0, menubar=no');
}

// 로그 아웃
function logout() {
  const logoutBtn = document.getElementById('logoutbtn');
  logoutBtn.addEventListener('click', async function () {
    fetch('/logout', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === '로그아웃이 완료되었습니다.') {
          alert(data.message);
          location.reload();
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}

logout();
