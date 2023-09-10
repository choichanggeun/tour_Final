const siteListBox = document.getElementById('siteList');
const searchButton = document.getElementById('searchSite-button');
const enterInput = document.getElementById('searchSite-input');
const pagingul = document.getElementById('pagingul');
const display = document.getElementById('displayCount');
let totalData; //총 데이터 수
let dataPerPage = 10; //한 페이지에 나타낼 글 수
let pageCount = 10; //페이징에 나타낼 페이지 수
let globalCurrentPage = 1; //현재 페이지
let dataList; //표시하려하는 데이터 리스트
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const search_data = urlParams.get('data');
  const search_type = urlParams.get('type');
  checkLoggedInStatus();
  if (search_data) {
    loadSearchSiteItem(search_data, search_type);
  } else {
    fetch('/toursite', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        totalData = data.result.length;
        dataList = data.result;
        displayData(1, dataPerPage);
        paging(totalData, dataPerPage, pageCount, 1);
      });
  }
};

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

enterInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    const searchInput = document.getElementById('searchSite-input').value;
    const search_type = document.getElementById('search_type').value;
    window.location.replace(`tourSite.html?data=${searchInput}&type=${search_type}`);
  }
});

searchButton.addEventListener('click', function () {
  const searchInput = document.getElementById('searchSite-input').value;
  const search_type = document.getElementById('search_type').value;
  window.location.replace(`tourSite.html?data=${searchInput}&type=${search_type}`);
});

function loadSearchSiteItem(search_data, search_type) {
  fetch(`/searchtour/${search_data}/${search_type}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      totalData = data.result.length;
      dataList = data.result;
      displayData(1, dataPerPage);
      paging(totalData, dataPerPage, pageCount, 1);
    });
}

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
        document.getElementById('usernickname').value = data.data.id;
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
      window.location.replace('/');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function siteApi(id) {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  fetch(`/toursite/${id}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const site = data.result;
      document.getElementById('siteModalTitle').innerHTML = site.site_name;
      document.getElementById('siteModalImg').src = site.site_img;
      document.getElementById('siteModalAddress').innerHTML = site.site_address;
      const tourBtn = document.getElementById('tourBtn');
      tourBtn.addEventListener('click', function () {
        window.location.replace(`tour.html?id=${site.id}`);
      });
    });
  //모달의 x 버튼 누르면 꺼짐
  const closeBtn = modal.querySelector('.close-area');
  closeBtn.addEventListener('click', (e) => {
    modal.style.display = 'none';
  });
  //모달의 바깥부분을 누르면 꺼짐
  modal.addEventListener('click', (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains('modal-overlay')) {
      modal.style.display = 'none';
    }
  });
  //esc누르면 꺼짐
  window.addEventListener('keyup', (e) => {
    if (modal.style.display === 'flex' && e.key === 'Escape') {
      modal.style.display = 'none';
    }
  });
}

function displayData(currentPage, dataPerPage) {
  siteListBox.innerHTML = '';

  //Number로 변환하지 않으면 아래에서 +를 할 경우 스트링 결합이 되어버림..
  currentPage = Number(currentPage);
  dataPerPage = Number(dataPerPage);

  for (var i = (currentPage - 1) * dataPerPage; i < (currentPage - 1) * dataPerPage + dataPerPage; i++) {
    const siteCard = `<div class="col-lg-6" onclick="siteApi(${dataList[i].id})">
                                             <div class="card">
                                             <img class="img-fluid" src="${dataList[i].site_img}" alt="" />
                                             <div class="card-block">
                                                 <div class="news-title">
                                                 <a href="#">
                                                     <h2 class="title-small">${dataList[i].site_name}</h2>
                                                 </a>
                                                 </div>
                                                 <p class="card-text">${dataList[i].site_address}</p>
                                                 <p class="card-text">
                                                 <small class="text-time"><em>3 mins ago</em></small>
                                                 </p>
                                             </div>
                                         </div>
                                 </div>`;
    siteListBox.innerHTML += siteCard;
  } //dataList는 임의의 데이터임.. 각 소스에 맞게 변수를 넣어주면 됨...
}

function paging(totalData, dataPerPage, pageCount, currentPage) {
  totalPage = Math.ceil(totalData / dataPerPage); //총 페이지 수

  if (totalPage < pageCount) {
    pageCount = totalPage;
  }

  let pageGroup = Math.ceil(currentPage / pageCount); // 페이지 그룹
  let last = pageGroup * pageCount; //화면에 보여질 마지막 페이지 번호

  if (last > totalPage) {
    last = totalPage;
  }

  let first = last - (pageCount - 1); //화면에 보여질 첫번째 페이지 번호
  let next = last + 1;
  let prev = first - 1;

  let pageHtml = '';

  if (prev > 0) {
    pageHtml += "<li><a href='#' id='prev'> 이전 </a></li>";
  }

  //페이징 번호 표시
  for (var i = first; i <= last; i++) {
    if (currentPage == i) {
      pageHtml += "<li class='on'><a href='#' id='" + i + "'>" + i + '</a></li>';
    } else {
      pageHtml += "<li><a href='#' id='" + i + "'>" + i + '</a></li>';
    }
  }

  if (last < totalPage) {
    pageHtml += "<li><a href='#' id='next'> 다음 </a></li>";
  }

  pagingul.innerHTML = pageHtml;
  let displayCount = '';
  displayCount = '현재 1 - ' + totalPage + ' 페이지 / ' + totalData + '건';
  display.innerHTML = displayCount;

  //페이징 번호 클릭 이벤트
  $('#pagingul li a').click(function () {
    console.log(this);
    let $id = $(this).attr('id');
    selectedPage = $(this).text();

    if ($id == 'next') selectedPage = next;
    if ($id == 'prev') selectedPage = prev;

    //전역변수에 선택한 페이지 번호를 담는다...
    globalCurrentPage = selectedPage;
    //페이징 표시 재호출
    paging(totalData, dataPerPage, pageCount, selectedPage);
    //글 목록 표시 재호출
    displayData(selectedPage, dataPerPage);
  });
}
