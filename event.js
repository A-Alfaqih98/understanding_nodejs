const EventEmitter = require('events');

const myEventHandler = new EventEmitter();

myEventHandler.on('someEvent', (num) =>
  console.log('An Event Occured: ' + num),
);

myEventHandler.emit('someEvent', 1);
console.log('hello');
