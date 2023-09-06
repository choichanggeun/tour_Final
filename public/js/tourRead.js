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

      // 내 여행 일지, 이미지 조회
      const getMyDiary = async function () {
        try {
          const response = await fetch('/my_diaries', {
            method: 'GET',
            credentials: 'include', // 인증 정보 포함
          });
          const { data } = await response.json();

          if (response.ok) {
            var mainContentDiary = document.getElementById('main-content-diary');
            mainContentDiary.innerHTML = '';

            for (let diary of data) {
              // 다이어리 박스 생성

              let diaryBoxElement = document.createElement('div');
              diaryBoxElement.className = 'diary-item';

              // 다이어리 제목 추가
              let titleElement = document.createElement('p');
              titleElement.textContent = `제목: ${diary.title}`;
              diaryBoxElement.appendChild(titleElement);

              // 이미지 가져오기
              try {
                const imageResponse = await fetch(`/diaries/${diary.id}/photos`, {
                  method: 'GET',
                  credentials: 'include', // 인증 정보 포함
                });

                if (imageResponse.ok) {
                  const { images } = await imageResponse.json();

                  if (images.length > 0) {
                    for (let image of images) {
                      let imgElement = document.createElement('img');
                      imgElement.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;

                      diaryBoxElement.appendChild(imgElement);
                    }
                  } else {
                    let defaultImgElement = document.createElement('img');
                    defaultImgElement.src = 'https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png';

                    diaryBoxElement.appendChild(defaultImgElement);
                  }
                }

                // 다이어리 내용 추가
                let contentParagraph = document.createElement('p');
                contentParagraph.textContent = `내용: ${diary.content}`;

                diaryBoxElement.appendChild(contentParagraph);

                mainContentDiary.appendChild(diaryBoxElement);
              } catch (error) {
                console.error('Error fetching images:', error);
              }
            }
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error('Error fetching diaries:', error);
        }
      };

      getMyDiary();
    })
    .catch((error) => console.error('Error:', error));
});
