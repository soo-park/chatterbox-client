// YOUR CODE HERE:
var app = {};
app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
app.friends = {};

app.init = function() {
  app.fetch();
  app.handleSubmit();
  app.handleUsernameClick();

};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {},
    success: function (data) {
      console.log(data.results.length)
      console.log(data.results);
      for (var i = data.results.length - 1; i > data.results.length - 11; i--) {
        // var message = {};
        // message.username = data.results[i].username;
        // message.text = data.results[i].text;
        app.renderMessage(data.results[i])
      }
      console.log('chatterbox: Messages rendered');
    },
    error: function (data) {
      console.error('chatterbox: Failed to render messages', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  $('#chats').append(`<div class="message"><p class="message-username">${message.username}:</p><p>${message.text}</p></div>`);

  // $('.message-username').on('click', app.handleUsernameClick);
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append(`<option>${roomName}</option>`);
}

app.handleUsernameClick = function() {
  $('.message-username').on('click', function(event) {
    app.friends[$(this).val()] = 1;
  });
}

app.handleSubmit = function() {
  $('#send > .submit').on('click', function(event) {
    event.preventDefault();
    var message = {
      username: 'guessWho',
      text: $('#send .input-field').val(),
      roomname: 'a cave'
    };
    app.send(message);
  });
}

$(document).ready(function() {
  app.init();

  // setInterval(function() {
  //   app.clearMessages();
  //   app.init();
  // }, 10000);
});









