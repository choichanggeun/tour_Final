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
renderDiaryCards();

// 무한 스크롤
let timer;
addEventListener('scroll', function () {
  // 화면에 보여지는 높이, 스크롤 높이, 스크롤 가능한 전체 높이
  if (window.innerHeight + window.scrollY + 1000 >= document.body.scrollHeight) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        renderDiaryCards();
      }, 100);
    }
  }
});

async function renderDiaryCards() {
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
    const { data } = await response.json();
    const { images } = await response2.json();
    if (response.ok) {
      const cardList = document.getElementById('card-list');

      for (let diary of data) {
        let diaryImg;
        if (images) {
          diaryImg = images.find((image) => diary.id === image.diary_id);
        }

        // Create a Bootstrap card
        const card = document.createElement('div');
        card.classList.add('card', 'custom-card', 'mb-4'); // Add custom-card class for styling
        card.style.maxWidth = '540px';

        // Create a card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Create a card title
        const cardTitleLabel = document.createElement('label'); // Label for title
        cardTitleLabel.textContent = '제목 ';
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title', 'custom-card-title'); // Add custom-card-title class for styling
        cardTitle.textContent = diary.title;

        // Create card text for the nickname
        const cardNicknameLabel = document.createElement('label'); // Label for nickname
        cardNicknameLabel.style.transform = 'translateY(-20px)'; // 간격을 조절합니다.
        cardNicknameLabel.textContent = '닉네임 ';
        const cardText = document.createElement('p');
        cardText.classList.add('card-text', 'custom-card-text'); // Add custom-card-text class for styling
        cardText.textContent = diary.User.nickname;

        // Create an anchor tag for the image
        const imageAnchor = document.createElement('a');
        imageAnchor.href = `http://localhost:3000/diary-detail.html?diary_id=${diary.id}`;

        // Create a div for image container and centering
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('text-center');

        // Create the image element
        const diaryImage = document.createElement('img');
        diaryImage.classList.add('img-fluid', 'rounded-start', 'card-img'); // Add card-img class for styling
        diaryImage.alt = '';
        diaryImage.style.width = '100px'; // Adjust image width as needed
        diaryImage.style.margin = '0 auto'; // Maintain aspect ratio
        diaryImage.src = diaryImg ? `https://final-tour-2.s3.ap-northeast-2.amazonaws.com/diary-img/${diaryImg.diary_img}` : 'https://final-tour-2.s3.ap-northeast-2.amazonaws.com/etc/no_img.png';

        // Append elements to card body
        cardBody.appendChild(cardTitleLabel);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(document.createElement('br')); // Add line break
        cardBody.appendChild(cardNicknameLabel);
        cardBody.appendChild(cardText);

        // Append image to image container
        imageContainer.appendChild(diaryImage);

        // Append image container to anchor tag
        imageAnchor.appendChild(imageContainer);

        // Append card body and image anchor to card
        card.appendChild(cardBody);
        card.appendChild(imageAnchor);

        // Append card to card list
        cardList.appendChild(card);
      }
      cursor = data[data.length - 1].id;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}
