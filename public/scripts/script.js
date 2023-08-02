var socket = io();

let username;

function setUsername() {
    username = document.getElementById('usernameInput').value;
    socket.emit('setUsername', username);
}

socket.on('usernameSet', username => {
    console.log(username)
    document.getElementById('username-form').style.display = 'none'; // hide username input overlay
    document.getElementById('input').focus(); // focus on the message input field
});

socket.on('usernameTaken', username => {
    alert(`Username ${username} is already taken.`);
});
// **************************************************************************** //


var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value );
        input.value = '';
    }
});

// Handle incoming message
socket.on('message', ({ username, message }) => {
    var item = document.createElement('li');
    item.classList.add('chat-component');

    var usernameContainer = document.createElement('div');
    usernameContainer.textContent = username;
    usernameContainer.classList.add('username-container');
    item.appendChild(usernameContainer);


    var rightArrow = document.createElement('i');
    rightArrow.classList.add('bx');
    rightArrow.classList.add('bxs-chevrons-right');
    item.appendChild(rightArrow);

    var msgContainer = document.createElement('div');
    msgContainer.textContent = message;
    console.log(message)
    msgContainer.classList.add('msg-container');
    item.appendChild(msgContainer);

    messages.appendChild(item);

    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('messageError', errorMessage => {
    alert(errorMessage); // Display the error message as an alert
});

socket.on('user disconnect', disconnectMsg => {
    var item = document.createElement('li');
    item.classList.add('log-component');
    item.textContent = disconnectMsg;

    messages.appendChild(item);

    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user connect', connectMsg => {
    var item = document.createElement('li');
    item.classList.add('log-component');
    item.textContent = connectMsg;

    messages.appendChild(item);

    window.scrollTo(0, document.body.scrollHeight);
});