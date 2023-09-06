const urlParams = new URLSearchParams(window.location.search);
const tour_id = urlParams.get('id');
const updateDate = document.getElementById('updateDate');
const modalCloseBtn = document.getElementById('modalCloseBtn');
updateDate.addEventListener('click', function () {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  const tourUpdateBtn = document.getElementById('tourUpdateBtn');

  tourUpdateBtn.addEventListener('click', function () {
    const updateTitle = document.getElementById('updateTitle').value;
    const updateStartDate = document.getElementById('updateStartDate').value;
    const updateEndDate = document.getElementById('updateEndDate').value;
    const formData = {
      title: updateTitle,
      start_date: updateStartDate,
      end_date: updateEndDate,
    };
    fetch(`/tours/${tour_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          alert(data.message);
          window.location.href = `tour-update.html?id=${tour_id}`;
        }
        alert(data.message);
      })
      .catch((error) => {
        console.error('여행계획 생성 실패:', error);
        alert('여행 계획 생성에 실패하였습니다.');
      });
  });
  modalCloseBtn.addEventListener('click', () => {
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
