//창이 열리면 실행되는 목록
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tour_site_id = urlParams.get('id');
  const tour_id = urlParams.get('tourId');
  checkLoggedInStatus();
  if (tour_site_id) {
    createTour(tour_site_id);
  }
  if (tour_id) {
    let day = document.getElementById('tourDays').value;
    TourDayCheck(tour_id);
    restartTour(tour_id, day);
  }
};

const urlParams = new URLSearchParams(window.location.search);
const tour_id = urlParams.get('tourId');
const startChatting = document.getElementById('startChatting');
const siteListBox = document.getElementById('siteCardBox');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');
const tourDays = document.getElementById('tourDays');
const createTourBtn = document.getElementById('createTour');
var markers = [];
let i = 0;
let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
let options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};
let map = new kakao.maps.Map(container, options);

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
      let day = checkday();
      siteListBox.innerHTML = '';
      data.result.forEach((site) => {
        const siteCard = `<div id="card" width="300" height="400" value="${site.id}">
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
      });
      data.result.forEach((sites) => {
        siteApi(sites.id, day);
      });
    });
}
//검색 창에 나온 카드들 클릭하면 이벤트 발생
function siteApi(siteId, day) {
  const card = document.getElementById(`${siteId}`);
  const formData = {
    site_id: siteId,
    day: day,
  };
  card.addEventListener('click', function () {
    fetch(`/redis/${tour_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        panTo(siteId, i);
        i++;
        siteListBox.innerHTML = '';
      })
      .catch((error) => {
        console.error(error);
      });
  });
}
//계획 작성전에 tour테이블에 생성함
function createTour(tour_site_id) {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  const tourStartBtn = document.getElementById('tourStartBtn');

  tourStartBtn.addEventListener('click', function () {
    const tourTitle = document.getElementById('tourTitle').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const formData = {
      title: tourTitle,
      start_date: startDate,
      end_date: endDate,
    };
    fetch(`/${tour_site_id}/tours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        window.location.href = `tour.html?tourId=${data.result.id}`;
      })
      .catch((error) => {
        console.error('여행계획 생성 실패:', error);
        alert('여행 계획 생성에 실패하였습니다.');
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

//지도에 이벤트 생성하기 위도, 경도, 이미지, 이름, 주소순으로 받아서 멥에 표시
function panTo(site_id, i) {
  fetch(`/toursite/${site_id}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const tour = data.result;
      //지도 이동
      let moveLatLon = new kakao.maps.LatLng(tour.mapy, tour.mapx);
      map.panTo(moveLatLon);
      //마커 생성
      let markerPosition = new kakao.maps.LatLng(tour.mapy, tour.mapx);

      let marker = addMarker(markerPosition, i);
      marker.setMap(map);
      markers.push(marker);
      //생성된 마커에 이벤트 부여
      let iwContent = `
      <div class="wrap" width="300" height="400">
          <div class="info">
              <div class="title">
                  ${tour.site_name}
                  <div class="close" onclick="closeOverlay()" title="닫기"></div>
              </div>
              <div class="body">
                  <div class="img">
                      <img src="${tour.site_img}" width="300" height="250">
                 </div>
                      <div class="ellipsis">${tour.site_address}</div>
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
//채팅시작버튼
startChatting.addEventListener('click', function () {
  window.open(`chatting.html?tourId=${tour_id}`, 'popup01', 'width=400, height=800, scrollbars= 0, toolbar=0, menubar=no');
});
//드랍박스에 날짜 수만큼 생성 23~24 여행간다고하면 1일차 2일차 생김
function TourDayCheck(tour_id) {
  fetch(`/tours/${tour_id}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const tour = data.result;
      const oldDate = new Date(tour.start_date);
      const newDate = new Date(tour.end_date);
      let diff = Math.abs(newDate.getTime() - oldDate.getTime());
      diff = Math.ceil(diff / (1000 * 60 * 60 * 24));
      tourDays.innerHTML = '';
      for (let i = 1; i < diff + 2; i++) {
        const dayDropOption = `<option value="${i}">${i}일차</option>`;
        tourDays.innerHTML += dayDropOption;
      }
    });
}

//마커 숫자 만들어줌
function addMarker(position, idx, type) {
  var imageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png'; // 마커 이미지 url, 스프라이트 이미지를 씁니다
  var imageSize = new kakao.maps.Size(36, 37); // 예제 사이트 마커 이미지의 크기
  var imgOptions = {
    spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
    spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
    offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
  };
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);

  let marker = new kakao.maps.Marker({
    position: position, // 마커의 위치
    image: markerImage,
  });

  marker.setMap(map); // 지도 위에 마커를 표출합니다

  return marker;
}
//새로고침하거나 뒤로갔다가 다시오면 redis에서 불러옴
function restartTour(tour_id, day) {
  fetch(`/redis/${tour_id}/${day}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const tourlist = data.result;
      for (i = 0; i < tourlist.length; i++) {
        panTo(tourlist[i], i);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
// 날짜 변경시 해당 날짜에 맞는 redis 정보를 불러옴
tourDays.addEventListener('change', function () {
  let day = checkday();
  fetch(`/redis/${tour_id}/${day}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const tourlist = data.result;
      setMarkers(null);
      for (i = 0; i < tourlist.length; i++) {
        panTo(tourlist[i], i);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

createTourBtn.addEventListener('click', function () {
  const days = tourDays.length;
  fetch(`/${tour_id}/planDate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ days }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('계획을 완성했습니다!');
    })
    .catch((error) => {
      console.log(error);
    });
});

function setMarkers(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function checkday() {
  return document.getElementById('tourDays').value;
}
