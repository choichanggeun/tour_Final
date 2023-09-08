// 가져온 마지막 여행 일지 id
let cursor;

// 검색 기능
const searchButton = document.getElementById('search-diaries-button');
const searchInput = document.getElementById('search-diaries-input');

const urlParams = new URLSearchParams(window.location.search);
const search_data = urlParams.get('search_data');

searchInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    const searchInputValue = searchInput.value;
    window.location.href = `diary-all.html?search_data=${searchInputValue}`;
  }
});

searchButton.addEventListener('click', function () {
  const searchInputValue = searchInput.value;
  window.location.href = `diary-all.html?search_data=${searchInputValue}`;
});

// 초기 데이터 가져오기
getAllDiaries();

// 무한 스크롤
let timer;
addEventListener('scroll', function () {
  // 화면에 보여지는 높이, 스크롤 높이, 스크롤 가능한 전체 높이
  if (window.innerHeight + window.scrollY + 1000 >= document.body.scrollHeight) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        // 데이터 없으면 조회 멈추기
        if (cursor > 1) getAllDiaries();
      }, 100);
    }
  }
});

// 모든 여행 일지, 이미지 조회
async function getAllDiaries() {
  try {
    let response;
    if (search_data) {
      response = await fetch(`/search_diaries?cursor=${cursor}&search_data=${search_data}`, {
        method: 'GET',
      });
    } else {
      response = await fetch(`/diaries?cursor=${cursor}`, {
        method: 'GET',
      });
    }
    const response2 = await fetch('/diaries/photos', {
      method: 'GET',
    });
    const { data } = await response.json();
    const { images } = await response2.json();
    if (response.ok) {
      const cardList = document.getElementById('card-list');
      for (let diary of data) {
        let diaryImg;
        if (images) {
          for (let image of images) {
            if (diary.id === image.diary_id) {
              diaryImg = image;
              break;
            }
          }
        }
        cardList.innerHTML += `
                <div class="diary-card" id="diary-card">
                  <div class="diary-img-box" id="diaryImgBox${diary.id}"></div>
                  <div class="card-block">
                    <div class="diary-title">
                      <h2 class="title-small">${diary.title}</h2>
                      <h2 class="title-small">${diary.User.nickname}</h2>
                    </div>
                  </div>
                </div>
                `;
        if (diaryImg) {
          const diaryImgBox = document.getElementById(`diaryImgBox${diary.id}`);
          diaryImgBox.innerHTML += `
                <a href="http://localhost:3000/diary-detail.html?diary_id=${diary.id}"><img class="diary-img" src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${diaryImg.diary_img}" alt=""/></a>
                `;
        } else {
          const diaryImgBox = document.getElementById(`diaryImgBox${diary.id}`);
          diaryImgBox.innerHTML += `
                <a href="http://localhost:3000/diary-detail.html?diary_id=${diary.id}"><img class="diary-img" src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png" alt=""/></a>
                `;
        }
      }
      cursor = data[data.length - 1].id;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}
