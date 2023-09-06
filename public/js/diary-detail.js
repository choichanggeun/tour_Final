// 여행 일지, 이미지 조회
const getDiary = function () {
  // 특정 페이지에 있을 때 실행
  const currentPageURL = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  const targetPageURL = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
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
          if (images.length !== 0) {
            row.innerHTML += `
                <div id="diaryBox${data.id}">
                  <h5 style="padding: 1px; margin: 0 500px;">제목: ${data.title}</h5>
                </div>
                `;
            for (let image of images) {
              const diaryBox = document.getElementById(`diaryBox${data.id}`);
              diaryBox.innerHTML += `
                <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}">
                `;
            }
          } else {
            row.innerHTML += `
                <div id="diaryBox${data.id}">
                <h5 style="padding: 1px; margin: 0 500px;">제목: ${data.title}</h5>
                  <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png">
                </div>
              `;
          }
          const diaryBox = document.getElementById(`diaryBox${data.id}`);
          diaryBox.innerHTML += `
            <p>내용: ${data.content}</p>
            <button><a href="http://localhost:3000/diary-update.html?diary_id=${diary_id}">일지 수정</a></button>
            <button id="diary-delete-btn">일지 삭제</button>
            `;
          document.getElementById('diary-delete-btn').addEventListener('click', async function () {
            deleteDiary(diary_id);
          });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
};
getDiary();

// 여행 일지, 이미지 삭제
const deleteDiary = async function (diary_id) {
  const answer = confirm('여행 일지를 삭제하시겠습니까?');
  if (answer) {
    try {
      // 이미지 모두 삭제 후 여행 일지 삭제 가능
      // 삭제할 여행 일지 이미지 목록 가져오기
      const response = await fetch(`/diaries/${diary_id}/photos`);
      const { images } = await response.json();
      // 이미지 있으면 모두 삭제
      if (images) {
        for (let image of images) {
          await fetch(`/photos/${image.id}`, {
            method: 'DELETE',
          });
        }
      }
      const response2 = await fetch(`/diaries/${diary_id}`, {
        method: 'DELETE',
      });
      const { data } = await response2.json();
      if (response2.ok) {
        alert('여행 일지를 삭제했습니다.');
        location.href = '/';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
