// 여행 일지 작성, 사진 여러 장 업로드
const postDiary = function () {
  const currentPageURL = window.location.href;
  const targetPageURL = 'http://localhost:3000/diary-post.html';
  if (currentPageURL === targetPageURL) {
    document.getElementById('diary-post-button').addEventListener('click', async () => {
      const diaryTitle = document.getElementById('diary-title').value;
      const diaryContent = document.getElementById('diary-content').value;

      try {
        const response = await fetch('/tours/3/diaries', {
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
    // 여행 일지 id 가져오기
    const response = await fetch('/diaries', {
      method: 'GET',
    });
    const { data } = await response.json();
    const response2 = await fetch(`/diaries/${data[data.length - 1].id}/photos`, {
      method: 'POST',
      body: formData,
    });
    const data2 = await response2.json();
    if (response.ok) {
      alert('여행 일지를 작성했습니다.');
      location.reload();
    } else {
      alert(data2.message);
    }
  } catch (error) {
    alert('여행 일지 작성에 실패했습니다.');
    console.error(error);
  }
};

// 여행 일지 수정
const updateDiary = function () {
  const currentPageURL = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('diary_id');
  const targetPageURL = 'http://localhost:3000/diary-post.html?';
  if (currentPageURL === targetPageURL) {
    document.getElementById('diary-post-button').addEventListener('click', async () => {
      const diaryTitle = document.getElementById('diary-title').value;
      const diaryContent = document.getElementById('diary-content').value;

      try {
        const response = await fetch('/tours/3/diaries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: diaryTitle,
            content: diaryContent,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          postDiaryImg();
          deleteDiaryImg();
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
updateDiary();

// 이미지 삭제
const deleteDiaryImg = async function () {
  const uploadImg = document.getElementById('diary-image').files;
  const formData = new FormData();
  if (uploadImg.length !== 0) {
    // 여러 이미지를 하나씩 formData에 할당
    for (let i = 0; i < uploadImg.length; i++) {
      formData.append('image', uploadImg[i]);
    }
  }
  try {
    // 여행 일지 id 가져오기
    const response = await fetch('/diaries', {
      method: 'GET',
    });
    const { data } = await response.json();
    const response2 = await fetch(`/diaries/${data[data.length - 1].id}/photos`, {
      method: 'POST',
      body: formData,
    });
    const data2 = await response2.json();
    if (response.ok) {
      alert('여행 일지를 작성했습니다.');
      location.reload();
    } else {
      alert(data2.message);
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
          row.innerHTML += `
            <div id='diaryBox${data.id}'>
              <p>제목: ${data.title}</p>
              <p>내용: ${data.content}</p>
            </div>
            `;
          if (images) {
            for (let image of images) {
              const diaryBox = document.getElementById(`diaryBox${data.id}`);
              const img = document.createElement('img');
              img.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;
              diaryBox.appendChild(img);
            }
          } else {
            const diaryBox = document.getElementById(`diaryBox${data.id}`);
            const img = document.createElement('img');
            img.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png`;
            diaryBox.appendChild(img);
          }
          row.innerHTML += `
            <button><a href="http://localhost:3000/diary-update.html?diary_id=${diary_id}">수정</a></button>
            <button id="diary-delete-btn">삭제</button>
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
          const row = document.getElementById('row');
          let count = 4;
          for (let diary of data) {
            let diaryImg;
            for (let image of images) {
              if (diary.id === image.diary_id) {
                diaryImg = image;
                break;
              }
            }
            if (count % 4 === 0) {
              row.innerHTML += `
              <div class="row-md-3" id="cardList${~~(count / 4)}">
                <div class="card" id="card${count - 3}">
                  <a href="http://localhost:3000/diary-detail.html?diary_id=${diary.id}"><img class="img-fluid" src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${diaryImg.diary_img}" alt="" /></a>
                  <div class="card-block">
                    <div class="news-title">
                      <h2 class="title-small">${diary.title}</h2>
                    </div>
                  </div>
                </div>
              </div>
              `;
            } else {
              const cardList = document.getElementById(`cardList${~~(count / 4)}`);
              cardList.innerHTML += `
              <div class="card" id="card${count - 3}">
                <a href="http://localhost:3000/diary-detail.html?diary_id=${diary.id}"><img class="img-fluid" src="https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${diaryImg.diary_img}" alt="" /></a>
                  <div class="card-block">
                    <div class="news-title">
                      <h2 class="title-small">${diary.title}</h2>
                    </div>
                  </div>
                </div>
              `;
            }
            count++;
          }

          while (count % 4 !== 0) {
            console.log(count);
            const cardList = document.getElementById(`cardList${~~(count / 4)}`);
            cardList.innerHTML += `
              <div class="card" id="card${count - 3}" style="visibility: hidden;">
                  <img class="img-fluid" src="" alt="" />
                  <div class="card-block">
                    <div class="news-title">
                      <h2 class="title-small"></h2>
                    </div>
                  </div>
                </div>
              `;
            count++;
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
  const urlParams = new URLSearchParams(window.location.search);
  const user_id = urlParams.get('user_id');
  const targetPageURL = `http://localhost:3000/diary-mypage.html?user_id=${user_id}`;
  if (currentPageURL === targetPageURL) {
    addEventListener('DOMContentLoaded', async function renderDiary() {
      const row = document.getElementById('row');
      try {
        const response = await fetch('/my_diaries', {
          method: 'GET',
        });
        const response2 = await fetch(`/diaries/photos`, {
          method: 'GET',
        });
        const { data } = await response.json();
        const { images } = await response2.json();
        if (response.ok) {
          for (let diary of data) {
            row.innerHTML += `
                <div id='diaryBox${diary.id}'>
                  <p>제목: ${diary.title}</p>
                  <p>내용: ${diary.content}</p>
                  </div>
                  `;
            for (let image of images) {
              if (diary.id === image.diary_id) {
                const diaryBox = document.getElementById(`diaryBox${diary.id}`);
                const img = document.createElement('img');
                img.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;
                diaryBox.appendChild(img);
              }
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
  const urlParams = new URLSearchParams(window.location.search);
  const tour_id = urlParams.get('tour_id');
  const targetPageURL = `http://localhost:3000/diary-tour.html?tour_id=${tour_id}`;
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
                <p>내용: ${diary.content}</p>
              </div>
              `;
            for (let image of images) {
              if (diary.id === image.diary_id) {
                const diaryBox = document.getElementById(`diaryBox${diary.id}`);
                const img = document.createElement('img');
                img.src = `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${image.diary_img}`;
                diaryBox.appendChild(img);
              }
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

const loadComments = function () {
  document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentList = document.getElementById('comment-list');
    const diaryContainer = document.querySelector('.diary');
    const diary_id = parseInt(diaryContainer.dataset.diary_id, 10);
    console.log('diary_id:', diary_id);
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const content = commentInput.value.trim();
      if (!content) return;
      createComment(content).then(() => {
        commentInput.value = '';
        loadComments();
      });
    });
    commentList.addEventListener('click', async (e) => {
      if (e.target.classList.contains('edit-comment-btn') || e.target.classList.contains('delete-comment-btn')) {
        const commentElement = e.target.closest('li.list-group-item');
        const comment_idAttr = commentElement.getAttribute('data-comment-id');
        const comment_id = comment_idAttr ? parseInt(comment_idAttr, 10) : null;
        if (e.target.classList.contains('edit-comment-btn')) {
          const content = prompt('수정할 내용을 입력해주세요');
          if (content !== null && comment_id !== null) {
            await updateComment(comment_id, content);
            await loadComments();
          }
        } else if (e.target.classList.contains('delete-comment-btn')) {
          if (confirm('댓글을 삭제하시겠습니까?')) {
            if (comment_id) {
              await deleteComment(comment_id);
              await loadComments();
            } else {
              console.error('댓글을 삭제할 수 없습니다. comment_id가 정의되지 않았습니다.');
            }
          }
        }
      }
    });
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const formatter = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return formatter.format(date);
    };
    const loadComments = async () => {
      const comments = await findComment();
      commentList.innerHTML = comments
        .map(
          (comment) =>
            `<li class="list-group-item" data-comment-id="${comment.comment_id}">
    ${comment.name}: ${comment.content}
    <span class="text-muted">${formatDate(comment.updatedAt)}</span>
    <button class="btn btn-sm btn-outline-secondary edit-comment-btn">수정</button>
    <button class="btn btn-sm btn-outline-danger delete-comment-btn">삭제</button>
    </li>`
        )
        .join('');
      console.log('Generated HTML:', commentList.innerHTML);
    };
    const findComment = async () => {
      const response = await fetch(`/diaries/${diary_id}/comments`);
      const data = await response.json();
      console.log('comments data:', data);
      return data.data;
    };
    const createComment = async (content) => {
      const response = await fetch(`/diaries/${diary_id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': '/application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        const responseText = await response.text();
        console.error(`Response Text: ${responseText}`);
        throw new Error('Error creating comment');
      }
      const newComment = await response.json();
      return newComment.id;
    };
    const updateComment = async (comment_id, content) => {
      const response = await fetch(`/comments/${comment_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        const responseText = await response.text();
        console.error(`Response Text: ${responseText}`);
        throw new Error('Error updating comment');
      }
      const updatedComment = await response.json();
      return updatedComment;
    };
    const deleteComment = async (comment_id) => {
      const response = await fetch(`/comments/${comment_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        const responseText = await response.text();
        console.error(`Response Text: ${responseText}`);
        throw new Error('Error deleting comment');
      }
      return response.json();
    };

    loadComments();
  });
};
