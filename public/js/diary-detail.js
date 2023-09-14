// DOM이 로드되면 getDiary 호출
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  getDiary(diary_id);
});

// 일지 내용을 조회
const getDiary = async (diary_id) => {
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

      // 카드 요소 생성
      const diaryCard = document.createElement('div');
      diaryCard.classList.add('card');

      // 카드 본문 만들기
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      // 일지제목
      const title = document.createElement('h5');
      title.classList.add('card-title');
      title.textContent = `제목: ${data.title}`;

      // 제목을 카드 본문에 추가
      cardBody.appendChild(title);

      // 표시할 이미지가 있는지 확인합니다
      if (images.length !== 0) {
        for (let image of images) {
          const diaryCardImage = document.createElement('img');
          diaryCardImage.classList.add('card-img-top');
          diaryCardImage.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;
          diaryCardImage.alt = 'Diary Image';
          diaryCard.appendChild(diaryCardImage);
        }
      } else {
        // 이미지가 없는 경우 기본 이미지 표시
        const defaultImage = document.createElement('img');
        defaultImage.classList.add('card-img-top');
        defaultImage.src = 'https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png';
        defaultImage.alt = 'No Image Available';
        diaryCard.appendChild(defaultImage);
      }

      // 일지내용
      const content = document.createElement('p');
      content.classList.add('card-text');
      content.textContent = `내용: ${data.content}`;

      // 카드 본문에 내용 추가
      cardBody.appendChild(content);

      // 편집버튼
      const editButton = document.createElement('button');
      editButton.classList.add('btn', 'btn-primary', 'mt-3'); // btn-primary 클래스 추가
      editButton.innerHTML = `<a href="http://tourplan.store/diary-update.html?diary_id=${diary_id}">일지 수정</a>`;
      // 삭제버튼
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-danger', 'mt-3'); // btn-danger 클래스 추가
      deleteButton.textContent = '일지 삭제';
      deleteButton.addEventListener('click', async () => {
        deleteDiary(diary_id);
      });

      // 카드 본체에 버튼 추가
      cardBody.appendChild(editButton);
      cardBody.appendChild(deleteButton);

      // 카드 본체를 카드에 추가합니다
      diaryCard.appendChild(cardBody);

      // 카드를 행에 추가합니다
      row.appendChild(diaryCard);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};

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
