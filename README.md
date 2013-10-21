SONOS REMOTE CONTROL
====================

Simple proof of concept for controlling a Sonos system using a standard IR remote. This will work on any linux system that has lirc support. I will not get into detail on how to setup lirc, there are plenty of guides for that on the internet. 

My setup includes:

Raspberry Pi (wired to one of my players, no wireless necessary!)
Nwazet tuxedo case [http://nwazet.com/nwazet-pi-tuxedo-case]
Nwazet IR receiver (for GPIO) [http://nwazet.com/nwazet-pi-infrared-receiver]
A standard LG remote, but almost any remote will work. Most of them will have pre-made lirc mapping files, if not you can learn lirc your remote.

HOW IT WORKS
============

If you have a working lirc installation, the lircd daemon will create a socket file (by default, /var/run/lirc/lircd). This socket will output something like this upon key press:

`0000000020df9867 00 9 LG_AKB72915207
0000000020dfa857 00 5 LG_AKB72915207
0000000020df00ff 00 ch_up LG_AKB72915207
0000000020df807f 00 ch_down LG_AKB72915207`

the third column is the actual key pressed. The code you receive might differ for different mapping files (some use lower case, some juse upper case, some prefix every code with KEY_, etc)

The node script will read those and map the actual key code to different actions on the Sonos system, which are sent across the network. 

Enjoy!
=======
node-sonos-remote-control
=========================

A simple implementation of an IR remote to Sonos mapper for linux/lirc (raspberry pi)

