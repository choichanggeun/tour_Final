// 여행 일지 수정 페이지
const updateRenderDiary = function () {
  const currentPageURL = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  const targetPageURL = `http://localhost:3000/diary-update.html?diary_id=${diary_id}`;
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      const row = document.getElementById('row');

      try {
        const response = await fetch(`/diaries/${Number(diary_id)}`, {
          method: 'GET',
        });
        const response2 = await fetch(`/diaries/${Number(diary_id)}/photos`, {
          method: 'GET',
        });
        const { data } = await response.json();
        const { images } = await response2.json();
        if (response.ok) {
          row.innerHTML += `
            <div id='diaryBox${data.id}'>
              <label for="title">제목: </label>
              <input name="title" value="${data.title}" id="diary-title"></input>
            </div>
            `;
          if (images.length !== 0) {
            for (let image of images) {
              const diaryBox = document.getElementById(`diaryBox${data.id}`);
              diaryBox.innerHTML += `
                <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}" id="img${image.id}">
                <button id="img-delete-btn${image.id}">X</button>
              `;
            }
          } else {
            const diaryBox = document.getElementById(`diaryBox${data.id}`);
            diaryBox.innerHTML += `
                <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png">
              `;
          }
          const isChecked = data.status === '1' ? 'checked' : '';
          const diaryBox = document.getElementById(`diaryBox${data.id}`);
          diaryBox.innerHTML += `
            <label for="content">내용: </label>
            <textarea name="content" id="diary-content">${data.content}</textarea>
            <input type="file" id="diary-image" multiple />
            <label for="private">비공개: </label>
            <input type="checkbox" name="private" id="private-checkbox" ${isChecked}/>
            <button id='update-cancel-btn' >취소</button>
            <button id='diary-update-btn'>저장</button>
          `;
          const updateCancelBtn = document.getElementById('update-cancel-btn');
          if (updateCancelBtn) {
            updateCancelBtn.addEventListener('click', async function () {
              location.href = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
            });
          }

          document.addEventListener('click', async function (e) {
            let imgId;
            const img = e.target.previousElementSibling;
            if (img && img.tagName === 'IMG') {
              imgId = img.id;

              const photo_id = Number([...imgId].filter((n) => !isNaN(n) === true).join(''));
              deleteDiaryImg(photo_id);
            }
          });
          const diaryUpdateBtn = document.getElementById('diary-update-btn');
          if (diaryUpdateBtn) {
            diaryUpdateBtn.addEventListener('click', async function () {
              updateDiary(diary_id);
              updateImg();
            });
          }
        } else {
          alert('여행일지 수정에 실패했습니다.');
        }
      } catch (error) {
        alert('여행일지 수정에 실패했습니다.');
        console.error(error);
      }
    });
  }
};
updateRenderDiary();

// 여행 일지 수정
updateDiary = async function (diary_id) {
  const diaryTitle = document.getElementById('diary-title').value;
  const diaryContent = document.getElementById('diary-content').value;
  const isPrivate = document.getElementById('private-checkbox').checked;
  const status = isPrivate ? 1 : 0;

  try {
    const response = await fetch(`/diaries/${diary_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: diaryTitle,
        content: diaryContent,
        status: status,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      location.href = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('여행 일지 수정에 실패했습니다.');
    console.error(error);
  }
};

// 여행 일지 수정 페이지 이미지 업로드
const updateImg = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  const uploadImg = document.getElementById('diary-image').files;
  const formData = new FormData();
  if (uploadImg.length !== 0) {
    // 여러 이미지를 하나씩 formData에 할당
    for (let i = 0; i < uploadImg.length; i++) {
      formData.append('image', uploadImg[i]);
    }
  }
  try {
    await fetch(`/diaries/${diary_id}/photos`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    alert('이미지 업로드를 실패했습니다.');
    console.error(error);
  }
};

// 여행 일지 이미지 삭제
const deleteDiaryImg = async function (photo_id) {
  try {
    const response = await fetch(`/photos/${photo_id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok) {
      const img = document.getElementById(`img${photo_id}`);
      img.style.display = 'none';
      const imgDeleteBtn = document.getElementById(`img-delete-btn${photo_id}`);
      imgDeleteBtn.style.display = 'none';
      alert(data.message);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};
