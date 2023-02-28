import React, { useState, useEffect } from 'react';

const VUMeter = ({
  audioSource,
  audioContext,
  isCalibration,
  maxVolumeCorrection,
  setmaxVolumeCorrection,
  onVolumeChange,
}) => {
  const [volumeLevel, setVolumeLevel] = useState(0);

  useEffect(() => {
    let myReq;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    audioSource.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let factorCorrection = (1 / maxVolumeCorrection) * 1;
    if (factorCorrection < 1) {
      alert('correction factor error');
      factorCorrection = 1;
    }
    console.log(
      `correction Fact (${factorCorrection}) max Vol (${maxVolumeCorrection}))`
    );
    if (!isCalibration) {
      console.log({ maxVolumeCorrection, factorCorrection });
      //   debugger;
    }

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      let volume;
      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
      if (isCalibration) {
        volume = average / 255;
      } else {
        volume = (average / 255) * factorCorrection /*- 0.15*/;
        if (volume > 1) {
          console.warn(
            `volume got to high (${volume}) fact(${maxVolumeCorrection})`
          );
          setmaxVolumeCorrection((maxVolumeCorrection) => {
            if (maxVolumeCorrection < 1) {
              let flatCorrected = (maxVolumeCorrection += 0.05);
              let averageCorrected =
                (maxVolumeCorrection + average / 255) / 2 - 0.1;
              console.log(
                `maxVolumeCorrection flat(${flatCorrected}) avg(${averageCorrected})`
              );
              console.log(`average 255 (${average / 255})`);
              console.log(
                `highest value ${Math.max(flatCorrected, averageCorrected)}`
              );
              debugger;
              return flatCorrected;
            } else if (maxVolumeCorrection >= 1) {
              return 1;
            }
          });
          volume = 1;
        }
      }
      setVolumeLevel(volume);
      onVolumeChange(volume);
      myReq = requestAnimationFrame(updateVolume);
    };

    myReq = requestAnimationFrame(updateVolume);
    return () => {
      cancelAnimationFrame(myReq);
      //   stopHandler();
    };
  }, [maxVolumeCorrection]);

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
