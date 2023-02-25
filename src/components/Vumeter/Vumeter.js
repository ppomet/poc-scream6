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

  return (
    <div>
      <meter className="meter" value={volumeLevel} min="0" max="1" />
    </div>
  );
};

export default VUMeter;
