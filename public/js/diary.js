// 여행 일지 작성, 사진 여러 장 업로드
const postDiary = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tour_id = urlParams.get('Id');
  const currentPageURL = window.location.href;
  const targetPageURL = `http://localhost:3000/diary-post.html?Id=${tour_id}`;
  if (currentPageURL === targetPageURL) {
    document.getElementById('diary-post-button').addEventListener('click', async () => {
      const diaryTitle = document.getElementById('diary-title').value;
      const diaryContent = document.getElementById('diary-content').value;
      const isPrivate = document.getElementById('private-checkbox').checked;
      const status = isPrivate ? 1 : 0;
      try {
        const response = await fetch(`/tours/${tour_id}/diaries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: diaryTitle,
            content: diaryContent,
            status: status,
          }),
        });
        const data = await response.json();
        postDiaryImg();
        const response2 = await fetch('/diaries', {
          method: 'GET',
        });
        const { data: data2 } = await response2.json();
        // HTTP status 200~299
        if (response.ok) {
          const diary_id = data2[data2.length - 1].id;
          alert(data.message);
          location.href = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
        } else {
          alert(data.errorMessage);
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

    try {
      // 여행 일지 id 가져오기
      const response = await fetch('/diaries', {
        method: 'GET',
      });
      const { data } = await response.json();
      await fetch(`/diaries/${data[data.length - 1].id}/photos`, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      alert('이미지 업로드를 실패했습니다.');
      console.error(error);
    }
  }
};

// 여행 일지 수정 페이지
const updateRenderDiary = function () {
  const currentPageURL = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  const targetPageURL = `http://localhost:3000/diary-update.html?diary_id=${diary_id}`;
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      const row = document.getElementById('row');

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
          row.innerHTML += `
            <div id='diaryBox${data.id}'>
              <label for="title">제목: </label>
              <input name="title" value="${data.title}" id="diary-title"></input>
            </div>
            `;
          if (images.length !== 0) {
            for (let image of images) {
              const diaryBox = document.getElementById(`diaryBox${data.id}`);
              diaryBox.innerHTML += `
                <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}" id="img${image.id}">
                <button id="img-delete-btn${image.id}">X</button>
              `;
            }
          } else {
            const diaryBox = document.getElementById(`diaryBox${data.id}`);
            diaryBox.innerHTML += `
                <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png">
              `;
          }
          const isChecked = data.status === '1' ? 'checked' : '';
          const diaryBox = document.getElementById(`diaryBox${data.id}`);
          diaryBox.innerHTML += `
            <label for="content">내용: </label>
            <textarea name="content" id="diary-content">${data.content}</textarea>
            <input type="file" id="diary-image" multiple />
            <label for="private">비공개: </label>
            <input type="checkbox" name="private" id="private-checkbox" ${isChecked}/>
            <button id='update-cancel-btn' >취소</button>
            <button id='diary-update-btn'>저장</button>
          `;
          const updateCancelBtn = document.getElementById('update-cancel-btn');
          if (updateCancelBtn) {
            updateCancelBtn.addEventListener('click', async function () {
              location.href = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
            });
          }

          document.addEventListener('click', async function (e) {
            let imgId;
            const img = e.target.previousElementSibling;
            if (img && img.tagName === 'IMG') {
              imgId = img.id;

              const photo_id = Number([...imgId].filter((n) => !isNaN(n) === true).join(''));
              deleteDiaryImg(photo_id);
            }
          });
          const diaryUpdateBtn = document.getElementById('diary-update-btn');
          if (diaryUpdateBtn) {
            diaryUpdateBtn.addEventListener('click', async function () {
              updateDiary(diary_id);
              updateImg();
            });
          }
        } else {
          alert('여행일지 수정에 실패했습니다.');
        }
      } catch (error) {
        alert('여행일지 수정에 실패했습니다.');
        console.error(error);
      }
    });
  }
};
updateRenderDiary();

