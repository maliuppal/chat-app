const socket = io();
// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocationButton = document.querySelector('send-location');
const $messages = document.querySelector('#messages');

// Templetes
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix : true});
console.log(`username: ${username}`)

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // disable
    $messageFormButton.setAttribute('disbaled', 'disabled');

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        // enable
        $messageFormButton.removeAttribute('disbaled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geo location is not supported by your browser');
    }
    // $sendLocationButton.setAttribute('disbaled', 'disabled');

    navigator.geolocation.getCurrentPosition((postions) => {
        socket.emit(
            'sendLocation',
            {
                latitude: postions.coords.latitude,
                longitude: postions.coords.longitude,
            },
            (message) => {
                // $sendLocationButton.removeAttribute('disbaled');
                console.log(message);
            }
        );
    });
});


socket.emit('join', {username, room})