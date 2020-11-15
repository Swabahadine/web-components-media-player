
import './lib/webaudio-controls.js';

import { ids, myTemplate } from './template.js'

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
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'src' && oldValue !== newValue) {
      // console.log('src changeyyyy');
    }
    // console.log(name, newValue);
  }

  connectedCallback() {
    this.player = this.shadowRoot.querySelector(ids.idPlayer);
    const isloop = this.getAttribute('loop') === 'true' || this.getAttribute('loop') === '';
    this.player.loop = isloop;

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
    console.log('canvas', this.canvas.width);
    this.canvasContext = this.canvas.getContext('2d');
        
    requestAnimationFrame(this.visualize);

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

  visualize = () => {
    // clear the canvas
    // like this: canvasContext.clearRect(0, 0, width, height);
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Or use rgba fill to give a slight blur effect
    this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.canvasContext.fillRect(0, 0, width, height);
    
    // Get the analyser data
    this.analyser.getByteTimeDomainData(this.dataArray);
  
    this.canvasContext.lineWidth = 2;
    this.canvasContext.strokeStyle = 'lightBlue';
  
    // all the waveform is in one single path, first let's
    // clear any previous path that could be in the buffer
    this.canvasContext.beginPath();
    
    var sliceWidth = width / this.bufferLength;
    var x = 0;
  
    for(var i = 0; i < this.bufferLength; i++) {
       // normalize the value, now between 0 and 1
       var v = this.dataArray[i] / 255;
      
       // We draw from y=0 to height
       var y = v * height;
  
       if(i === 0) {
          this.canvasContext.moveTo(x, y);
       } else {
          this.canvasContext.lineTo(x, y);
       }
  
       x += sliceWidth;
    }
  
    this.canvasContext.lineTo(this.canvas.width, this.canvas.height/2);
    
    // draw the path at once
    this.canvasContext.stroke();  
    
    // call again the visualize function at 60 frames/s
    requestAnimationFrame(this.visualize);
    
  }
}

customElements.define("my-audioplayer", MyAudioPlayer);
