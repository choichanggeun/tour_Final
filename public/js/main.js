const postUploadBtn = document.querySelector('#post-upload-btn');
postUploadBtn.addEventListener('click', async () => {
  const image = document.querySelector('#post-upload-img').files[0];
  const formData = new FormData();
  formData.append('image', image);
  try {
    await fetch('/banner', {
      method: 'POST',
      body: formData,
    });
    alert('게시글을 작성하였습니다.');
    window.location.href = '/';
  } catch (error) {
    console.log(error);
    alert('게시글 작성에 실패하였습니다.');
  }
});

//배너 생성
let slideIndex = 0;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const bannerUrls = ['https://kr.trip.com/sale/w/5433/2023krhotelhighlight.html?locale=ko_kr&pid=10650103058&promo_referer=14_5433_2', 'https://www.jejuair.net/ko/main/base/index.do', 'https://www.myrealtrip.com/promotions/myrealhocance_ep378', 'https://www.mangoplate.com/'];

window.onload = function () {
  getSiteData();
  checkLoggedInAdmin();

  fetch('/banner', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
      const banners = data.result;
      const bannerListbox = document.getElementById('bannerlistbox');

      banners.forEach((banner, index) => {
        // Add image src using banner.img
        const imgElement = document.createElement('img');
        imgElement.src = './img/' + banner.img;
        imgElement.alt = 'Banner image';
        imgElement.id = 'img' + (index + 1); // Assign unique ID to each image

        // Add click event listener to each image
        imgElement.addEventListener('click', function () {
          window.open(bannerUrls[index]); // Use the corresponding URL from the array
        });

        if (index === 0) {
          imgElement.classList.add('active'); // Make the first slide active initially
        }

        bannerListbox.appendChild(imgElement);
      });

      const slides = document.querySelectorAll('#bannerlistbox img');

      function prevSlide() {
        slideIndex--;
        if (slideIndex < 0) {
          slideIndex = slides.length - 1;
        }
        showSlide(slideIndex);
      }

      function showSlide(n) {
        for (let i = 0; i < slides.length; i++) {
          slides[i].classList.remove('active');
        }
        slides[n].classList.add('active');
      }

      function nextSlide() {
        slideIndex++;
        if (slideIndex > slides.length - 1) {
          slideIndex = 0;
        }
        showSlide(slideIndex);
      }
      nextBtn.addEventListener('click', nextSlide);
      prevBtn.addEventListener('click', prevSlide);
      setInterval(nextSlide, 3000);
    });
};
function getSiteData() {
  fetch('/first_toursite', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const site = data.result;
      siteCardBox.innerHTML = '';
      site.forEach((sites) => {
        const siteCard = `<div class="col-md-3" style="border-radius: 20px"> 
                              <a href="tour.html?id=${sites.id}">
                              <div class="card" style="border-radius: 20px">
                              <img class="img-fluid" style="width: 270px; height: 300px; border-radius: 20px" src=${sites.site_img} alt="" />
                              <div class="card-img-overlay"><span class="tag tag-pill tag-success">${sites.site_name}</span></div>
                              <div>
                                <div class="news-title">
                                </div>
                              </div>
                            </div>
                            </a>
                          </div>`;
        siteCardBox.innerHTML += siteCard;
      });
    });
}

function checkLoggedInAdmin() {
  fetch('/admin/me', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      // 응답 처리
      if (data.data) {
        document.querySelector('#post-upload-img').style.display = 'block';
        document.querySelector('#post-upload-btn').style.display = 'block';
        return data.data;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// enterInput.addEventListener('keyup', function (event) {
//   if (event.keyCode === 13) {
//     const searchInput = document.getElementById('search-input').value;
//     const search_type = '제목';
//     window.location.href = `tourSite.html?data=${searchInput}&type=${search_type}`;
//   }
// });

// searchButton.addEventListener('click', function () {
//   const searchInput = document.getElementById('search-input').value;
//   const search_type = '제목';
//   window.location.href = `tourSite.html?data=${searchInput}&type=${search_type}`;
// });
