document.addEventListener('DOMContentLoaded', async function () {
  // 페이지 로드 완료 시 동작 정의

  const urlParams = new URLSearchParams(window.location.search);
  const tour_id = urlParams.get('id');
  // Get logged-in user's email and display it
  await fetch(`/users`)
    .then((response) => response.json())
    .then(async (result) => {
      var nickNameBox = document.querySelector('#nickname-box');

      var nickName2 = document.createElement('span');
      nickName2.id = 'user-nickname';
      nickName2.textContent = `유저명 : ${result.data.nickname}`;

      var button = document.createElement('button');
      button.className = 'btn btn-primary w-100 mt-3';
      button.id = 'updateProfileButton';
      button.textContent = '프로필 변경';

      // 버튼 클릭시 회원정보 수정 창으로 이동
      button.addEventListener('click', function () {
        window.location.href = './mypage-profile.html'; // Open the new page in a new window/tab
      });

      nickNameBox.appendChild(nickName2);
      nickNameBox.appendChild(button);

      const userId = result.data.id; // assuming the user object has an 'id' field
    })
    .catch((error) => console.error('Error:', error));

  const imgElement = document.getElementById('img-element');

  imgElement.style.width = '200%';
  imgElement.style.height = 'auto';
});

// 여행 계획 커서 값
let tour_cursor;

//초기 데이터 가져오기
getMyTours();

// 무한 스크롤
let timer;
const planBox = document.getElementById('plan-box');
planBox.addEventListener('scroll', function () {
  // 화면에 보여지는 높이, 스크롤 높이, 스크롤 가능한 전체 높이
  if (planBox.clientHeight + planBox.scrollTop + 500 >= planBox.scrollHeight) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        getMyTours();
      }, 100);
    }
  }
});

// 여행계획 불러오기
function getMyTours() {
  fetch(`/mytours?tour_cursor=${tour_cursor}`)
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
            //제목과 이미지에 class를 부여해서 css 설정 가능하게 함
            titleElement.classList.add('title-element');
            imgElement.classList.add('img-element');
            //제목과 이미지 클릭시 여행계획 상세조회 화면으로 이동
            tourItemElement.addEventListener('click', function () {
              window.location.href = `tour-detail.html?id=${item.id}`;
            });

            tourItemElement.className = 'tour-item';

            titleElement.textContent = item.title;
            imgElement.src = item.TourSite.site_img;

            tourItemElement.appendChild(titleElement);
            tourItemElement.appendChild(imgElement);

            mainContentTour.appendChild(tourItemElement);
          }
        });
        tour_cursor = result.data[result.data.length - 1].id;
      }
    })
    .catch((error) => console.error('Error:', error));
}

// 여행 일지 커서 값
let diary_cursor;

// 초기 데이터 가져오기
getMyDiary();

// 무한 스크롤
let timer2;
const diaryBox = document.getElementById('diary-box');
diaryBox.addEventListener('scroll', function () {
  // 화면에 보여지는 높이, 스크롤 높이, 스크롤 가능한 전체 높이
  if (diaryBox.clientHeight + diaryBox.scrollTop + 500 >= diaryBox.scrollHeight) {
    if (!timer2) {
      timer2 = setTimeout(() => {
        timer2 = null;
        getMyDiary();
      }, 100);
    }
  }
});

// 내 여행 일지, 이미지 조회
async function getMyDiary() {
  try {
    const response = await fetch(`/my_diaries?diary_cursor=${diary_cursor}`, {
      method: 'GET',
      credentials: 'include', // 인증 정보 포함
    });
    const { data } = await response.json();

    if (response.ok) {
      var mainContentDiary = document.getElementById('main-content-diary');

      for (let diary of data) {
        // 다이어리 박스 생성
        let diaryBoxElement = document.createElement('div');
        diaryBoxElement.className = 'diary-item';

        // 다이어리 박스에 클릭 이벤트 리스너 추가
        diaryBoxElement.addEventListener('click', function () {
          window.location.href = `/diary-detail.html?diary_id=${diary.id}`;
        });
        // 다이어리 제목 추가
        let titleElement = document.createElement('p');
        titleElement.classList.add('title-element');
        titleElement.textContent = `제목: ${diary.title}`;
        diaryBoxElement.appendChild(titleElement);

        // 공개/비공개 상태 표시
        let statusElement = document.createElement('p');
        if (diary.status === '0') {
          statusElement.textContent = '상태: 공개';
        } else {
          statusElement.textContent = '상태: 비공개';
        }
        diaryBoxElement.appendChild(statusElement);

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

                imgElement.classList.add('img-element');

                diaryBoxElement.appendChild(imgElement);

                // 공개/비공개 상태 표시
                let statusElement = document.createElement('p');
                if (diary.status === '0') {
                  statusElement.textContent = '상태: 공개';
                } else {
                  statusElement.textContent = '상태: 비공개';
                }
                diaryBoxElement.appendChild(statusElement);
              }
            } else {
              let defaultImgElement = document.createElement('img');
              defaultImgElement.src = 'https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png';

              defaultImgElement.classList.add('img-element');

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
    }
    diary_cursor = data[data.length - 1].id;
  } catch (error) {
    console.error('Error fetching diaries:', error);
  }
}
