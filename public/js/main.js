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
const siteCardBox = document.getElementById('siteCardBox');
window.onload = function () {
  checkLoggedInStatus();
  checkLoggedInAdmin();
  getSiteData();
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
                                    <div class="news-media"><img class="img-fluid" src="/img-server/${banner.img}" alt="" /></div>
                                        <div class="news-title">
                                            <h2 class="title-large"><a href="#">우리집 고양이입니다.</a></h2>
                                        </div>
                                    <div class="news-des">말도 안듣고 밥만 먹고 잠만 자는 이상한 아이...</div>
                                    <div class="time-text"><strong>${banner.time}분 전</strong></div>
                                    <div></div>
                                </div>
                            </div>`;
          bannerListbox.innerHTML += bannerList;
        } else {
          const bannerList = `<div class="carousel-item">
                                <div class="news-block">
                                    <div class="news-media"><img class="img-fluid" src="/img-server/${banner.img}" alt="" /></div>
                                            <div class="news-title">
                                            <h2 class="title-large"><a href="#">우리집 고양이입니다.</a></h2>
                                        </div>
                                    <div class="news-des">말도 안듣고 밥만 먹고 잠만 자는 이상한 아이...</div>
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
// 사용자 정보 확인하여 로그인 상태에 따라 버튼 표시

function checkLoggedInStatus() {
  fetch('/users/me', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      // 응답 처리
      if (data.data) {
        const usernickname = document.getElementById('usernickname');
        usernickname.innerHTML = data.data.nickname;
        document.querySelector('#profileimg').style.display = 'block';
        document.querySelector('#loginbtn').style.display = 'none';
      } else {
        document.querySelector('#loginbtn').style.display = 'block';
        document.querySelector('#profileimg').style.display = 'none';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function logout() {
  fetch('/logout', {
    method: 'POST',
  })
    .then((response) => response.json())
    .then((data) => {
      alert('로그아웃 완료');
      window.location.href = '/';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

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
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
