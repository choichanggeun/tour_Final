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

const indicators = document.getElementById('carousel-indicators');
const bannerListbox = document.getElementById('bannerlistbox');
const searchButton = document.getElementById('search-button');
const enterInput = document.getElementById('search-input');
window.onload = function () {
  getSiteData();
  checkLoggedInAdmin();
  fetch('/banner', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const banner = data.result;
      bannerListbox.innerHTML = '';
      indicators.innerHTML = '';
      let i = 0;
      banner.forEach((banner) => {
        const indicatorslist = `<li data-target="#carousel-example-generic" data-slide-to="${i}" class="active"></li>`;
        if (i === 0) {
          const bannerList = `<div class="carousel-item active">
                                <div class="news-block">
                                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdLrQJoFlr8fub--LXA5WF-UpbFAx69DHZaAqJ13i5V1taEDg/viewform?usp=sf_link" target="_blank">
                                    <div class="news-media"><img class="img-fluid" src="${banner.img}" alt="" /></div>
                                    </a>
                                        <div class="news-title">
                                            <h2 class="title-large"><a href="#">저희 사이트를 평가해주세요.</a></h2>
                                        </div>
                                    <div class="news-des">이미지를 클릭하면 구글 폼이 나옵니다...</div>
                                    <div class="time-text"><strong>${banner.time}분 전</strong></div>
                                    <div></div>
                                </div>
                            </div>`;
          bannerListbox.innerHTML += bannerList;
        } else {
          const bannerList = `<div class="carousel-item">
                                <div class="news-block">
                                    <div class="news-media"><img class="img-fluid" src="${banner.img}" alt="" /></div>
                                            <div class="news-title">
                                            <h2 class="title-large"><a href="#">여러분의 여행을 지금 바로 만들어보세요.</a></h2>
                                        </div>
                                    <div class="news-des">친구들 혹은 가족들과 오붓한 시간을 보내며 여행을 떠나보세요.</div>
                                    <div class="time-text"><strong>${banner.time}분 전</strong></div>
                                    <div></div>
                                </div>
                            </div>`;
          bannerListbox.innerHTML += bannerList;
        }
        indicators.innerHTML += indicatorslist;
        i++;
      });
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

enterInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    const searchInput = document.getElementById('search-input').value;
    const search_type = '제목';
    window.location.href = `tourSite.html?data=${searchInput}&type=${search_type}`;
  }
});

searchButton.addEventListener('click', function () {
  const searchInput = document.getElementById('search-input').value;
  const search_type = '제목';
  window.location.href = `tourSite.html?data=${searchInput}&type=${search_type}`;
});
