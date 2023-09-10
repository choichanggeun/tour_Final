let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
let options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};
let map = new kakao.maps.Map(container, options);

let linePath = [];
let markers = [];
let pathLines = [];

var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

const urlParams = new URLSearchParams(window.location.search);
const tour_id = urlParams.get('id');

const goDairy = document.getElementById('goDairy');
const createDairy = document.getElementById('createDairy');
const updateTour = document.getElementById('updateTour');
const tourDays = document.getElementById('tourDays');
const likeBtn = document.getElementById('likeBtn');
const startChatting = document.getElementById('startChatting');
window.onload = function () {
  checkLoggedInStatus();
  TourDayCheck(tour_id);
  getplaceData(tour_id);
  checkLike();
  countLike();
};

tourDays.addEventListener('change', function () {
  const days = document.getElementById('tourDays').value;
  fetch(`/place/${tour_id}/${days}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const tourlist = data.data;
      infowindow.close();
      displayPlaces(tourlist);
    })
    .catch((error) => {
      console.error(error);
    });
});

// profilePic 요소에 이벤트 리스너를 추가합니다.
document.getElementById('profilePic').addEventListener('click', function () {
  // dropdown-menu의 가시성을 토글합니다.
  const dropdownMenu = document.getElementById('dropdownMenu');
  if (dropdownMenu.style.display === 'block') {
    dropdownMenu.style.display = 'none';
  } else {
    dropdownMenu.style.display = 'block';
  }
});

likeBtn.addEventListener('click', function () {
  const checkLike = document.getElementById('likeBtn').value;
  if (checkLike === 'none') {
    likeBtn.innerHTML = '좋아요취소';
    likeBtn.setAttribute('value', 'like');
    SetLike();
  } else if (checkLike === 'like') {
    likeBtn.innerHTML = '좋아요';
    likeBtn.setAttribute('value', 'none');
    SetLike();
  }
});

goDairy.addEventListener('click', function () {
  window.location.href = `diary-tour.html?Id=${tour_id}`;
});

createDairy.addEventListener('click', async function () {
  try {
    const response = await fetch(`/invite/${tour_id}`, { method: 'GET' });
    const data = await response.json();
    const response2 = await fetch(`/verify_tours/${tour_id}`, { method: 'GET' });
    const data2 = await response2.json();
    // 초대된 유저이거나 여행 계획 만든 유저일 때
    if (data.data.length !== 0 || data2.data) {
      window.location.href = `diary-post.html?Id=${tour_id}`;
    } else {
      alert('여행 일지를 생성할 권한이 없습니다.');
    }
  } catch (error) {
    alert('여행 일지를 생성할 권한이 없습니다.');
  }
});

updateTour.addEventListener('click', function () {
  window.location.href = `tour-update.html?id=${tour_id}`;
});

function checkLike() {
  fetch(`/tours/${tour_id}/likes`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === '좋아요를 한 유저입니다.') {
        likeBtn.innerHTML = '좋아요취소';
        likeBtn.setAttribute('value', 'like');
      }
    });
}

function countLike() {
  fetch(`/likes/${tour_id}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('likeCounter').innerText = `좋아요 : ${data.data}`;
    });
}

function getplaceData(tour_id) {
  const days = document.getElementById('tourDays').value;
  fetch(`/place/${tour_id}/${days}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const tourlist = data.data;
      displayPlaces(tourlist);
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayPlaces(places) {
  var listEl = document.getElementById('placesList'),
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = '';

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (var i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].mapy, places[i].mapx),
      { marker, pathLines } = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, title) {
      kakao.maps.event.addListener(marker, 'mouseover', function () {
        displayInfowindow(marker, title);
      });

      kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };

      itemEl.onmouseout = function () {
        infowindow.close();
      };
    })(marker, places[i].site_name);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

startChatting.addEventListener('click', function () {
  window.open(`chatting.html?tourId=${tour_id}`, 'popup01', 'width=400, height=800, scrollbars= 0, toolbar=0, menubar=no');
});

async function checkMember() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const tour_id = urlParams.get('id');
    const response = await fetch(`/invite/${tour_id}`, { method: 'GET' });
    const data = await response.json();
    const response2 = await fetch(`/verify_tours/${tour_id}`, { method: 'GET' });
    const data2 = await response2.json();
    // 초대된 유저이거나 여행 계획 만든 유저일 때
    if (data.data.length !== 0 || data2.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

function checkLoggedInStatus() {
  fetch('/users/me', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then(async (data) => {
      // 응답 처리
      if (data.data) {
        const usernickname = document.getElementById('usernickname');
        usernickname.innerHTML = data.data.nickname;
        const isMember = await checkMember();
        if (isMember) {
          document.getElementById('updateTour').style.display = 'block';
          document.getElementById('createDairy').style.display = 'block';
          startChatting.style.display = 'block';
        }
        document.getElementById('likeBtn').style.display = 'block';
      }
    });
}

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

function removeMarker() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
    if (pathLines.length !== 0) {
      linePath.pop();
      pathLines[i].setMap(null);
    }
  }
  markers = [];
  pathLines = [];
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

function getListItem(index, places) {
  var el = document.createElement('li'),
    itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' + '<div class="info">' + '   <h1><strong>' + places.site_name + '</strong></h1>';

  if (places.site_address) {
    itemStr += '<span class="jibun gray">' + places.site_address + '</span>';
  }
  if (places.site_img) {
    itemStr += `<img class="img-fluid" src=${places.site_img} alt="" />`;
  }
  if (places.start_time) {
    itemStr += `<span class="gray"><strong>` + places.start_time + ' 부터 ' + places.end_time + ' 까지 ' + `</strong></span>`;
  }
  el.innerHTML = itemStr;
  el.className = 'item';

  return el;
}

function addMarker(position, idx, title) {
  var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    });
  linePath.push(position);
  var polyline = new kakao.maps.Polyline({
    path: linePath, // 선을 구성하는 좌표배열 입니다
    strokeWeight: 7, // 선의 두께 입니다
    strokeColor: '#87ceeb', // 선의 색깔입니다
    strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
  });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다
  polyline.setMap(map);
  pathLines.push(polyline);
  return { marker, pathLines };
}

function SetLike() {
  fetch(`/tours/${tour_id}/likes`, {
    method: 'PUT',
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      countLike();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
