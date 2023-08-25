const siteListBox = document.getElementById('siteList');
const searchButton = document.getElementById('searchSite-button');

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const search_site = urlParams.get('search_site');
  checkLoggedInStatus();
  if (search_site) {
    loadSearchSiteItem(search_site);
  } else {
    fetch('/toursite', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        siteListBox.innerHTML = '';
        data.result.forEach((site) => {
          const siteCard = `<div class="col-lg-6">
                                                <div class="card">
                                                <img class="img-fluid" src="${site.site_img}" alt="" />
                                                <div class="card-block">
                                                    <div class="news-title">
                                                    <a href="#">
                                                        <h2 class="title-small">${site.site_name}</h2>
                                                    </a>
                                                    </div>
                                                    <p class="card-text">${site.site_address}</p>
                                                    <p class="card-text">
                                                    <small class="text-time"><em>3 mins ago</em></small>
                                                    </p>
                                                </div>
                                            </div>
                                    </div>`;
          siteListBox.innerHTML += siteCard;
        });
      });
  }
};

searchButton.addEventListener('click', function () {
  const searchInput = document.getElementById('searchSite-input').value;
  console.log(searchInput);
  location.href = `/tourSite.html/${searchInput}`;
});

function loadSearchSiteItem(search_site) {
  fetch(`/toursite/${search_site}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      siteListBox.innerHTML = '';
      data.result.forEach((site) => {
        const siteCard = `<div class="col-lg-6">
                                                <div class="card">
                                                <img class="img-fluid" src="${site.site_img}" alt="" />
                                                <div class="card-block">
                                                    <div class="news-title">
                                                    <a href="#">
                                                        <h2 class="title-small">${site.site_name}</h2>
                                                    </a>
                                                    </div>
                                                    <p class="card-text">${site.site_address}</p>
                                                    <p class="card-text">
                                                    <small class="text-time"><em>3 mins ago</em></small>
                                                    </p>
                                                </div>
                                            </div>
                                    </div>`;
        siteListBox.innerHTML += siteCard;
      });
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

function popup() {
  window.open('chatting.html', 'popup01', 'width=400, height=800, scrollbars= 0, toolbar=0, menubar=no');
}
