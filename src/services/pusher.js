import Pusher from 'pusher-js';

const pusher = new Pusher('afeb9d40f70468280fe7', {
    cluster: 'ap2'
  });

const channel = pusher.subscribe('touted-towel-66');

export { channel }