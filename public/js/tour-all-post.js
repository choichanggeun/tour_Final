const siteListBox = document.getElementById('siteList');
const searchButton = document.getElementById('searchSite-button');
const enterInput = document.getElementById('searchSite-input');
const pagingul = document.getElementById('pagingul');
const display = document.getElementById('displayCount');
let totalData; //총 데이터 수
let dataPerPage = 8; //한 페이지에 나타낼 글 수
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
    fetch('/tours', {
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

enterInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    const searchInput = document.getElementById('searchSite-input').value;
    const search_type = document.getElementById('search_type').value;
    window.location.href = `tour-all-post.html?data=${searchInput}&type=${search_type}`;
  }
});

searchButton.addEventListener('click', function () {
  const searchInput = document.getElementById('searchSite-input').value;
  const search_type = document.getElementById('search_type').value;
  window.location.href = `tour-all-post.html?data=${searchInput}&type=${search_type}`;
});

function loadSearchSiteItem(search_data, search_type) {
  fetch(`/search_tour/${search_data}/${search_type}`, {
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
      window.location.href = '/';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function displayData(currentPage, dataPerPage) {
  siteListBox.innerHTML = '';

  //Number로 변환하지 않으면 아래에서 +를 할 경우 스트링 결합이 되어버림..
  currentPage = Number(currentPage);
  dataPerPage = Number(dataPerPage);

  for (var i = (currentPage - 1) * dataPerPage; i < (currentPage - 1) * dataPerPage + dataPerPage; i++) {
    const siteCard = `<div class="col-lg-6">
                                    <div class="card" onclick="goTourDetail(${dataList[i].id})">
                                    <img class="img-fluid" src="${dataList[i].site_img}" style="width: 500px; height: 300px" alt="" />
                                    <div class="card-img-overlay"><span class="tag tag-pill tag-success" >${dataList[i].site_name}</span></div>
                                    <div class="card-block">
                                        <div class="news-title">
                                        <h2 class="title-small"><a href="#">${dataList[i].title}</a></h2>
                                        </div>
                                        <p class="card-text">
                                        <small class="text-time"><em>${dataList[i].nickname}</em></small>
                                        </p>
                                    </div>
                                    </div>
                        </div>`;
    siteListBox.innerHTML += siteCard;
  }
}

function goTourDetail(id) {
  window.location.href = `tour-detail.html?id=${id}`;
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
