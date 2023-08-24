// let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
// let options = {
//   //지도를 생성할 때 필요한 기본 옵션
//   center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
//   level: 3, //지도의 레벨(확대, 축소 정도)
// };

// let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// function panTo(Lat, Lng, img, name, address) {
//   //지도 이동
//   let moveLatLon = new kakao.maps.LatLng(Lat, Lng);
//   map.panTo(moveLatLon);
//   //마커 생성
//   let markerPosition = new kakao.maps.LatLng(Lat, Lng);
//   let marker = new kakao.maps.Marker({
//     position: markerPosition,
//   });
//   marker.setMap(map);

//   //생성된 마커에 이벤트 부여
//   let iwContent = `
//       <div class="wrap">
//           <div class="info">
//               <div class="title">
//                   ${name}
//                   <div class="close" onclick="closeOverlay()" title="닫기"></div>
//               </div>
//               <div class="body">
//                   <div class="img">
//                       <img src="${img}" width="300" height="250">
//                  </div>
//                       <div class="ellipsis">${address}</div>
//                       <div class="jibun ellipsis"></div>
//               </div>
//           </div>
//       </div>`, //이 부분이 클릭했을 때 나오는 div
//     iwRemoveable = true;

//   let infowindow = new kakao.maps.InfoWindow({
//     content: iwContent,
//     removable: iwRemoveable,
//   });

//   kakao.maps.event.addListener(marker, 'click', function () {
//     infowindow.open(map, marker);
//   });
// }

// fetch('/toursite', {
//   method: 'GET',
// })
//   .then((response) => response.json())
//   .then((data) => {
//     const toursite = data.result;
//     toursite.forEach((Site) => {
//       panTo(Site.mapy, Site.mapx, Site.site_img, Site.site_name, Site.site_address);
//     });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
