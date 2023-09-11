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
let linePath = [];
let markers = [];
let pathLines = [];
let i = 0;
let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
let options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};
let map = new kakao.maps.Map(container, options);
let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

//창이 열리면 실행되는 목록
window.onload = async function () {
  checkLoggedInStatus();
  if (tour_site_id && !tour_id) {
    createTour(tour_site_id);
  }
  if (tour_id) {
    TourDayCheck(tour_id);
    getplaceData(tour_id);
    setCenter(tour_site_id);
    const check = await checkMember();
    if (!check) {
      alert('비정상적인 접근입니다.');
      window.location.href = '/';
    }
  }
};

function displayPlaces(places) {
  let listEl = document.getElementById('placesList'),
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = '';

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();
  if (places !== undefined) {
    for (let i = 0; i < places.length; i++) {
      // 마커를 생성하고 지도에 표시합니다
      let placePosition = new kakao.maps.LatLng(places[i].mapy, places[i].mapx),
        { marker, pathLines } = addMarker(placePosition, i),
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
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
    if (pathLines.length !== 0) {
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
  let content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

function getListItem(index, places) {
  let el = document.createElement('li'),
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
  let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
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

function addsearchMarker(position) {
  let marker = new kakao.maps.Marker({
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
  let listEl = document.getElementById('updateSiteList'),
    menuEl = document.getElementById('menu_wrap2'),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = '';
  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (let i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    let placePosition = new kakao.maps.LatLng(places[i].mapy, places[i].mapx),
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
        if (data.code === 405) {
          window.location.href = `tour-update.html?id=${data.result.id}`;
        }
        if (data.code === 200) {
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
        linePath.pop();
        alert(data.message);
        window.location.reload();
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
      let moveLatLon = new kakao.maps.LatLng(site.mapy, site.mapx);
      map.setCenter(moveLatLon);
    });
}

// 모달창안에 시간을 기입하면 완료
function createSite(places) {
  const placeTimeModal = document.getElementById('placeTimeModal');
  placeTimeModal.style.display = 'flex';
  const createPlaceBtn = document.getElementById('createPlaceBtn');
  const timeCloseBtn = document.getElementById('timeCloseBtn');
  createPlaceBtn.addEventListener('click', function () {
    const day = document.getElementById('tourDays').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const formData = {
      site_id: places.id,
      day: day,
      start_time: startTime,
      end_time: endTime,
    };
    fetch(`/redis/${tour_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (data.status === 201) {
          window.location.href = `tour.html?tourId=${tour_id}&id=${tour_site_id}`;
        }
      })
      .catch((error) => {
        console.error('여행계획 생성 실패:', error);
        alert('여행 계획 생성에 실패하였습니다.');
      });
  });
  timeCloseBtn.addEventListener('click', () => {
    window.location.href = `tour.html?tourId=${tour_id}&id=${tour_site_id}`;
  });
  //모달의 바깥부분을 누르면 꺼짐
  modal.addEventListener('click', (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains('modal-overlay')) {
      window.location.href = `tour.html?tourId=${tour_id}&id=${tour_site_id}`;
    }
  });
  //esc누르면 꺼짐
  window.addEventListener('keyup', (e) => {
    if (modal.style.display === 'flex' && e.key === 'Escape') {
      window.location.href = `tour.html?tourId=${tour_id}&id=${tour_site_id}`;
    }
  });
}

async function checkMember() {
  try {
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
