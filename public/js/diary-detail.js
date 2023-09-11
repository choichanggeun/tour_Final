// 여행 일지, 이미지 조회
const getDiary = function () {
  // 특정 페이지에 있을 때 실행
  const currentPageURL = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  const targetPageURL = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
  if (currentPageURL === targetPageURL) {
    renderDiary(diary_id);
  }
};

// Function to render diary content
const renderDiary = async (diary_id) => {
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
      const row = document.getElementById('row');

      // Create a card element
      const diaryCard = document.createElement('div');
      diaryCard.classList.add('card');

      // Create a card body
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      // Diary title
      const title = document.createElement('h5');
      title.classList.add('card-title');
      title.textContent = `제목: ${data.title}`;

      // Append the title to the card body
      cardBody.appendChild(title);

      // Check if there are images to display
      if (images.length !== 0) {
        for (let image of images) {
          const diaryCardImage = document.createElement('img');
          diaryCardImage.classList.add('card-img-top');
          diaryCardImage.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;
          diaryCardImage.alt = 'Diary Image';
          diaryCard.appendChild(diaryCardImage);
        }
      } else {
        // Display a default image if there are no images
        const defaultImage = document.createElement('img');
        defaultImage.classList.add('card-img-top');
        defaultImage.src = 'https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png';
        defaultImage.alt = 'No Image Available';
        diaryCard.appendChild(defaultImage);
      }

      // Diary content
      const content = document.createElement('p');
      content.classList.add('card-text');
      content.textContent = `내용: ${data.content}`;

      // Append the content to the card body
      cardBody.appendChild(content);

      // Edit button
      const editButton = document.createElement('button');
      editButton.classList.add('btn', 'btn-primary', 'mt-3'); // btn-primary 클래스 추가
      editButton.innerHTML = `<a href="http://localhost:3000/diary-update.html?diary_id=${diary_id}">일지 수정</a>`;
      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-danger', 'mt-3'); // btn-danger 클래스 추가
      deleteButton.textContent = '일지 삭제';
      deleteButton.addEventListener('click', async () => {
        deleteDiary(diary_id);
      });

      // Append the buttons to the card body
      cardBody.appendChild(editButton);
      cardBody.appendChild(deleteButton);

      // Append the card body to the card
      diaryCard.appendChild(cardBody);

      // Append the card to the row
      row.appendChild(diaryCard);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};
// Call getDiary when the DOM is loaded
document.addEventListener('DOMContentLoaded', getDiary);

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
