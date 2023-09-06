// 서버에서 여행계획들의 데이터 가져오기
fetch('/like_tours')
  .then((response) => response.json())
  .then((result) => {
    var mainContentTour = document.querySelector('#main-content');
    if (!mainContentTour) {
      console.error('Error: Element with id "main-content" not found.');
      return;
    }
    mainContentTour.innerHTML = '';
    var tourDataList = result.result; // 응답 결과의 result 배열을 사용

    if (Array.isArray(tourDataList)) {
      tourDataList.forEach(function (item, index) {
        if (typeof item === 'object' && item !== null && Array.isArray(item.likes)) {
          // likes 속성이 배열인지 확인
          /* Tour Items */
          let tourItemElement = document.createElement('div');
          let titleElement = document.createElement('p');
          let userElement = document.createElement('p');
          let likesElement = document.createElement('p');
          let imgElement = document.createElement('img');

          titleElement.textContent = `제목: ${item.title}`;
          userElement.textContent = `작성자: ${item.nickname}`;

          const likeCount = item.likes.length;
          likesElement.textContent = `좋아요: ${likeCount}개`;

          imgElement.src = item.site_img;

          tourItemElement.appendChild(titleEllement); // 수정된 부분
          tourItemEllement.appendChild(userEllement);
          tourItemEllement.appendChild(likesEllement);
          tourItemEllement.appendChild(imgEllement);

          mainContentTour.appendChild(tourItemEllement);
        }
      });
    }
  })
  .catch((error) => console.error('Error:', error));
