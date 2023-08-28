window.onload = function () {
  createMap();
  checkLoggedInStatus();
};
const tourId = 1;
const siteListBox = document.getElementById('siteCardBox');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');

searchBtn.addEventListener('click', function () {
  const searchInputValue = document.getElementById('search-input').value;
  loadSearchSiteItem(searchInputValue);
});
searchInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    const searchInputValue = document.getElementById('search-input').value;
    loadSearchSiteItem(searchInputValue);
  }
});

//검색 기능
function loadSearchSiteItem(search_site) {
  fetch(`/searchtour/${search_site}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      siteListBox.innerHTML = '';
      data.result.forEach((site) => {
        const siteCard = `<div id="card" width="300" height="400">
                                <div class="info" id=${site.id} >
                                    <div class="body">
                                    <div class="img">
                                        <img src="${site.site_img}" width="100%" height="auto" />
                                    </div>
                                    <div class="title"><strong><p3>${site.site_name}</p3></strong></div>
                                    <div class="ellipsis">${site.site_address}</div>
                                    </div>
                                </div>
                            </div>`;
        siteListBox.innerHTML += siteCard;
        const card = document.getElementById('card');

        card.addEventListener('click', function () {
          fetch(`/redis/${tourId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: `${site.id}` }),
          })
            .then((response) => response.json())
            .then((data) => {
              alert('test');
            })
            .catch((error) => {
              console.error(error);
            });
        });
      });
    });
}

//로그인 여부, 유저 이름 불러오기
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
      }
    });
}

//지도 생성 함수
function createMap() {
  let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
  let options = {
    //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
    level: 3, //지도의 레벨(확대, 축소 정도)
  };

  let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
}

//지도에 이벤트 생성하기 위도, 경도, 이미지, 이름, 주소순으로 받아서 멥에 표시
function panTo(Lat, Lng, img, name, address) {
  //지도 이동
  let moveLatLon = new kakao.maps.LatLng(Lat, Lng);
  map.panTo(moveLatLon);
  //마커 생성
  let markerPosition = new kakao.maps.LatLng(Lat, Lng);
  let marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  marker.setMap(map);

  //생성된 마커에 이벤트 부여
  let iwContent = `
      <div class="wrap" width="300" height="400">
          <div class="info">
              <div class="title">
                  ${name}
                  <div class="close" onclick="closeOverlay()" title="닫기"></div>
              </div>
              <div class="body">
                  <div class="img">
                      <img src="${img}" width="300" height="250">
                 </div>
                      <div class="ellipsis">${address}</div>
              </div>
          </div>
      </div>`, //이 부분이 클릭했을 때 나오는 div
    iwRemoveable = true;

  let infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable,
  });

  kakao.maps.event.addListener(marker, 'click', function () {
    infowindow.open(map, marker);
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
