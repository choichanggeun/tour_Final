let serverURL = 'localhost:3000';
const urlParams = new URLSearchParams(window.location.search);
const roomNumber = urlParams.get('tourId');
document.getElementById('RoomTitle').innerHTML = `방 번호 : ${roomNumber}`;

$(document).ready(async function () {
  const check = await checkMember();
  if (!check) {
    alert('비정상적인 접근입니다.');
    window.location.href = '/';
  }
  fetch('/users', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const socket = io('http://localhost:3000/', { transports: ['websocket'] });
      let name = data.data.nickname;
      let id = data.data.id;
      socket.on('connection', function (data) {
        if (data.type == 'connected') {
          socket.emit('connection', {
            type: 'join',
            name: name,
            room: roomNumber,
            id: id,
          });
        }
      });

      socket.on('system', function (data) {
        const log = data.messagelog;
        for (i = 0; i < log.length; i++) {
          writeMessage('me', name, log[i]);
        }
        writeMessage('system', 'system', data.message);
      });

      socket.on('message', function (data) {
        writeMessage('me', data.name, data.message);
      });

      $('#message-input').keyup(function (event) {
        if (event.which === 13) {
          $('#message-button').click();
          event.preventDefault();
        }
      });

      $('#message-button').click(function () {
        let msg = $('#message-input').val();
        socket.emit('user', {
          id: id,
          name: name,
          message: msg,
          room: roomNumber,
        });

        $('#message-input').val('');
      });

      function writeMessage(type, name, message) {
        let html = '<div class="msg {TYPE}-msg"><div class="msg-bubble">{MESSAGE}</div></div>';

        let printName = '';
        if (type == 'me') {
          printName = name + ' : ';
        }

        html = html.replace('{TYPE}', type).replace('{MESSAGE}', printName + message);

        // 위에서나오게 데이터가 이거없으면밑에서생성
        $('.msger-chat').prepend(html);
      }
    });
});

async function checkMember() {
  try {
    const response = await fetch(`/invite/${roomNumber}`, { method: 'GET' });
    const data = await response.json();
    const response2 = await fetch(`/verify_tours/${roomNumber}`, { method: 'GET' });
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
