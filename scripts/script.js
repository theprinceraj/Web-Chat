// Function to fetch data from the API
async function fetchRandomUser() {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();

        // Extract the full name from the API response
        const { first, last } = data.results[0].name;
        return `${first} ${last}`;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});


socket.on('chat message', async function (msg) {
    const randomName = await fetchRandomUser();
    var item = document.createElement('li');
    item.classList.add('chat-component');

    var usernameContainer = document.createElement('div');
    usernameContainer.textContent = randomName;
    usernameContainer.classList.add('username-container');
    item.appendChild(usernameContainer);
    
    
    var rightArrow = document.createElement('i');
    rightArrow.classList.add('bx');
    rightArrow.classList.add('bxs-chevrons-right');
    item.appendChild(rightArrow);
    
    var msgContainer = document.createElement('div');
    msgContainer.textContent = msg;
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