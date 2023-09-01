document.addEventListener('DOMContentLoaded', async function () {
  // Get logged-in user's info
  await fetch(`/users/`)
    .then((response) => response.json())
    .then(async (result) => {
      var userId = result.data.id; // assuming the user object has an 'id' field

      var newNicknameInput = document.querySelector('#newNickname');
      newNicknameInput.value = result.data.nickname;

      // Save button click event listener to update profile
      document.querySelector('#saveButton').addEventListener('click', function () {
        var newNickname = document.querySelector('#newNickname').value;
        var newPassword = document.querySelector('#newPassword').value;

        fetch(`/users/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: newNickname, password: newPassword }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);

            alert('수정이 완료되었습니다.');
            window.location.href = '../mypage.html';
          })
          .catch((error) => console.error('Error:', error));
      });
    })
    .catch((error) => console.error('Error:', error));
});
