# Raspblue

Simple client & server using Web Bluetooth API. Dedicated for devices supporting Bluetooth Low Energy like Raspberry Pi.

## How to run it

### Server [Linux]

* ```sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev```
* ```bluetoothd``` disabled, if BlueZ 5.14 or later is installed. Use ```sudo hciconfig hci0 up``` to power Bluetooth adapter up after stopping or disabling ```bluetoothd```.
* npm install (in cloned raspblue directory)
* sudo node src/server/main.js

#### Daemon [Systemd]

* sudo cp ```./raspblue.service``` /lib/systemd/system/```
* sudo systemctl daemon-reload
* sudo systemctl start raspblue
* sudo systemctl status raspblue

Logs for raspblue can be found via ```sudo journalctl -u raspblue```

### Client

Tested in latest Chrome browser on Mac OS. Just open ```src/client/index.html``` in Chrome and click start button.
