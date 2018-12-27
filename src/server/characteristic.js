var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var EchoCharacteristic = function() {
    EchoCharacteristic.super_.call(this, {
        uuid: 'ec0e',
        properties: ['read', 'write', 'notify'],
        value: null
    });

    this._value = new Buffer(0);
    this._updateValueCallback = null;
};

util.inherits(EchoCharacteristic, BlenoCharacteristic);

EchoCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

    callback(this.RESULT_SUCCESS, this._value);
};

EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    this._value = data;

    console.log('EchoCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

    if (this._updateValueCallback) {
        console.log('EchoCharacteristic - onWriteRequest: notifying');

        this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
};

EchoCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('EchoCharacteristic - onSubscribe');

    this._updateValueCallback = updateValueCallback;
    var commandsExecutor = this._commandsExecutor;

    this._commandsExecutorInterval = setInterval(
        function() { commandsExecutor(updateValueCallback) },
        1000);

};

EchoCharacteristic.prototype.onUnsubscribe = function() {
    console.log('EchoCharacteristic - onUnsubscribe');

    clearInterval(this._commandsExecutorInterval);

    this._updateValueCallback = null;
};

EchoCharacteristic.prototype._commandsExecutor = function(updateValueCallback) {
    console.log('executor');
    var command = 'command';
    updateValueCallback(Buffer.from('command', 'utf-8'));
}

module.exports = EchoCharacteristic;