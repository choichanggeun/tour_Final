document.addEventListener('DOMContentLoaded', function () {
  // '전체 일정 조회' 버튼 클릭 시 동작 정의
  document.querySelector('.allTour-button').addEventListener('click', function () {
    fetch(`/tours`)
      .then((response) => response.json())
      .then((result) => {
        // 성공 시 메인 컨텐츠 업데이트
        var mainContent = document.querySelector('#main-content');
        mainContent.innerHTML = ''; // 기존 내용 비우기
        var tourData = result.data;

        // data가 배열인 경우 각 요소(객체)의 속성을 <p> 태그로 출력
        if (Array.isArray(tourData)) {
          tourData.forEach(function (item, index) {
            if (typeof item === 'object' && item !== null) {
              var imgElement = document.createElement('img');
              imgElement.src = item.TourSite.site_img;
              imgElement.id = 'tour-img-' + index;

              var titleElement = document.createElement('p');
              titleElement.textContent = item.title;

              mainContent.appendChild(titleElement);
              mainContent.appendChild(imgElement);

              imgElement.addEventListener('click', function () {
                alert(JSON.stringify(item, null, 2));
                // 위 코드는 모든 데이터를 팝업으로 표시합니다.
                // 원하는 방식으로 수정하실 수 있습니다.
              });
            }
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  });
});
