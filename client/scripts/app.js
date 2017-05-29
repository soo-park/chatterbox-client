// YOUR CODE HERE:
var app = {};
app.loginInfo = {username: 'anonymous aardvark'};
app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
app.friends = {};
app.roomnames = {};
app.originalRoomnameList = [];

app.init = function() {
  app.fetch();
  app.handleSubmit();
  app.handleUsernameClick();
  app.createUser();
  app.handleRoomSelection();
  
  $('.create-user-btn').after(`<p class='current-user-notification'>You are logged in as ${app.loginInfo.username}.</p>`);


  // setInterval(function() {
  //   app.clearMessages();
  //   app.fetch();
  // }, 5000);

};

app.filter = function(str) {
  str = JSON.stringify(str);
  if (str === undefined || str.includes('for') || str.includes('while') || str.includes('script')) {
    return 'not today';
  }
  return str;
};

// app.renderFriends = function() {
//   $('#friend-count').text(Object.keys(app.friends).length);
// };

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
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
    data: 'order=-createdAt',
    success: function (data) {
      app.roomnameMasterList = {};
      for (var i = 0; i < 10; i++) {
        app.renderMessage(data.results[i]);
        app.renderRoom(data.results[i].roomname);
        app.originalRoomnameList.push(data.results[i]);
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

app.createUser = function() {
  $('.create-user-btn').on('click', function() {
    app.loginInfo.username = $('#input-username').val();
    $('.current-user-notification').remove();
    $('.create-user-btn').after(`<p class='current-user-notification'>You are logged in as ${app.loginInfo.username}.</p>`);
    $('#input-username').val('');
  });
};

app.renderMessage = function(message) {
  $('#chats').append(`<div class="chat"><p><span class="username">${app.filter(message.username)}
    </span>: ${app.filter(message.text)}</p></div>`);

  $('.username').on('click', app.handleUsernameClick);
};

app.renderRoom = function(roomName) {
  
  if (roomName in app.roomnames) { return; }
  app.roomnames[roomName] = 1;
  
  $('#roomSelect').append(`<option class="${roomName}">${roomName}</option>`);
};

app.handleUsernameClick = function() {
  $('.username').on('click', function(event) {
    app.friends[this.innerHTML] = 1;
    
    // dom elements that has chat
    var messages = document.getElementsByClassName('chat');
    // console.log(messages);
    // iterate through the dom elements
    for (var i = 0; i < messages.length; i++) {
      // get the inner HTML of the span element
      // console.log(messages[i].childNodes[0].childNodes[0].innerHTML);
      var username = messages[i].childNodes[0].childNodes[0].innerHTML;

      
      // if it is the same as this.innerHTML
        // then add the friend class to the parent+parent of that span (which is a div with chat class)
 
 
      //compare innerHtml of it to the name

      // console.log(app.filter(app.originalRoomnameList[i].username) === this.innerHTML);
      if (username === this.innerHTML) {
        console.log('it works');
        console.log(messages[i]);
        messages[i].className = 'friend';
      }
      //add class to that user (with the bold);
    }
    // console.log(app.friends);
  });
};

app.handleSubmit = function() {
  $('#send > .submit').on('click', function(event) {
    event.preventDefault();
    var message = {
      username: app.loginInfo.username,
      text: $('#send .input-field').val(),
      roomname: app.loginInfo.roomname
    };
    app.send(message);
    //clears input field
    $('#send .input-field').val('');
    app.clearMessages();
    app.fetch();
  });
};


app.handleRoomSelection = function() {
  $('#roomSelect').on('change', function() {
    console.log('inside here ');
    app.loginInfo.roomname = $('#roomSelect').val();
    var filteredChats = app.originalRoomnameList.filter(function(chat) {
      if (app.loginInfo.roomname === 'All Messages') {
        return true;
      }
      return chat.roomname === app.loginInfo.roomname;
    });
    app.clearMessages();
    for (var i = 0; i < filteredChats.length; i++) { 
      app.renderMessage(filteredChats[i]);
    }
  });
};


$(document).ready(function() {
  app.init();

  // setInterval(function() {
  //   app.clearMessages();
  //   app.init();
  // }, 10000);
});









