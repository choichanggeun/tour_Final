document.addEventListener('DOMContentLoaded', async function () {
  // Get logged-in user's nickname and display it
  await fetch(`/users`)
    .then((response) => response.json())
    .then((result) => {
      var newNicknameInput = document.querySelector('#newNickname');
      newNicknameInput.value = result.data.nickname;
    })
    .catch((error) => console.error('Error:', error));

  // Save button click event listener to update profile
  document.querySelector('#saveButton').addEventListener('click', function () {
    var newNickname = document.querySelector('#newNickname').value;
    var newPassword = document.querySelector('#newPassword').value;
    var userId = 'user_id'; // Replace with the actual user ID from the backend

    fetch(`/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: newNickname, password: newPassword }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        // success 필드의 값에 따라 수정 성공 여부 판별
        alert('수정이 완료되었습니다.'); // 수정 완료 알림 메시지
        window.location.href = '../mypage.html'; // 이전 페이지의 URL로 변경해주세요.
      })
      .catch((error) => console.error('Error:', error));
  });
});
