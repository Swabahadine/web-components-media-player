// LES ID HTML
const idPlayer = 'player';

  //boutton
const idButtonPlay = 'playButton';
const idButtonPause = 'pauseButton';
const idButtonStop = 'stopButton';

const idKnobVolume = 'knobVolume';
const idKnobVolume2 = 'knobVolume2';

const idProgressAudio = 'progressAudio';

function selectId( id ) {
  return `#${id}`
}

export const ids = {
    idPlayer: selectId(idPlayer),
    idButtonPlay: selectId(idButtonPlay),
    idButtonPause: selectId(idButtonPause),
    idButtonStop: selectId(idButtonStop),
    idKnobVolume: selectId(idKnobVolume),
    idKnobVolume2: selectId(idKnobVolume2),
    idProgressAudio: selectId(idProgressAudio),
};

export const myTemplate = ({ src }) =>`
<style>
  H1 {
        color:red;
  }
  canvas {
    border: 1px solid;
  }
</style>

<audio crossorigin style=" width:300px;" id="${idPlayer}" >
      <source src="${src}" type="audio/mp3" />
  </audio>
  <button id="${idButtonPause}"">Pause</button>
  <button id="${idButtonPlay}">Play</button>
  <button id="${idButtonStop}"">Retour à zero</button>
  <br>
  Volume: 0 <input id="${idProgressAudio}" type="range" min=0 max=1 step=0.1> 1
  <br>
  <webaudio-knob id="${idKnobVolume}" tooltip="Volume:%s" src="./assets/imgs/OberKnob.png" sprites="99" value=1 min="0" max="1" step=0.01>
      Volume</webaudio-knob>

      <webaudio-knob id="${idKnobVolume2}" tooltip="Volume:%s" src="./assets/imgs/bouton2.png" sprites="127" value=0 min="-1" max="1" step=0.01>
      Volume</webaudio-knob>
      <canvas id="myCanvas2" width=300 height=100></canvas>
      `;