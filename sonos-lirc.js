"use strict";
var net = require("net");
// The default path to the lircd socket is /var/run/lirc/lircd, change this if you need
var socket = net.connect({path: "/var/run/lirc/lircd"});
var SonosDiscovery = require('sonos-discovery');
var discovery = new SonosDiscovery();

const PLAYER_NAME = 'Office';

// This maps the key code from lircd with an action
var actions = {
  "plus": function (player) {
    player.setVolume("+1");
    return true;
  },
  "minus": function (player) {
    player.setVolume("-1");
    return true;
  },
};

var player = null;

// We need an initial player as soon as we have scanned the network
// I auto select the "TV Room" just to have anything controllable
// I mapped my color buttons to change the current player if needed
discovery.on('topology-change', function () {
  if (player == null) {
      console.log(`selecting player ${PLAYER_NAME}`);
    player = discovery.getPlayer(PLAYER_NAME);
  }
});

var allowRepeat;

socket.on("data", function (data) {
  var cols = data.toString().split(' ');
  var keyCode = cols[2];
  var repeat = cols[1];
  console.log(repeat, keyCode);
  allowRepeat = repeat == "00" ? true : allowRepeat;

  if (allowRepeat && player && actions[keyCode]) {
    allowRepeat = actions[keyCode](player);
  }
  
});
