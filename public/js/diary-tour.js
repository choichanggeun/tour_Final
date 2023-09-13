// 여행 계획 여행 일지, 이미지 조회
const getTourDiary = function () {
  const currentPageURL = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const tour_id = urlParams.get('Id');
  const targetPageURL = `http://tourplan.store/diary-tour.html?Id=${tour_id}`;
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      const row = document.getElementById('row');
      try {
        const response = await fetch(`/tours/${Number(tour_id)}/diaries`, {
          method: 'GET',
        });
        const response2 = await fetch('/diaries/photos', {
          method: 'GET',
        });
        const { data } = await response.json();
        const { images } = await response2.json();
        if (response.ok) {
          for (let diary of data) {
            // 다이어리 카드 컨테이너 만들기
            const diaryCard = document.createElement('div');
            diaryCard.className = 'diary-card'; // class추가

            // 요소생성
            const titleElement = document.createElement('p');
            titleElement.textContent = `제목: ${diary.title}`;
            diaryCard.appendChild(titleElement);
            //위에 닉네임불러오게 넣기

            let count = 0;
            if (images) {
              for (let image of images) {
                if (diary.id === image.diary_id) {
                  // 이미지 생성
                  const imageElement = document.createElement('img');
                  imageElement.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;
                  // 이미지 링크로 래핑함
                  const imageLink = document.createElement('a');
                  imageLink.href = `http://tourplan.store/diary-detail.html?diary_id=${diary.id}`;
                  imageLink.appendChild(imageElement);
                  diaryCard.appendChild(imageLink);
                  count++;
                }
              }
              if (count === 0) {
                // 기본 이미지 요소 만들기
                const defaultImageElement = document.createElement('img');
                defaultImageElement.className = 'diary-img';
                defaultImageElement.src = 'https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png';
                // Wrap the default image with a link
                const defaultImageLink = document.createElement('a');
                defaultImageLink.href = `http://tourplan.store/diary-detail.html?diary_id=${diary.id}`;
                defaultImageLink.appendChild(defaultImageElement);
                diaryCard.appendChild(defaultImageLink);
              }
            } else {
              // 기본 이미지 요소 만들기
              const defaultImageElement = document.createElement('img');
              defaultImageElement.className = 'diary-img';
              defaultImageElement.src = 'https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png';
              // 기본 이미지 링크로 래핑함
              const defaultImageLink = document.createElement('a');
              defaultImageLink.href = `http://tourplan.store/diary-detail.html?diary_id=${diary.id}`;
              defaultImageLink.appendChild(defaultImageElement);
              diaryCard.appendChild(defaultImageLink);
            }

            // 내용 요소 생성
            const contentElement = document.createElement('p');
            contentElement.textContent = `내용: ${diary.content}`;
            contentElement.style.textAlign = 'center';
            diaryCard.appendChild(contentElement);

            // 행에 일지 카드 추가
            row.appendChild(diaryCard);
          }
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
};
getTourDiary();
