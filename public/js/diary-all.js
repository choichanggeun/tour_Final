const renderDiaryCards = async () => {
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
      cardList.innerHTML = ''; // Clear existing content

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
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};

// Call renderDiaryCards when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderDiaryCards);
