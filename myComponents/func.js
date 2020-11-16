export function visualize(){
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
    let maxY = 0;
    for(var i = 0; i < this.bufferLength; i++) {
       // normalize the value, now between 0 and 1
       var v = this.dataArray[i] / 255;
      
       // We draw from y=0 to height
       var y = v * height;
       let l = Math.abs(y - 0.5) * 2 - height
       if (l > maxY){
           maxY = l
       }
  
       if(i === 0) {
          this.canvasContext.moveTo(x, y);
       } else {
          this.canvasContext.lineTo(x, y);
       }
  
       x += sliceWidth;
    }
    // console.log('maxY', maxY);
    this.vuMetter.value = maxY
    this.vuMetter.max = height
    // console.log(this.maxY);
  
    this.canvasContext.lineTo(this.canvas.width, this.canvas.height/2);
    
    // draw the path at once
    this.canvasContext.stroke();  
    
    // call again the visualize function at 60 frames/s
    
    requestAnimationFrame(this.visualize);
    
  }