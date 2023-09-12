const inviteUser = document.getElementById('inviteUser');
const urlParams = new URLSearchParams(window.location.search);
const tour_id = urlParams.get('tourId');
const invitedUserList = document.getElementById('invitedUserListBox');
const inviteBtn = document.getElementById('inviteBtn');
const closeBtn = document.getElementById('closeBtn');

inviteUser.addEventListener('click', async function () {
  const isChecked = await checkInvitedUser();
  if (!isChecked) return;

  const modal = document.getElementById('invitemodal');
  modal.style.display = 'flex';
  document.getElementById('inviteEmail').value = '';

  inviteBtn.addEventListener('click', function () {
    const inviteEmail = document.getElementById('inviteEmail').value;
    fetch(`/invite/${tour_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inviteEmail }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === '사용자 초대가 완료되었습니다.') {
          alert(data.message);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  //모달의 x 버튼 누르면 꺼짐
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  //모달의 바깥부분을 누르면 꺼짐
  modal.addEventListener('click', (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains('modal-overlay')) {
      modal.style.display = 'none';
    }
  });

  //esc누르면 꺼짐
  window.addEventListener('keyup', (e) => {
    if (modal.style.display === 'flex' && e.key === 'Escape') {
      modal.style.display = 'none';
    }
  });
});

function checkInvitedUser() {
  return fetch(`/invite/${tour_id}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.data) {
        const invitedUser = data.data;
        invitedUser.forEach((user) => {
          const inviteCard = `<div><strong>${user.nickname}</strong></div>`;
          invitedUserList.innerHTML += inviteCard;
        });
        return true;
      } else {
        alert(data.message);
        return false;
      }
    });
}
