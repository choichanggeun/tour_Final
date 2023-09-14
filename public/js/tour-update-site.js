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
const tourDays = document.getElementById('tourDays');
const keyword = document.getElementById('keyword');
const searchBtn = document.getElementById('searchBtn');
const tourcloseBtn = document.getElementById('tourcloseBtn');
const siteCreateBtn = document.getElementById('siteCreateBtn');
const createTour = document.getElementById('createTour');
const deleteTour = document.getElementById('deleteTour');
const updateDate = document.getElementById('updateDate');

window.onload = function () {
  checkLoggedInStatus();
  TourDayCheck(tour_id);
  getplaceData(tour_id);
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

// 사용자 정보 확인하여 로그인 상태에 따라 버튼 표시
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
        document.querySelector('#profileimg').style.display = 'block';

        // 이미지 클릭 이벤트 추가
        var profilePic = document.getElementById('profilePic');
        var dropdownMenu = document.getElementById('dropdownMenu');

        profilePic.addEventListener('click', function (event) {
          event.stopPropagation(); // Stop the event from bubbling up to the window object
          if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
          } else {
            dropdownMenu.style.display = 'block';
          }
        });

        document.querySelector('#loginbtn').style.display = 'none';
      } else {
        document.querySelector('#loginbtn').style.display = 'block';
        document.querySelector('#profileimg').style.display = 'none';
      }
      const isMember = await checkMember();
      if (isMember) {
        updateDate.style.display = 'block';
        createTour.style.display = 'block';
        deleteTour.style.display = 'block';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// 로그 아웃
function logout() {
  const logoutBtn = document.getElementById('logoutbtn');
  logoutBtn.addEventListener('click', async function () {
    fetch('/logout', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === '로그아웃이 완료되었습니다.') {
          alert(data.message);
          location.reload();
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}

logout();

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
  if (places !== undefined) {
    for (var i = 0; i < places.length; i++) {
      // 마커를 생성하고 지도에 표시합니다
      var placePosition = new kakao.maps.LatLng(places[i].mapy, places[i].mapx),
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

        itemEl.onclick = function () {
          openUpdateMenu(places);
        };

        itemEl.ondblclick = function () {
          deletePlace(places);
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

function openUpdateMenu(places) {
  document.getElementById('menu_wrap2').style.display = 'block';
  const keyword = document.getElementById('keyword');
  keyword.setAttribute('value', places.site_name);

  searchPlaces(places.site_name, '제목', places.id, places.site_name);

  keyword.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
      let search_data = keyword.value;
      let search_type = document.getElementById('search_type').value;
      searchPlaces(search_data, search_type, places.id, places.site_name);
    }
  });
}

function searchPlaces(search_data, search_type, id, oldData) {
  fetch(`/searchtour/${search_data}/${search_type}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displaySearchData(data.result, id, oldData);
    });
  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
}

function displaySearchData(places, id, oldData) {
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
      { marker, pathLines } = addMarker(placePosition, i),
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

      if (oldData) {
        itemEl.onclick = function () {
          updateSite(places, oldData, id);
        };
      } else {
        itemEl.onclick = function () {
          createSite(places);
        };
      }
    })(marker, places[i], i);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

function updateSite(newData, oldData, place_id) {
  const placeTimeModal = document.getElementById('placeTimeModal');
  placeTimeModal.style.display = 'flex';
  const createPlaceBtn = document.getElementById('createPlaceBtn');
  const timeCloseBtn = document.getElementById('timeCloseBtn');
  createPlaceBtn.addEventListener('click', function () {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const formData = {
      id: newData.id,
      start_time: startTime,
      end_time: endTime,
    };
    if (confirm(`${oldData}를 ${newData.site_name}으로 변경하시겠습니까?`)) {
      fetch(`/${place_id}/place`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            alert(data.message);
            window.location.reload();
          }
        });
    } else {
      alert('취소되었습니다.');
    }
  });
  timeCloseBtn.addEventListener('click', () => {
    window.location.reload();
  });
  //모달의 바깥부분을 누르면 꺼짐
  modal.addEventListener('click', (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains('modal-overlay')) {
      window.location.reload();
    }
  });
  //esc누르면 꺼짐
  window.addEventListener('keyup', (e) => {
    if (modal.style.display === 'flex' && e.key === 'Escape') {
      window.location.reload();
    }
  });
}
tourcloseBtn.addEventListener('click', function () {
  document.getElementById('menu_wrap2').style.display = 'none';
  getplaceData(tour_id);
});

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

function createSite(places) {
  const days = document.getElementById('tourDays').value;
  const tour_site_id = places.id;
  const formData = {
    days: days,
    tour_site_id: tour_site_id,
  };
  fetch(`/place/${tour_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code === 200) {
        alert(data.message);
        getplaceData(tour_id);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function deletePlace(places) {
  if (confirm('정말로 삭제하시겠습니까?')) {
    fetch(`/${places.id}/place`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        getplaceData(tour_id);
      });
  } else {
    alert('취소되었습니다');
  }
}

deleteTour.addEventListener('click', function () {
  if (confirm('정말로 삭제하시겠습니까?')) {
    fetch(`/tours/${tour_id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        window.location.href = '/';
      });
  } else {
    alert('취소되었습니다.');
  }
});

createTour.addEventListener('click', function () {
  fetch(`/tours/status/${tour_id}`, {
    method: 'PUT',
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      window.location.href = '/';
    });
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
