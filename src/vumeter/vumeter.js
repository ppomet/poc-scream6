const threshold = 20; // set the threshold level to 50%
const timeThreshold = 1000; // set the time threshold to 1000ms
const timeGranularity = 100; // value in ms for the computing
let elapsedTime = 0; // temp passe au dessus du niveau
let computingsound = 0;
let processor = null;

let meter = null;
let canvasContext = null;
const WIDTH = 50;
const HEIGHT = 500;
let rafID = null;
var mediaStreamSource = null;
var myMeter = null;

function volumeThresholdPeriod(volume) {
  // console.log("functionx")
  console.log(volume * 100);
  const intervaler = setInterval(() => {
    // console.log("intervaler values:")
    // console.log({elt: elapsedTime, thre: threshold, timg: timeGranularity})
    if (volume * 100 >= threshold) {
      console.log({ vol: parseInt(volume, 10), thre: threshold });
      elapsedTime += timeGranularity;
    } else {
      elapsedTime = 0;
    }

    if (elapsedTime >= timeThreshold) {
      console.log(
        `Volume was above ${threshold}% for at least ${timeThreshold}ms`
      );
      computingsound++;
      alert('triggered add percent');
    }
  }, timeGranularity);
}

function volumeAudioProcess(event) {
  const buf = event.inputBuffer.getChannelData(0);
  const bufLength = buf.length;
  let sum = 0;
  let x;

  // Do a root-mean-square on the samples: sum up the squares...
  for (let i = 0; i < bufLength; i++) {
    x = buf[i];
    if (Math.abs(x) >= this.clipLevel) {
      this.clipping = true;
      this.lastClip = window.performance.now();
    }
    sum += x * x;
  }

  // ... then take the square root of the sum.
  const rms = Math.sqrt(sum / bufLength);

  // Now smooth this out with the averaging factor applied
  // to the previous sample - take the max here because we
  // want "fast attack, slow release."
  this.volume = Math.max(rms, this.volume * this.averaging);
  // console.log(this.volume)
  volumeThresholdPeriod(this.volume);
}

function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
  processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

  // this will have no effect, since we don't copy the input to the output,
  // but works around a current Chrome bug.
  processor.connect(audioContext.destination);

  processor.checkClipping = function () {
    if (!this.clipping) return false;
    if (this.lastClip + this.clipLag < window.performance.now())
      this.clipping = false;
    return this.clipping;
  };

  processor.shutdown = function () {
    this.disconnect();
    this.onaudioprocess = null;
  };

  return processor;
}

function drawLoop() {
  // clear the background
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // check if we're currently clipping
  if (meter.checkClipping()) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = 'green';
  }
  // draw a bar based on the current volume
  ctx.fillRect(0, HEIGHT, WIDTH, -meter.volume * HEIGHT * 1.4);
}
