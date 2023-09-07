fetch('/like_tours')
  .then((response) => response.json())
  .then((data) => {
    var mainContentTour = document.querySelector('#main-content');
    if (!mainContentTour) {
      console.error('Error: Element with id "main-content" not found.');
      return;
    }

    mainContentTour.innerHTML = ''; // 기존 내용 초기화

    var tourDataList = data.result;

    if (Array.isArray(tourDataList)) {
      tourDataList.forEach(function (item, index) {
        /* Tour Items */
        let tourItemElement = document.createElement('div');
        tourItemElement.className = 'tour-card';
        tourItemElement.style.cursor = 'pointer'; // 카드에 마우스 커서 올렸을때 커서모양 변하게 함
        let titleElement = document.createElement('p');
        let userElement = document.createElement('p');

        // 좋아요 이미지와 텍스트 요소 생성
        let likesElement = document.createElement('span');
        let likesImageElement = document.createElement('img');

        likesImageElement.src = 'img/likeimg.png'; // 여기에 실제 이미지 경로 입력 img/media-8.jpg
        likesImageElement.className = 'like-img';

        // 사이트 이름 요소 생성
        let siteNameElement = document.createElement('p');

        // 좋아요 개수 텍스트 요소 생성
        let likeCountText = item.likeCount ? ` : ${item.likeCount}` : ' : 0';
        let likeCountTextNode = document.createTextNode(likeCountText);

        // 좋아요 요소에 이미지와 텍스트 추가
        likesElement.appendChild(likesImageElement);
        likesElement.appendChild(likeCountTextNode);

        let img_element = document.createElement('img');

        titleElement.textContent = `제목: ${item.title}`;
        userElement.textContent = `작성자: ${item.nickname}`;

        img_element.src = item.site_img;

        siteNameElement.textContent = ` ${item.site_name}`;

        // 카드 클릭시 여행계획 상세조회 화면으로 이동
        tourItemElement.addEventListener('click', function () {
          window.location.href = `tour-detail.html?id=${item.id}`;
        });

        tourItemElement.appendChild(siteNameElement);
        tourItemElement.appendChild(titleElement);
        tourItemElement.appendChild(userElement);
        tourItemElement.appendChild(likesElement);
        tourItemElement.appendChild(img_element);

        mainContentTour.appendChild(tourItemElement);
      });
    }
  })
  .catch((error) => console.error('Error:', error));
