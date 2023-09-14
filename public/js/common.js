// 사용자 정보 확인하여 로그인 상태에 따라 버튼 표시
let flag = false;

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
        console.log('1');
        profilePic.addEventListener('click', function (event) {
          event.stopPropagation(); // Stop the event from bubbling up to the window object
          if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
            console.log('success');
          } else {
            dropdownMenu.style.display = 'block';
            console.log('fail');
          }
        });
        console.log('2');
        // var profilePic2 = document.getElementById('profilePic2');
        // var dropdownMenu2 = document.getElementById('dropdownMenu2');

        // profilePic2.addEventListener('click', function (event) {
        //   event.stopPropagation(); // Stop the event from bubbling up to the window object
        //   if (dropdownMenu2.style.display === 'block') {
        //     dropdownMenu2.style.display = 'none';
        //     console.log('success');
        //     console.log('!!!');
        //   } else {
        //     dropdownMenu2.style.display = 'block';
        //     console.log('fail');
        //     console.log('???');
        //   }
        // });

        console.log('3');
        // Window click event to hide the dropdown menu when clicked outside
        window.addEventListener('click', function (event) {
          if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
          }
        });

        console.log('4');
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
