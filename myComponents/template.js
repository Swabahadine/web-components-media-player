// LES ID HTML
const idPlayer = 'player';

  //boutton
const idButtonPlay = 'playButton';
const idButtonPause = 'pauseButton';
const idButtonStop = 'stopButton';

const idKnobVolume = 'knobVolume';
const idKnobVolume2 = 'knobVolume2';

const idProgressAudio = 'progressAudio';

const idVuMetter = 'idVuMetter';

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
    idVuMetter: selectId(idVuMetter),
};

export const myTemplate = ({ src }) =>`
<style>
  H1 {
        color:red;
  }
  canvas {
    border-radius: 6px;
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
  <webaudio-switch width="60" height="60" src="./assets/imgs/switch_on_off.png" id="sw1" type="toggle">
</webaudio-switch><br/>
  <webaudio-knob id="${idKnobVolume}" tooltip="Volume:%s" src="./assets/imgs/OberKnob.png" sprites="99" value=0.25 min="0" max="1" step=0.01>
      Volume</webaudio-knob>

      <webaudio-knob id="${idKnobVolume2}" tooltip="Volume:%s" src="./assets/imgs/bouton2.png" sprites="127" value=0 min="-1" max="1" step=0.01>
      Volume</webaudio-knob>
      <canvas id="myCanvas2" width=300 height=100></canvas><br><br>
      <webaudio-knob id="${idVuMetter}" width=120 height=120 tooltip="Volume:%s" src="./assets/imgs/Vintage_VUMeter_2.png" sprites="50" value=0 min="0" max="1" step=0.01>
      Volume</webaudio-knob>
      `;