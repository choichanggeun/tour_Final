document.addEventListener('DOMContentLoaded', async function () {
  // 페이지 로드 완료 시 동작 정의

  // Get logged-in user's email and display it
  await fetch(`/users`)
    .then((response) => response.json())
    .then((result) => {
      var nickNameBox = document.querySelector('#nickname-box');

      var nickName2 = document.createElement('div');
      nickName2.id = 'user-nickname';
      nickName2.textContent = `user nickname : ${result.data.nickname}`;

      var button = document.createElement('button');
      button.className = 'btn btn-primary w-100 mt-3';
      button.id = 'updateProfileButton';
      button.textContent = '프로필 변경';

      // 버튼 클릭시 회원정보 수정 창으로 이동
      button.addEventListener('click', function () {
        window.open('./mypage-profile.html'); // Open the new page in a new window/tab
      });

      nickNameBox.appendChild(nickName2);
      nickNameBox.appendChild(button);
    })
    .catch((error) => console.error('Error:', error));

  // Fetch tours data
  fetch(`/tours`)
    .then((response) => response.json())
    .then((result) => {
      // 성공 시 메인 컨텐츠 업데이트
      var mainContent = document.querySelector('#main-content');
      mainContent.innerHTML = ''; // 기존 내용 비우기
      var tourData = result.data;

      // data가 배열인 경우 각 요소(객체)의 속성을 <p> 태그로 출력
      if (Array.isArray(tourData)) {
        tourData.forEach(function (item, index) {
          if (typeof item === 'object' && item !== null) {
            // Create a new div element for each tour item
            var tourItem = document.createElement('div');
            tourItem.className = 'tour-item';

            var imgElement = document.createElement('img');
            imgElement.src = item.TourSite.site_img;
            imgElement.id = 'tour-img-' + index;
            imgElement.className = 'tour-img';

            var titleElement = document.createElement('p');
            titleElement.textContent = item.title;

            // Append the image and title to the new div element
            tourItem.appendChild(titleElement);
            tourItem.appendChild(imgElement);

            // Append the new div element to mainContent
            mainContent.appendChild(tourItem);

            imgElement.addEventListener('click', function () {
              alert(JSON.stringify(item, null, 2));
              // 위 코드는 모든 데이터를 팝업으로 표시합니다.
              // 원하는 방식으로 수정하실 수 있습니다.
            });
          }
        });
      }
    })
    .catch((error) => console.error('Error:', error));

  // Fetch diary data by id (add your diary_id)
  const diary_id = 'your_diary_id_here';

  fetch(`/diaries/${diary_id}`)
    .then((response) => response.json())
    .then((result) => {
      var mainContentDiary = document.querySelector('#main-content-diary');
      mainContentDiary.innerHTML = '';

      var diaryData = result.data;

      if (Array.isArray(diaryData)) {
        diaryData.forEach(function (item, index) {
          if (typeof item === 'object' && item !== null) {
            var diaryItem = document.createElement('div');
            diaryItem.className = 'diary-item';

            var titleElement = document.createElement('p');
            titleElement.textContent = item.title;

            diaryItem.appendChild(titleElement);

            mainContentDiary.appendChild(diaryItem);
          }
        });
      }
    })
    .catch((error) => console.error('Error:', error));
});
