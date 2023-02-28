import React, { useState, useEffect } from 'react';

const VUMeter = ({
  audioSource,
  audioContext,
  correctionFactors,
  setAudioCorrection,
  onVolumeChange,
  lastTime,
  setLastTime,
  corrIterations,
  setCorrIterations,
}) => {
  const [volumeLevel, setVolumeLevel] = useState(0);

  const autoCorrection = (average, time) => {
    if (time > lastTime + 300) {
      console.warn('debouncing animationFrame');
    }
    let obj = { ...correctionFactors };
    console.debug({ obj });
    obj.current = 1 / obj.maxVol - obj.offset;

    let flatCorrected = (obj.maxVol += obj.flatFactor);
    let averageCorrected =
      (obj.maxVol + average / 255) / 2 - obj.flatFactor * 1.5;
    console.debug(
      `maxVolumeCorrection flat(${flatCorrected}) avg(${averageCorrected})`
    );
    console.debug(`average 255 (${average / 255})`);
    let maxError = Math.max(flatCorrected, averageCorrected);
    console.debug(
      `maxError ${maxError} vol margin (${average / 255 + obj.margin})`
    );
    if (maxError >= average / 255 + obj.margin) {
      console.debug('we didnt go over margin');
    } else {
      console.info(
        `last corr maxVol(${parseFloat(obj.maxVol).toFixed(
          3
        )} avgFrom last(${parseFloat(average / 255).toFixed(3)} iterations (${
          corrIterations + 1
        })`
      );
      setCorrIterations((corr) => (corr += 1));
      setAudioCorrection(() => obj);
      setLastTime(() => time);
    }
  };

  useEffect(() => {
    let myReq;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    audioSource.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = (time) => {
      analyser.getByteFrequencyData(dataArray);
      let volume;
      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
      volume = (average / 255) * correctionFactors.current;
      // console.info(`vol(${volume})`);
      if (volume > 1) {
        // console.warn(`volume got to high (${volume})`);
        autoCorrection(average, time);
        volume = 1;
      }
      setVolumeLevel(volume);
      onVolumeChange(volume);
      myReq = requestAnimationFrame(updateVolume);
    };

    myReq = requestAnimationFrame(updateVolume);
    return () => {
      cancelAnimationFrame(myReq);
      // debugger;
      //   stopHandler();
    };
  }, [correctionFactors]);

  const generateView = () => {
    const view = [];
    for (let i = 25; i >= 1; i--) {
      view.push(
        <div
          key={i}
          id={i}
          className="h-[7px] rounded-full w-[30px] mb-[6px]"
          style={{
            backgroundColor: volumeLevel * 100 >= i * 4 ? 'red' : 'white',
          }}
        ></div>
      );
    }
    return view;
  };

  return (
    <div>
      <div className="flex flex-col">{generateView().map((item) => item)}</div>
      {/* <meter className="meter" value={volumeLevel} min="0" max="1" /> */}
    </div>
  );
};

export default VUMeter;
