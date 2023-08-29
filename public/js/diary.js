// 여행 일지 작성, 사진 여러 장 업로드
const postDiary = function () {
  const currentPageURL = window.location.href;
  const targetPageURL = 'http://localhost:3000/diary-post.html';
  if (currentPageURL === targetPageURL) {
    document.getElementById('diary-post-button').addEventListener('click', async () => {
      const diaryTitle = document.getElementById('diary-title').value;
      const diaryContent = document.getElementById('diary-content').value;

      try {
        const response = await fetch('/tours/2/diaries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: diaryTitle,
            content: diaryContent,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          postDiaryImg();
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
  }
  try {
    const response = await fetch('/diaries/1/photos', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      alert('여행 일지를 작성했습니다.');
      location.reload();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('여행 일지 작성에 실패했습니다.');
    console.error(error);
  }
};

// 여행 일지, 이미지 조회
const getDiary = function () {
  // 특정 페이지에 있을 때 실행
  const currentPageURL = window.location.href;
  const targetPageURL = 'http://localhost:3000/diary-detail.html';
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      const diaryList = document.getElementById('diaryList');
      try {
        const response = await fetch('/diaries/1', {
          method: 'GET',
        });
        const response2 = await fetch('/diaries/1/photos', {
          method: 'GET',
        });
        const { data } = await response.json();
        const { images } = await response2.json();
        if (response.ok) {
          diaryList.innerHTML += `
          <div id='diaryBox${data.id}'>
            <p>제목: ${data.title}</p>
            <p>내용: ${data.content}</p>
            </div>
            `;
          for (let image of images) {
            const diaryBox = document.getElementById(`diaryBox${data.id}`);
            const img = document.createElement('img');
            img.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;
            diaryBox.appendChild(img);
          }
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    });
  }
};
getDiary();

// 모든 여행 일지, 이미지 조회
const getAllDiary = function () {
  // 특정 페이지에 있을 때 실행
  const currentPageURL = window.location.href;
  const targetPageURL = 'http://localhost:3000/diary-all.html';
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      try {
        const response = await fetch('/diaries', {
          method: 'GET',
        });
        const response2 = await fetch('/diaries/photos', {
          method: 'GET',
        });
        const { data } = await response.json();
        const { images } = await response2.json();
        console.log(data);
        console.log(images);
        if (response.ok) {
          const row = document.getElementById('row');
          let count = 4;
          for (let diary of data) {
          }
          if (count % 4 === 0) {
            row.innerHTML += `
            <div class="col-md-3">
              <div class="card">
                <img class="img-fluid" src="img/media-1.jpg" alt="" />
                <div class="card-img-overlay"><span class="tag tag-pill tag-danger">News</span></div>
                <div class="card-block">
                  <div class="news-title">
                    <h2 class="title-small"><a href="#">Syria war: Why the battle for Aleppo matters</a></h2>
                  </div>
                  <p class="card-text">
                    <small class="text-time"><em>3 mins ago</em></small>
                  </p>
                </div>
              </div>
            </div>
            `;
          } else {
            row.innerHTML += `
            <div class="card">
                <img class="img-fluid" src="img/media-1.jpg" alt="" />
                <div class="card-img-overlay"><span class="tag tag-pill tag-danger">News</span></div>
                <div class="card-block">
                  <div class="news-title">
                    <h2 class="title-small"><a href="#">Syria war: Why the battle for Aleppo matters</a></h2>
                  </div>
                  <p class="card-text">
                    <small class="text-time"><em>3 mins ago</em></small>
                  </p>
                </div>
              </div>
            `;
          }

          for (let diary of data) {
            if (count % 4 === 0) {
              const row_md_3 = document.createElement('div');
              row_md_3.className = 'row-md-3';
              console.log(row);
              console.log(row_md_3);
              row.appendChild(row_md_3);
              console.log(count);
            }
            count++;
            const row_md_3 = document.querySelector('.row-md-3');
            const card = document.createElement('div');
            card.className = 'card';
            card.id = `diaryBox${diary.id}`;
            row_md_3.appendChild(card);
            for (let image of images) {
              if (diary.id === image.diary_id) {
                const diaryBox = document.getElementById(`diaryBox${diary.id}`);
                const img = document.createElement('img');
                img.id = 'img';
                img.className = 'img-fluid';
                img.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;
                diaryBox.appendChild(img);
                break;
              }
            }
            const img = document.getElementById('img');
            const card_block = document.createElement('div');
            card_block.className = 'card-block';
            img.appendChild(card_block);
            const news_title = document.createElement('div');
            news_title.className = 'news-title';
            card_block.appendChild(news_title);
            const title_small = document.createElement('h2');
            title_small.className = 'title-small';
            title_small.innerText = `${diary.title}`;
            news_title.appendChild(title_small);
          }
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    });
  }
};
getAllDiary();

// 내 여행 일지, 이미지 조회
const getMyDiary = function () {
  // 특정 페이지에 있을 때 실행
  const currentPageURL = window.location.href;
  const targetPageURL = 'http://localhost:3000/mypage.html';
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      const diaryList = document.getElementById('diaryList');
      try {
        const response = await fetch('/my_diaries', {
          method: 'GET',
        });
        const { data } = await response.json();
        if (response.ok) {
          for (let diary of data) {
            if (!diary.diary_img) {
              diaryList.innerHTML += `
                <div id='diaryBox${diary.id}'>
                  <h3>${diary.id}번째 일지</h3>
                  <p>제목: ${diary.title}</p>
                  <p>내용: ${diary.content}</p>
                  </div>
                  `;
            } else {
              const diaryBox = document.getElementById(`diaryBox${diary.diary_id}`);
              const img = document.createElement('img');
              img.src = `/img-server/${diary.diary_img}`;
              diaryBox.appendChild(img);
            }
          }
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    });
  }
};
getMyDiary();

// 여행 계획 여행 일지, 이미지 조회
const getTourDiary = function () {
  // 특정 페이지에 있을 때 실행
  const currentPageURL = window.location.href;
  const targetPageURL = 'http://localhost:3000/diary-tour.html';
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      const diaryList = document.getElementById('diaryList');
      try {
        const response = await fetch('/diaries', {
          method: 'GET',
        });
        const { data } = await response.json();
        if (response.ok) {
          for (let diary of data) {
            if (!diary.diary_img) {
              diaryList.innerHTML += `
                <div id='diaryBox${diary.id}'>
                  <h3>${diary.id}번째 일지</h3>
                  <p>제목: ${diary.title}</p>
                  <p>내용: ${diary.content}</p>
                  </div>
                  `;
            } else {
              const diaryBox = document.getElementById(`diaryBox${diary.diary_id}`);
              const img = document.createElement('img');
              img.src = `/img-server/${diary.diary_img}`;
              diaryBox.appendChild(img);
            }
          }
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    });
  }
};
getTourDiary();