// 여행 일지 수정
updateDiary = async function (diary_id) {
  const diaryTitle = document.getElementById('diary-title').value;
  const diaryContent = document.getElementById('diary-content').value;
  const isPrivate = document.getElementById('private-checkbox').checked;
  const status = isPrivate ? 1 : 0;

  try {
    const response = await fetch(`/diaries/${diary_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: diaryTitle,
        content: diaryContent,
        status: status,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      location.href = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
    } else {
      alert(data.errorMessage);
    }
  } catch (error) {
    alert('여행 일지 수정에 실패했습니다.');
    console.error(error);
  }
};

// 여행 일지 수정 페이지 이미지 업로드
const updateImg = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  const uploadImg = document.getElementById('diary-image').files;
  const formData = new FormData();
  if (uploadImg.length !== 0) {
    // 여러 이미지를 하나씩 formData에 할당
    for (let i = 0; i < uploadImg.length; i++) {
      formData.append('image', uploadImg[i]);
    }
  }
  try {
    await fetch(`/diaries/${diary_id}/photos`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    alert('이미지 업로드를 실패했습니다.');
    console.error(error);
  }
};

// 여행 일지 이미지 삭제
const deleteDiaryImg = async function (photo_id) {
  try {
    const response = await fetch(`/photos/${photo_id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok) {
      const img = document.getElementById(`img${photo_id}`);
      img.style.display = 'none';
      const imgDeleteBtn = document.getElementById(`img-delete-btn${photo_id}`);
      imgDeleteBtn.style.display = 'none';
      alert(data.message);
    } else {
      alert(data.errorMessage);
    }
  } catch (error) {
    console.error(error);
  }
};

// 여행 일지, 이미지 조회
const getDiary = function () {
  // 특정 페이지에 있을 때 실행
  const currentPageURL = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  const targetPageURL = `http://localhost:3000/diary-detail.html?diary_id=${diary_id}`;
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      const row = document.getElementById('row');
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
          if (images.length !== 0) {
            row.innerHTML += `
                <div id="diaryBox${data.id}">
                  <h5 style="padding: 1px; margin: 0 500px;">제목: ${data.title}</h5>
                </div>
                `;
            for (let image of images) {
              const diaryBox = document.getElementById(`diaryBox${data.id}`);
              diaryBox.innerHTML += `
                <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}">
                `;
            }
          } else {
            row.innerHTML += `
                <div id="diaryBox${data.id}">
                <h5 style="padding: 1px; margin: 0 500px;">제목: ${data.title}</h5>
                  <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png">
                </div>
              `;
          }
          const diaryBox = document.getElementById(`diaryBox${data.id}`);
          diaryBox.innerHTML += `
            <p>내용: ${data.content}</p>
            <button><a href="http://localhost:3000/diary-update.html?diary_id=${diary_id}">일지 수정</a></button>
            <button id="diary-delete-btn">일지 삭제</button>
            `;
          document.getElementById('diary-delete-btn').addEventListener('click', async function () {
            deleteDiary(diary_id);
          });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
};
getDiary();

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
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
};
getAllDiary();

// 여행 계획 여행 일지, 이미지 조회
const getTourDiary = function () {
  // 특정 페이지에 있을 때 실행
  const currentPageURL = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const tour_id = urlParams.get('Id');
  const targetPageURL = `http://localhost:3000/diary-tour.html?Id=${tour_id}`;
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
            row.innerHTML += `
              <div id='diaryBox${diary.id}'>
                <p>제목: ${diary.title}</p>
              </div>
              `;
            let count = 0;
            if (images) {
              for (let image of images) {
                if (diary.id === image.diary_id) {
                  const diaryBox = document.getElementById(`diaryBox${diary.id}`);
                  diaryBox.innerHTML += `
                    <a href="http://localhost:3000/diary-detail.html?diary_id=${diary.id}"><img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}"></a>
                    `;
                  count++;
                }
              }
              if (count === 0) {
                const diaryBox = document.getElementById(`diaryBox${diary.id}`);
                diaryBox.innerHTML += `
                <a href="http://localhost:3000/diary-detail.html?diary_id=${diary.id}"><img class="diary-img" src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png" alt=""/></a>
                `;
              }
            } else {
              const diaryBox = document.getElementById(`diaryBox${diary.id}`);
              diaryBox.innerHTML += `
              <a href="http://localhost:3000/diary-detail.html?diary_id=${diary.id}"><img class="diary-img" src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png" alt=""/></a>
              `;
            }
            const diaryBox = document.getElementById(`diaryBox${diary.id}`);
            diaryBox.innerHTML += `
                <p>내용: ${diary.content}</p>
              `;
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

// // 내 여행 일지, 이미지 조회
// const getMyDiary = function () {
//   // 특정 페이지에 있을 때 실행
//   const currentPageURL = window.location.href;
//   const urlParams = new URLSearchParams(window.location.search);
//   const user_id = urlParams.get('user_id');
//   const targetPageURL = `http://localhost:3000/diary-mypage.html?user_id=${user_id}`;
//   if (currentPageURL === targetPageURL) {
//     addEventListener('DOMContentLoaded', async function renderDiary() {
//       const row = document.getElementById('row');
//       try {
//         const response = await fetch('/my_diaries', {
//           method: 'GET',
//         });
//         const response2 = await fetch(`/diaries/photos`, {
//           method: 'GET',
//         });
//         const { data } = await response.json();
//         const { images } = await response2.json();
//         if (response.ok) {
//           for (let diary of data) {
//             row.innerHTML += `
//               <div id='diaryBox${diary.id}'>
//                 <p>제목: ${diary.title}</p>
//               </div>
//             `;
//             if (images) {
//               for (let image of images) {
//                 if (diary.id === image.diary_id) {
//                   const diaryBox = document.getElementById(`diaryBox${diary.id}`);
//                   diaryBox.innerHTML += `
//                   <img src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}">
//                   `;
//                 }
//               }
//             } else {
//               const diaryBox = document.getElementById(`diaryBox${diary.id}`);
//               diaryBox.innerHTML += `
//               <a href="http://localhost:3000/diary-detail.html?diary_id=${diary.id}"><img class="diary-img" src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png" alt=""/></a>
//               `;
//             }
//             row.innerHTML += `
//               <p>내용: ${diary.content}</p>
//             `;
//           }
//         } else {
//           alert(data.message);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     });
//   }
// };
// getMyDiary();
