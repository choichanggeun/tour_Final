const inviteUser = document.getElementById('inviteUser');

inviteUser.addEventListener('click', function () {
  const modal = document.getElementById('invitemodal');
  modal.style.display = 'flex';
  const inviteBtn = document.getElementById('inviteBtn');

  inviteBtn.addEventListener('click', function () {
    const inviteEmail = document.getElementById('inviteEmail').value;
  });
});
