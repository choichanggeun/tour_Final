let serverURL = 'localhost:3000';

$(document).ready(function () {
  fetch('/users', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const socket = io('http://localhost:3000/', { transports: ['websocket'] });
      let name = data.data.nickname;
      // let room = Math.floor(Math.random() * (5 - 1)) + 1;
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

      $('#message-input').keyup(function (event) {
        if (event.which === 13) {
          $('#message-button').click();
        }
      });

      $('#message-button').click(function () {
        let msg = $('#message-input').val();
        socket.emit('user', {
          name: name,
          message: msg,
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
