document.addEventListener('DOMContentLoaded', function () {
  // '전체 일정 조회' 버튼 클릭 시 동작 정의
  document.querySelector('.allTour-button').addEventListener('click', function () {
    var tourSiteId = 'tour_site_id'; // 실제 tour_site_id로 변경
    var tourId = 'tour_id'; // 실제 tour_id로 변경

    fetch(`/${tourSiteId}/${tourId}/tours`)
      .then((response) => response.json())
      .then((result) => {
        // 성공 시 메인 컨텐츠 업데이트
        var mainContent = document.querySelector('#main-content');
        mainContent.innerHTML = ''; // 기존 내용 비우기
        var tourData = result.data; // 'data' 변수 이름 갈등을 피하기 위해 'tourData'라는 이름을 사용

        // data가 배열인 경우 각 요소(객체)의 속성을 <p> 태그로 출력
        if (Array.isArray(tourData)) {
          tourData.forEach(function (item) {
            if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(function (key) {
                mainContent.innerHTML += '<p>' + key + ': ' + item[key] + '</p>';
              });
            }
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  });
});
