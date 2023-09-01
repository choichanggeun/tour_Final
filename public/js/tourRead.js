document.addEventListener('DOMContentLoaded', async function () {
  // 페이지 로드 완료 시 동작 정의

  // Get logged-in user's email and display it
  await fetch(`/users`)
    .then((response) => response.json())
    .then(async (result) => {
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

      const userId = result.data.id; // assuming the user object has an 'id' field

      // Fetch tours data
      fetch(`/mytours`)
        .then((response) => response.json())
        .then((result) => {
          var mainContentTour = document.querySelector('#main-content');
          mainContentTour.innerHTML = '';
          var tourDataList = result.data;

          if (Array.isArray(tourDataList)) {
            tourDataList.forEach(function (item, index) {
              if (typeof item === 'object' && item !== null) {
                /* Tour Items */
                let tourItemElement = document.createElement('div');
                let titleElement = document.createElement('p');
                let imgElement = document.createElement('img');

                tourItemElement.className = 'tour-item';

                titleElement.textContent = item.title;
                imgElement.src = item.TourSite.site_img;

                tourItemElement.appendChild(titleElement);
                tourItemElement.appendChild(imgElement);

                mainContentTour.appendChild(tourItemElement);
              }
            });
          }
        })
        .catch((error) => console.error('Error:', error));

      /* Fetch diary data by id */
      fetch(`/diaries/${userId}`)
        .then((response) => response.json())
        .then((result) => {
          var mainContentDiary = document.querySelector('#main-content-diary');
          mainContentDiary.innerHTML = '';
          let diaryDataList = result.data;

          if (Array.isArray(diaryDataList)) {
            diaryDataList.forEach(function (item, index) {
              if (typeof item === 'object' && item !== null) {
                /* Diary Items */
                let diaryItemElement = document.createElement('div');
                let titleElement = document.createElement('p');

                titleElement.textContent = item.title;

                diaryItemElement.appendChild(titleElement);

                mainContentDiary.appendChild(diaryItemElement);
              }
            });
          }
        })
        .catch((error) => console.error('Error:', error));
    })
    .catch((error) => console.error('Error:', error));
});
