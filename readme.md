# Raspblue

Simple client and server using to communicate with each other Bluetooth Low Energy.

Client connects to the server, sends status messages and listens on command to execute.
Server handles connections, receives status messages and sends commands to execute.

Client was tested on macOs Mojave, server on Raspberry Pi 3 B+.

## How to run it

### Server [Ubuntu/Debian/Raspbian]

1. ```sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev```
2. ```bluetoothd``` disabled, if BlueZ 5.14 or later is installed. Use ```sudo hciconfig hci0 up``` to power Bluetooth adapter up after stopping or disabling ```bluetoothd```.
3. ```npm install``` (in cloned raspblue directory)
4. ```sudo node src/server/main.js```

##### Daemon [Systemd]

1. ```sudo cp ./raspblue.service /lib/systemd/system/```
2. ```sudo systemctl daemon-reload```
3. ```sudo systemctl start raspblue```
4. ```sudo systemctl status raspblue```

Raspblue logs can be found in journalctl: ```sudo journalctl -u raspblue```

### Client

1. ```npm install``` (in cloned raspblue directory)
2. ```node_modules/.bin/forever src/client/main.js```
