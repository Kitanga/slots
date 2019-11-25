import {
  Howl,
  Howler
} from 'howler';

import startGame from './game';

// Scenes
const startup = document.querySelector('#startup');
const logo = document.querySelector('.logo');
const play = document.querySelector('#play');

// Buttons and movables
const filler = document.querySelector('.preloader .filler');
const playBtn = document.querySelector('#start');
const svgContainer = document.querySelector('#logo-svg');

// Global vars used later
let totalAssets = 0;
let totalCount = 0;
let audio = {};
const AUDIOMAX = .43;


window.addEventListener('load', function () {
  // Our audio files
  let assets = [
    [
      'sfx',
      {
        src: ['snd/sfx.ogg'],
        sprite: {
          click: [2706, 2900],
          spin: [6433, 16465]
        },
        volume: .43
      }
    ],
    [
      'menu',
      {
        src: ['snd/menu.ogg'],
        volume: 0,
        loop: true
      }
    ],
    [
      'play',
      {
        src: ['snd/play.ogg'],
        volume: 0,
        loop: true
      }
    ],
    [
      'bigwin',
      {
        src: ['snd/bigwin.ogg']
      }
    ],
    [
      'superbigwin',
      {
        src: ['snd/superbigwin.ogg']
      }
    ]
  ];

  // Setting the total assets so that we can keep track of our loading progress
  totalAssets = assets.length + 1;

  // Load SVG
  loadSVG('logo.svg', (svg) => {
    updateLoader();
    svgContainer.innerHTML = svg;
  });

  // Load audio
  loadAssets(assets, (results) => {
    audio = results;
  });

  // If the play button's clicked, start the game.
  playBtn.addEventListener('click', () => {
    // Stop menu music
    audio.menu.fade(AUDIOMAX, 0, 1000);
    setTimeout(() => audio.menu.stop(), 1000);
    audio.sfx.play('click');

    // Hide menu, show game
    hide(logo);
    show(play);

    // Fade-in game music
    audio.play.play();
    audio.play.fade(0, AUDIOMAX, 1000);

    startGame(audio);
  })
});

function loadSVG(link, onsuccess) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if ((request.readyState == 4) && (request.status == 200)) {
      console.log(request);
      onsuccess(request.responseText);
    }
  }
  request.open("GET", link, true);
  request.send();
}

function DoneLoading() {
  console.log('Done');
  hide(startup);
  show(logo);

  audio.menu.play();
  audio.menu.fade(0, AUDIOMAX, 1000);
}

function loadAssets(auds, callback) {
  console.log('Started getting audio files');
  let n,
    result = {},
    count = auds.length,
    total = auds.length,
    onload = function () {
      if (--count == 0) {
        callback(result);
      }

      updateLoader();
    };

  for (n = 0; n < auds.length; n++) {
    let aud = auds[n];
    let name = aud[0];

    const howlOpt = aud[1];

    result[name] = new Howl(howlOpt);
    result[name].once('load', onload);
  }
}

function updateLoader() {
  filler.style.width = `${(++totalCount / totalAssets) * 100}%`;
  console.log(totalCount, totalAssets);
  if (totalCount === totalAssets) {
    DoneLoading();
  }
}

function hide(ele) {
  ele.classList.add('hidden');
}

function show(ele) {
  ele.classList.remove('hidden');
}