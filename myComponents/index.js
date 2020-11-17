
import './lib/webaudio-controls.js';

import { ids, myTemplate } from './template.js'
import { visualize, convertTime } from './func.js'

const getBaseURL = () => {
  const base = new URL('.', import.meta.url);
  console.log("Base = " + base);
	return `${base}`;
};

// Template
const template = document.createElement("template");

class MyAudioPlayer extends HTMLElement {
  static get observedAttributes() { return ['src', 'loop', 'title', 'volume']; }

  constructor() {
    super();
    console.log(this.getAttribute('loop') === '');
    this.volume = 1;
    this.attachShadow({ mode: "open" });
    template.innerHTML = myTemplate({ src: this.getAttribute('src') });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.basePath = getBaseURL(); // url absolu du composant
    // Fix relative path in WebAudio Controls elements
    this.fixRelativeImagePaths();

    // binding
    this.visualize = visualize.bind(this)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'src' && newValue && oldValue) {
      this.player.src = newValue
      this.reset()
      this.play()
    }
    else if (this.player?.loop && name === 'loop' && oldValue !== newValue) {
      const isloop = this.getAttribute('loop') === 'true' || this.getAttribute('loop') === '';
      this.player.loop = isloop;
    }
  }
  disconnectedCallback() {
    console.log('disconnected from the DOM');
  }

  initAttributes() {
    // loop
    const isloop = this.getAttribute('loop') === 'true' || this.getAttribute('loop') === '';
    this.player.loop = isloop;
    this.shadowRoot.querySelector('#idLoop').value = isloop ? 1:0;

    // volume 
    const volume = this.getAttribute('volume') * 0.01;
    this.setVolume(volume)
    this.shadowRoot.querySelector(ids.idKnobVolume).value = volume;

    // src
    const src = this.getAttribute('src');
    this.player.src = src;
    if (this.getAttribute('play') === 'true' || this.getAttribute('play') === '')
    this.play()
  }

  initCanvas() {
    this.canvas = this.shadowRoot.querySelector("#myCanvas2")
    this.vuMetter = this.shadowRoot.querySelector(ids.idVuMetter)
    this.canvasContext = this.canvas.getContext('2d');
    requestAnimationFrame(this.visualize);
  }

  initSelectors() {
    this.player = this.shadowRoot.querySelector(ids.idPlayer);
    this.timer = this.shadowRoot.querySelector('#timer');
    this.buttonPlay = this.shadowRoot.querySelector(ids.idButtonPlay);
  }
  async connectedCallback() {
    this.initCanvas();
    this.initSelectors();
    this.initAttributes();

    this.audioContext = new AudioContext();
    this.playerNode = this.audioContext.createMediaElementSource(this.player);
  
    // panner
    this.pannerNode = this.audioContext.createStereoPanner();
  
    // visualization
    this.analyser = this.audioContext.createAnalyser();
    
    // Try changing for lower values: 512, 256, 128, 64...
    this.analyser.fftSize = 1024;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.filters = [];

    [60, 170, 350, 1000, 3500, 10000].forEach((freq, i) => {
      var eq = this.audioContext.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      this.filters.push(eq);
    });

   // Connect this.filters in serie
   this.playerNode.connect(this.filters[0]);
   for(var i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i+1]);
    }
  
    // Master volume is a gain node
    const masterGain = this.audioContext.createGain();
    masterGain.value = 1;
 

   // connect the last filter to the speakers
   this.filters[this.filters.length - 1]
    .connect(masterGain)
    .connect(this.pannerNode)
    .connect(this.analyser)
    .connect(this.audioContext.destination);

    this.declareListeners();
  }

  fixRelativeImagePaths() {
		// change webaudiocontrols relative paths for spritesheets to absolute
		let webaudioControls = this.shadowRoot.querySelectorAll(
			'webaudio-knob, webaudio-slider, webaudio-switch, img'
		);
		webaudioControls.forEach((e) => {
			let currentImagePath = e.getAttribute('src');
			if (currentImagePath !== undefined) {
				//console.log("Got wc src as " + e.getAttribute("src"));
				let imagePath = e.getAttribute('src');
        //e.setAttribute('src', this.basePath  + "/" + imagePath);
        e.src = this.basePath  + "/" + imagePath;
        //console.log("After fix : wc src as " + e.getAttribute("src"));
			}
		});
  }
  
  declareListeners() {
    console.log('declare listerner');
    this.shadowRoot.querySelector(ids.idButtonPlay).addEventListener("click", (event) => {
      if (event.target.value === 1) this.play();
      else if (event.target.value === 0) this.pause();
    });

    this.shadowRoot.querySelector(ids.idButtonStop).addEventListener("click", (event) => {
      this.reset();
    });

    this.shadowRoot.querySelector('#idLoop').addEventListener("click", (event) => {
      if (event.target.value === 1) this.setAttribute('loop', "true")
      else if (event.target.value === 0) this.setAttribute('loop', "false")
    });

    this.shadowRoot
      .querySelector(ids.idKnobVolume)
      .addEventListener("input", (event) => {
        this.setVolume(event.target.value);
      });

    this.shadowRoot
      .querySelector(ids.idBalance)
      .addEventListener("input", (event) => {
        this.setBalance(event.target.value)
      });

    this.shadowRoot
      .querySelector(ids.idProgressAudio)
      .addEventListener("input", (event) => {
        this.setCurrentTime(event.target.value)
      });

    [0, 1, 2, 3, 4, 5].forEach(id => {
      this.shadowRoot
      .querySelector(`#inputGain${id}`)
      .addEventListener("input", (event) => {
        this.changeGain(event.target.value, id);
      });
    })

    this.player.addEventListener("timeupdate", (event) => {
      const p = this.shadowRoot.querySelector(ids.idProgressAudio)
      this.timer.innerHTML = `${convertTime(event.target.currentTime)}/${convertTime(this.player.duration || 0)}`;
      try {
        p.max = this.player.duration
        p.value = this.player.currentTime
      }
      catch (e){
        console.error(e)
      }
    })
  }

  changeGain(sliderVal,nbFilter) {
    var value = parseFloat(sliderVal);
    this.filters[nbFilter].gain.value = value;
  }

  // API
  setVolume(val) {
    this.player.volume = val;
  }

  setCurrentTime(val) {
    this.player.currentTime = val;
  }

  setBalance(val) {
    this.pannerNode.pan.value = val;
  }

  play() {
    this.player && this.player.play();
    this.buttonPlay.value = 1;
  }

  pause() {
    this.player && this.player.pause();
    this.buttonPlay.value = 0;
  }

  reset() {
    if (this.player) this.player.currentTime = 0;
  }
}

customElements.define("my-audioplayer", MyAudioPlayer);
