
import './lib/webaudio-controls.js';

import { ids, myTemplate } from './template.js'
import { visualize } from './func.js'

const getBaseURL = () => {
  const base = new URL('.', import.meta.url);
  console.log("Base = " + base);
	return `${base}`;
};

// Template
const template = document.createElement("template");

class MyAudioPlayer extends HTMLElement {
  static get observedAttributes() { return ['src', 'loop', 'title']; }

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
    console.log('attributeChangedCallback');
    if (name === 'src' && oldValue !== newValue) {
      // console.log('src changeyyyy');
    }
    // console.log(name, newValue);
  }
  disconnectedCallback() {
    console.log('disconnected from the DOM');
  }

  connectedCallback() {
    this.player = this.shadowRoot.querySelector(ids.idPlayer);
    const isloop = this.getAttribute('loop') === 'true' || this.getAttribute('loop') === '';
    this.player.loop = isloop;
    const v = this.shadowRoot.querySelector(ids.idKnobVolume)
    this.setVolume(v.value)
    setTimeout(() => {
      console.log('setTimeout connectedCallback');
      let audioContext = new AudioContext();
      let playerNode = audioContext.createMediaElementSource(this.player);
  
      // panner
      this.pannerNode = audioContext.createStereoPanner();
  
      // visualization
      this.analyser = audioContext.createAnalyser();
      
      // Try changing for lower values: 512, 256, 128, 64...
      this.analyser.fftSize = 1024;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      
      playerNode
        .connect(this.pannerNode)
        .connect(this.analyser)
        .connect(audioContext.destination);
  
      this.canvas = this.shadowRoot.querySelector("#myCanvas2")
      this.vuMetter = this.shadowRoot.querySelector(ids.idVuMetter)
      console.log('canvas', this.canvas.width);
      this.canvasContext = this.canvas.getContext('2d');
          
      requestAnimationFrame(this.visualize);
  
      this.declareListeners();
    }, 1000)
    console.log('connectedCallback');
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
      this.play();
    });

    this.shadowRoot.querySelector(ids.idButtonPause).addEventListener("click", (event) => {
      this.pause();
    });

    this.shadowRoot.querySelector(ids.idButtonStop).addEventListener("click", (event) => {
      this.reset();
    });

    this.shadowRoot
      .querySelector(ids.idKnobVolume)
      .addEventListener("input", (event) => {
        this.setVolume(event.target.value);
      });

    this.shadowRoot
      .querySelector(ids.idKnobVolume2)
      .addEventListener("input", (event) => {
        this.setBalance(event.target.value)
      });

    this.shadowRoot
      .querySelector(ids.idProgressAudio)
      .addEventListener("input", (event) => {
        this.setCurrentTime(event.target.value)
      });

    this.player.addEventListener("timeupdate", (event) => {
      const p = this.shadowRoot.querySelector(ids.idProgressAudio)
      try {
        p.max = this.player.duration
        p.value = this.player.currentTime
      }
      catch (e){
        console.error(e)
      }
    })

    // this.player.addEventListener("timeupdate", (event) => {
    //   const p = this.shadowRoot.querySelector(ids.idVuMetter)
    //   try {
    //     p.max = this.canvas.height;
    //     p.value = this.maxY || 0
    //   }
    //   catch (e){
    //     console.error(e)
    //   }
    // })
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
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  reset() {
    this.player.currentTime = 0;
  }
}

customElements.define("my-audioplayer", MyAudioPlayer);
