var serverURL = 'localhost:3000';

var name = Math.floor(Math.random() * (5 - 1)) + 1;
var room = Math.floor(Math.random() * (5 - 1)) + 1;

$(document).ready(function () {
  var socket = io.connect(serverURL);

  socket.on('connection', function (data) {
    if (data.type == 'connected') {
      socket.emit('connection', {
        type: 'join',
        name: name,
        room: 5,
      });
    }
  });

  socket.on('system', function (data) {
    writeMessage('system', 'system', data.message);
  });

  socket.on('message', function (data) {
    writeMessage('me', data.name, data.message);
  });

  $('#message-button').click(function () {
    var msg = $('#message-input').val();

    socket.emit('user', {
      name: name,
      message: msg,
    });

    writeMessage('me', name, msg);
  });

  function writeMessage(type, name, message) {
    var html = '<div>{MESSAGE}</div>';

    var printName = '';
    if (type == 'me') {
      printName = name + ' : ';
    }

    html = html.replace('{MESSAGE}', printName + message);

    $(html).appendTo('.j-message');
  }
});

var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

function panTo(Lat, Lng) {
  // 이동할 위도 경도 위치를 생성합니다
  var moveLatLon = new kakao.maps.LatLng(Lat, Lng);

  // 지도 중심을 부드럽게 이동시킵니다
  // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
  map.panTo(moveLatLon);
}
panTo(37.5666, 126.9774);
