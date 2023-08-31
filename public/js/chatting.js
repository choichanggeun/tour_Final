let serverURL = 'localhost:3000';
const urlParams = new URLSearchParams(window.location.search);
const roomNumber = urlParams.get('tourId');

$(document).ready(function () {
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
        writeMessage('me', name, msg);
        $('#message-input').val('');
      });

      function writeMessage(type, name, message) {
        let html = '<div>{MESSAGE}</div>';

        let printName = '';
        if (type == 'me') {
          printName = name + ' : ';
        }

        html = html.replace('{MESSAGE}', printName + message);

        $(html).appendTo('.j-message');
      }
    });
});
