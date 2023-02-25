import React, { useState, useEffect } from 'react';

const VUMeter = ({
  audioStream,
  audioSource,
  audioContext,
  onVolumeChange,
  setAudioSource,
  setAudioContext,
}) => {
  const [volumeLevel, setVolumeLevel] = useState(0);

  useEffect(() => {
    if (audioStream) {
      const context = new AudioContext();
      const source = context.createMediaStreamSource(audioStream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      setAudioContext(context);
      setAudioSource(source);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
        const volume = average / 255;

        setVolumeLevel(volume);
        // console.log(volume);

        onVolumeChange(volume);
        requestAnimationFrame(updateVolume);
      };

      requestAnimationFrame(updateVolume);
    } else {
      setAudioContext(null);
      setAudioSource(null);
      setVolumeLevel(0);
    }
  }, [audioStream]);

  //   const handleStart = async () => {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     onStart(stream);
  //   };

  //   const handleStop = () => {
  //     source.disconnect();
  //     onStop();
  //   };

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
