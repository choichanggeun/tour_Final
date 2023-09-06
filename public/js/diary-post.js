// 여행 일지 작성, 사진 여러 장 업로드
const postDiary = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tour_id = urlParams.get('Id');
  const currentPageURL = window.location.href;
  const targetPageURL = `http://localhost:3000/diary-post.html?Id=${tour_id}`;
  if (currentPageURL === targetPageURL) {
    document.getElementById('diary-post-button').addEventListener('click', async () => {
      const diaryTitle = document.getElementById('diary-title').value;
      const diaryContent = document.getElementById('diary-content').value;
      const isPrivate = document.getElementById('private-checkbox').checked;
      const status = isPrivate ? 1 : 0;
      try {
        const response = await fetch(`/tours/${tour_id}/diaries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: diaryTitle,
            content: diaryContent,
            status: status,
          }),
        });
        const data = await response.json();
        postDiaryImg();
        const response2 = await fetch('/diaries', {
          method: 'GET',
        });
        const { data: data2 } = await response2.json();
        // HTTP status 200~299
        if (response.ok) {
          const diary_id = data2[data2.length - 1].id;
          alert(data.message);
          location.href = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert('여행일지 작성에 실패했습니다.');
        console.error(error);
      }
    });
  }
};
postDiary();

// 이미지 업로드
const postDiaryImg = async function () {
  const uploadImg = document.getElementById('diary-image').files;
  const formData = new FormData();
  if (uploadImg.length !== 0) {
    // 여러 이미지를 하나씩 formData에 할당
    for (let i = 0; i < uploadImg.length; i++) {
      formData.append('image', uploadImg[i]);
    }

    try {
      // 여행 일지 id 가져오기
      const response = await fetch('/diaries', {
        method: 'GET',
      });
      const { data } = await response.json();
      await fetch(`/diaries/${data[data.length - 1].id}/photos`, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      alert('이미지 업로드를 실패했습니다.');
      console.error(error);
    }
  }
};
