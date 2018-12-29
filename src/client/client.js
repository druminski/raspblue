var bluetoothDevice = null;
var primaryServiceUUID = '0000ec00-0000-1000-8000-00805f9b34fb';
var characteristicUUID = '0000ec0e-0000-1000-8000-00805f9b34fb';
var maxConnectionTries = 6000;
var initDelayInSecondsBetweenConnectionTries = 5;
var maxDelayInSeconds = 500;

function log (msg) {
    document.getElementById('screen').innerHTML += '[' + new Date().toJSON().substr(11, 8) + '] ' + msg + '</br>';
}

function handleCharacteristicValueChanged (event) {
    var value = event.target.value
    let decoder = new TextDecoder('utf-8')

    log('Received command: ' + decoder.decode(value))

    // TODO execute command
}

function run () {
    bluetoothDevice = null

    navigator.bluetooth.requestDevice({
        filters: [{
            services: [0xec00]
        }],
        optionalServices: ['device_information']
    })
        .then(device => {
            bluetoothDevice = device
            bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected)
            connectAndHandle()
        })
        .catch(error => {log(error.message) })
}

function connectAndHandle () {
    exponentialBackoff(maxConnectionTries, initDelayInSecondsBetweenConnectionTries,
        function toTry () {
            log('Connecting to Bluetooth Device... ')
            var server = bluetoothDevice.gatt.connect()
            log('Connected')
            return server
        },
        onConnectionEstablished,
        function fail () {
            log('Failed to reconnect. Retry policy exhausted.')
        })
}

function onDisconnected () {
    log('Bluetooth Device disconnected')
    connectAndHandle()
}

function exponentialBackoff (maxRetries, delayInSeconds, toTry, success, fail) {
    toTry()
        .then(result => success(result))
        .catch(e => {
            log('Connection error: ' + e.message)
            if (maxRetries === 0) {
                return fail()
            }
            log('Retrying in ' + delayInSeconds + ' seconds... (' + maxRetries + ' tries left)')
            if (delayInSeconds < maxDelayInSeconds) {
                delayInSeconds = delayInSeconds * 2;
            }
            setTimeout(function () {
                exponentialBackoff(--maxRetries, delayInSeconds, toTry, success, fail)
            }, delayInSeconds * 1000)
        })
}

function onConnectionEstablished (server) {
    new Promise(function (resolve, reject) {
        log('Reading primary service')
        resolve(server.getPrimaryService(primaryServiceUUID));
    })
        .then(service => {
            log('Getting characteristic')
            return service.getCharacteristic(characteristicUUID);
        })
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => {
            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged)
            log('Notifications have been started')
            return characteristic
        })
        .then(characteristic => {
            // window.setInterval(() => {
            //   let encoder = new TextEncoder('utf-8');
            //   let encoded = encoder.encode('hello');
            //   return characteristic.writeValue(encoded);
            // }, 1000);
        })
        .catch(error => {log(error.message) })
}