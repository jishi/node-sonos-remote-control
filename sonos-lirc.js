"use strict";
var net = require("net");
// The default path to the lircd socket is /var/run/lirc/lircd, change this if you need
var socket = net.connect({path: "/var/run/lirc/lircd"});
var SonosDiscovery = require('sonos-discovery');
var SonosHttpAPI = require('sonos-http-api');
var discovery = new SonosDiscovery();

var presets = {
  "all": {"players": [{ "roomName": "Bathroom", "volume": 10 },{ "roomName": "Kitchen", "volume": 10 },{ "roomName": "Office", "volume": 10 },{ "roomName": "Bedroom", "volume": 10 },{ "roomName": "TV Room", "volume": 15 }]}
  };

// This is only for giving me an optional http api as well, you can skip this if you only want IR remote support.
var httpAPI = new SonosHttpAPI(discovery, 5005, presets);


// This maps the key code from lircd with an action
var actions = {
  "vol_up": function (player) {
    player.setVolume("+1");
    return true;
  },
  "vol_down": function (player) {
    player.setVolume("-1");
    return true;
  },
  "<<": function (player) {
    player.coordinator.previousTrack();
    return false;
  },
  ">>": function (player) {
    player.coordinator.nextTrack();
  },
  "play": function (player) {
    player.coordinator.play();
  },
  "pause": function (player) {
    player.coordinator.pause();
    return false;
  },
  "red": function () {
    console.log("Switching player to Office");
    player = discovery.getPlayer("Office");
  },
  "green": function () {
    console.log("Switching player to Kitchen");
    player = discovery.getPlayer("Kitchen");
  },
  "yellow": function () {
    console.log("Switching player to TV Room");
    player = discovery.getPlayer("TV Room");
  }
};

// This maps keycodes to predefined presets (defined earlier in file)
var buttonToPreset = {
  "1": "all",
  "2": "tv"
};

var player = null;

// We need an initial player as soon as we have scanned the network
// I auto select the "TV Room" just to have anything controllable
// I mapped my color buttons to change the current player if needed
discovery.on('topology-change', function () {
  if (player == null) {
      console.log("selecting player TV Room");
    player = discovery.getPlayer("TV Room");
  }
});

var allowRepeat;

socket.on("data", function (data) {
  var cols = data.toString().split(' ');
  var keyCode = cols[2];
  var repeat = cols[1];
  console.log(repeat, keyCode);
  allowRepeat = repeat == "00" ? true : allowRepeat;

  console.log(" before action ", allowRepeat)
  
  if (allowRepeat && player && actions[keyCode]) {
    allowRepeat = actions[keyCode](player);
  } else if (allowRepeat && presets[buttonToPreset[keyCode]]) {
    discovery.applyPreset(presets[buttonToPreset[keyCode]]);
    allowRepeat = false;
  }

  console.log("after action", allowRepeat);
  
});
