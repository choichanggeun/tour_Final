const urlParams = new URLSearchParams(window.location.search);
const tour_id = urlParams.get('tourId');
const tour_site_id = urlParams.get('id');
const startChatting = document.getElementById('startChatting');
const keyword = document.getElementById('keyword');
const tourDays = document.getElementById('tourDays');
const createTourBtn = document.getElementById('createTour');
const closeBtn = document.getElementById('tourcloseBtn');
const tourcloseBtn = document.getElementById('tourcloseBtn');
const siteCreateBtn = document.getElementById('siteCreateBtn');

var markers = [];
let i = 0;
let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
let options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};
let map = new kakao.maps.Map(container, options);
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

//창이 열리면 실행되는 목록
window.onload = function () {
  checkLoggedInStatus();
  if (tour_site_id && !tour_id) {
    createTour(tour_site_id);
  }
  if (tour_id) {
    TourDayCheck(tour_id);
    getplaceData(tour_id);
    setCenter(tour_site_id);
  }
};

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
  if (places !== undefined) {
    for (var i = 0; i < places.length; i++) {
      // 마커를 생성하고 지도에 표시합니다
      var placePosition = new kakao.maps.LatLng(places[i].mapy, places[i].mapx),
        marker = addMarker(placePosition, i),
        itemEl = getListItem(i, places[i]);

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다
      (function (marker, places) {
        kakao.maps.event.addListener(marker, 'mouseover', function () {
          displayInfowindow(marker, places.site_name);
        });

        kakao.maps.event.addListener(marker, 'mouseout', function () {
          infowindow.close();
        });

        itemEl.onmouseover = function () {
          displayInfowindow(marker, places.site_name);
        };

        itemEl.onmouseout = function () {
          infowindow.close();
        };

        itemEl.ondblclick = function () {
          deletePlace();
        };
      })(marker, places[i]);

      fragment.appendChild(itemEl);
    }
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
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

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

function addsearchMarker(position) {
  var marker = new kakao.maps.Marker({
    position: position,
  });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

siteCreateBtn.addEventListener('click', function () {
  document.getElementById('menu_wrap2').style.display = 'block';
  const keyword = document.getElementById('keyword');
  keyword.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
      let search_data = keyword.value;
      let search_type = document.getElementById('search_type').value;
      searchPlaces(search_data, search_type);
    }
  });
});

function searchPlaces(search_data, search_type, id) {
  fetch(`/searchtour/${search_data}/${search_type}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displaySearchData(data.result, id);
    });
  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
}

function displaySearchData(places, id) {
  var listEl = document.getElementById('updateSiteList'),
    menuEl = document.getElementById('menu_wrap2'),
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
      marker = addsearchMarker(placePosition, i),
      itemEl = getListItem(i, places[i]);

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, places, i) {
      kakao.maps.event.addListener(marker, 'mouseover', function () {
        displayInfowindow(marker, places.site_name);
      });

      kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, places.site_name);
      };

      itemEl.onmouseout = function () {
        infowindow.close();
      };

      itemEl.onclick = function () {
        createSite(places);
      };
    })(marker, places[i], i);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

tourcloseBtn.addEventListener('click', function () {
  document.getElementById('menu_wrap2').style.display = 'none';
  getplaceData(tour_id);
});

function createSite(places) {
  const days = document.getElementById('tourDays').value;
  const formData = {
    site_id: places.id,
    day: days,
  };
  console.log(formData);
  fetch(`/redis/${tour_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === 201) {
        alert(data.message);
        getplaceData(tour_id);
      }
    })
    .catch((error) => {
      console.log(error);
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
        console.log(data);
        if (data.code === 405) {
          alert(data.message);
          window.location.href = `tour-update.html?id=${data.result.id}`;
        }
        if (data.code === 200) {
          alert(data.message);
          window.location.href = `tour.html?tourId=${data.result.id}&id=${tour_site_id}`;
        }
      })
      .catch((error) => {
        console.error('여행계획 생성 실패:', error);
        alert('여행 계획 생성에 실패하였습니다.');
      });
  });
  closeBtn.addEventListener('click', () => {
    window.location.href = `tourSite.html`;
  });
  //모달의 바깥부분을 누르면 꺼짐
  modal.addEventListener('click', (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains('modal-overlay')) {
      window.location.href = `tourSite.html`;
    }
  });
  //esc누르면 꺼짐
  window.addEventListener('keyup', (e) => {
    if (modal.style.display === 'flex' && e.key === 'Escape') {
      window.location.href = `tourSite.html`;
    }
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

//새로고침하거나 뒤로갔다가 다시오면 redis에서 불러옴
function getplaceData(tour_id) {
  const days = document.getElementById('tourDays').value;
  fetch(`/redis/${tour_id}/${days}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const tourlist = data.result;
      if (tourlist.length !== 0) {
        console.log(tourlist);
        displayPlaces(tourlist);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

tourDays.addEventListener('change', function () {
  const days = document.getElementById('tourDays').value;
  fetch(`/redis/${tour_id}/${days}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const tourlist = data.result;
      infowindow.close();
      displayPlaces(tourlist);
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
      if (data.code === 200) {
        alert(data.message);
        window.location.href = '/';
      }
      if (data.code === 400) {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function deletePlace() {
  if (confirm('정말로 삭제하시겠습니까?')) {
    const day = document.getElementById('tourDays').value;
    fetch(`/redis/${tour_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ day }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert(data.message);
        getplaceData(tour_id);
      });
  } else {
    alert('취소되었습니다.');
  }
}

function setCenter() {
  fetch(`/toursite/${tour_site_id}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const site = data.result;
      var moveLatLon = new kakao.maps.LatLng(site.mapy, site.mapx);
      map.setCenter(moveLatLon);
    });
}
