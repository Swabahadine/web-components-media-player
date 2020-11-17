// LES ID HTML
const idPlayer = 'player';

  //boutton
const idButtonPlay = 'playButton';
const idButtonPause = 'pauseButton';
const idButtonStop = 'stopButton';

const idKnobVolume = 'knobVolume';
const idBalance = 'balance';

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
    idBalance: selectId(idBalance),
    idProgressAudio: selectId(idProgressAudio),
    idVuMetter: selectId(idVuMetter),
};

export const myTemplate = ({ src }) =>`
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
  integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<style>
  H1 {
    color: red;
  }

  .container {
    width: 600px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  }

  .bordered {
    border: solid;
    border-color: black;
  }

  .slidecontainer {
    width: 600px;
    /* Width of the outside container */
    border-radius: 6px;
  }

  /* The slider itself */
  .slider {
    -webkit-appearance: none;
    /* Override default CSS styles */
    appearance: none;
    width: 600px;
    /* Full-width */
    height: 25px;
    /* Specified height */
    background: black;
    /* Grey background */
    outline: none;
    /* Remove outline */
    opacity: 1;
    /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: .2s;
    /* 0.2 seconds transition on hover */
    transition: opacity .2s;
  }

  /* Mouse-over effects */
  .slider:hover {
    opacity: 1;
    /* Fully shown on mouse-over */
  }

  /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    /* Override default look */
    appearance: none;
    width: 17px;
    /* Set a specific slider handle width */
    height: 17px;
    /* Slider handle height */
    border-radius: 6px;
    background: #0b678b;
    /* Green background */
    cursor: pointer;
    /* Cursor on hover */
  }

  .slider::-moz-range-thumb {
    width: 17px;
    /* Set a specific slider handle width */
    height: 17px;
    /* Slider handle height */
    border-radius: 6px;
    background: #0b678b;
    /* Green background */
    cursor: pointer;
    /* Cursor on hover */
  }

  #timer {
    background-color: black;
    font-weight: bold;
    color: #0b678b;
    font-family: 'Courier New', Courier, monospace;
    width: 600px;
  }
</style>

<div class="container">
  <div class="container rounded bg-dark text-white">
    <div class="w-100 row d-flex flex-column">
      <div id="timer" class="rounded text-white text-right p-2">
        0:00/0:00
      </div>
      <canvas id="myCanvas2" width=600 height=200>canvas</canvas>
      <div class="slidecontainer w-100">
        <input type="range" min="1" max="100" value="0" class="slider" id="${idProgressAudio}">
      </div>
      <div class="row d-flex justify-content-between px-4">
        <div class="d-flex flex-column justify-content-center align-items-center">
          <div>Play / Pause</div>
          <webaudio-switch width="60" height="60" src="./assets/imgs/switch_on_off.png" type="toggle"
            id="${idButtonPlay}">
            Play</webaudio-switch>
        </div>

        <div class="d-flex flex-column justify-content-center align-items-center">
          <div>Retour à 0</div>
          <webaudio-switch width="50" height="50" src="./assets/imgs/sphere_scope.png" type="kick" id="${idButtonStop}">
            Play</webaudio-switch>
        </div>

        <div class="d-flex flex-column justify-content-center align-items-center">
          <div>Loop</div>
          <webaudio-switch id="idLoop" width="50" height="50" src="./assets/imgs/sphere_scope.png" type="toggle">
            Play</webaudio-switch>
        </div>
      </div>
      <div class="row d-flex justify-content-between p-4">
        <div class="col-xs-12 col-md-4 d-flex justify-content-between">
          <webaudio-knob class="mr-5" id="${idKnobVolume}" tooltip="Volume:%s" src="./assets/imgs//OberKnob.png"
            sprites="99" value=0.25 min="0" max="1" step=0.01>
          </webaudio-knob>

          <webaudio-knob id="${idBalance}" tooltip="Balance:%s" src="./assets/imgs/bouton2.png" sprites="127" value=0
            min="-1" max="1" step=0.01>
          </webaudio-knob>
        </div>
        <div class="col-xs-12 col-md-6 d-flex justify-content-center">
          <webaudio-knob id="${idVuMetter}" width=120 height=120 tooltip="Volume:%s"
            src="./assets/imgs/Vintage_VUMeter_2.png" sprites="50" value=0 min="0" max="1" step=0.01>
            Volume</webaudio-knob>
        </div>
      </div>
      <audio crossorigin style=" width:300px;" id="${idPlayer}">
        <source id="audiosrc" src="${src}" type="audio/mp3" />
      </audio>

    </div>
    <div class="w-100 d-flex justify-content-around">
      <div class="controls">
        <webaudio-knob id="inputGain0" width="50" height="50" id="balanceKnob" sprites="100"
          src="./assets/imgs/balance.png" value="0" step="1" min="-30" max="30">Balance</webaudio-knob>
        <br><label>60Hz</label>
      </div>



      <div class="controls">
        <webaudio-knob id="inputGain1" width="50" height="50" id="balanceKnob" sprites="100"
          src="./assets/imgs/balance.png" value="0" step="1" min="-30" max="30">Balance</webaudio-knob>
        <br>
        <label>170Hz</label>
      </div>
      <div class="controls">
        <webaudio-knob id="inputGain2" width="50" height="50" id="balanceKnob" sprites="100"
          src="./assets/imgs/balance.png" value="0" step="1" min="-30" max="30">Balance</webaudio-knob>
        <br> <label>350Hz</label>
      </div>
      <div class="controls">
        <webaudio-knob id="inputGain3" width="50" height="50" id="balanceKnob" sprites="100"
          src="./assets/imgs/balance.png" value="0" step="1" min="-30" max="30">Balance</webaudio-knob>
        <br><label>1000Hz</label>
      </div>
      <div class="controls">

        <webaudio-knob id="inputGain4" width="50" height="50" id="balanceKnob" sprites="100"
          src="./assets/imgs/balance.png" value="0" step="1" min="-30" max="30">Balance</webaudio-knob>
        <br><label>3500Hz</label>
      </div>
      <div class="controls">

        <webaudio-knob id="inputGain5" width="50" height="50" id="balanceKnob" sprites="100"
          src="./assets/imgs/balance.png" value="0" step="1" min="-30" max="30">Balance</webaudio-knob>
        <br><label>10000Hz</label>
        <p>
      </div>
    </div>
  </div>
      `;