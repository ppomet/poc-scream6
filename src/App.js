import './App.css';
import React, { useEffect, useState } from 'react';
import VUMeter from './components/Vumeter/Vumeter';

function App() {
  const [audioStream, setAudioStream] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [calibrage, setCalibrage] = useState(0);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [presentation, setPresentation] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);
  const [maxFactor, setMaxFactor] = useState(0.0);
  const [isAudioStarted, setIsAudioStarted] = useState(false);

  let debugFlag = false;
  let volumeFactor = 0.6;
  let volumeThreshold = 0.3;
  let progressTimer = 100;
  let progressQuantityThreshold = 10;
  let progressQuantity = 0;
  // let maxFactor = 0;
  // const setMaxFactor = (value) => {
  //   maxFactor = value;
  // };

  const startPresentation = () => {
    setTimeout(() => {
      setIsFirstPage(false);
    }, 10);
  };

  const micCalibration = (volume) => {
    if (calibrage === 1) {
      console.log(`calibration vol=(${volume}) max=(${maxFactor})`);
      if (volume >= maxFactor) {
        setMaxFactor(volume);
        // maxFactor = volume;
      }
    } else {
      console.log('nope');
    }
  };

  const textThresold = () => {
    let index;
    if (progress < 6) {
      index = 0;
    } else if (progress < 14) {
      index = 1;
    } else if (progress < 23) {
      index = 2;
    } else if (progress < 36) {
      index = 3;
    } else if (progress < 42) {
      index = 4;
    } else if (progress < 59) {
      index = 5;
    } else if (progress < 66) {
      index = 6;
    } else if (progress < 78) {
      index = 7;
    } else if (progress < 89) {
      index = 8;
    } else if (progress < 100) {
      index = 9;
    } else {
      index = 10;
    }
    return secondPageTexts[index];
  };

  const handleStart = async () => {
    console.log('handlestart');
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          googEchoCancellation: 'false',
          googAutoGainControl: 'false',
          googNoiseSuppression: 'false',
          googHighpassFilter: 'false',
        },
      },
    });
    console.log('-------------- audio Stream -----------------');
    console.log(stream);
    setAudioStream(stream);
  };

  useEffect(() => {
    const bob = async () => {
      if (audioStream !== null) {
        const context = await new AudioContext();
        console.log('----------- audio context -------------------');
        console.log(context);
        setAudioContext(context);
        const source = await context.createMediaStreamSource(audioStream);
        console.log('----------------- audio source --------------');
        console.log(source);
        setAudioSource(source);
        setIsAudioStarted(true);
      }
    };
    bob();
  }, [audioStream]);

  const handleStop = () => {
    console.log('handlestop');
    console.log(audioSource);
    audioSource.disconnect();
    audioStream.getTracks().forEach((track) => track.stop());
    setAudioStream(null);
  };

  const handleVolumeChange = (volume) => {
    console.log(`WTF ${maxFactor}`);
    if (!debugFlag && progress < 100) {
      //calibrage dans les conditions ??
      console.log(`calib status = ${debugFlag}`);
      debugFlag = true;
      setTimeout(() => {
        debugFlag = false;
        if (volume >= volumeThreshold) {
          if (progressQuantity < progressQuantityThreshold) {
            console.info('bobby');
            progressQuantity += 1;
          } else {
            console.info('dan dao');
            progressQuantity = 0;
            if (progress < 100) setProgress((progress) => progress + 1);
          }
        }
      }, progressTimer);
    }
    // console.log(
    //   `progress internal = ${progressQuantity}/${progressQuantityThreshold}`
    // );
  };

  const handleKeyPress = async (event) => {
    if (event.key === ' ') {
      if (calibrage === 0) {
        setCalibrage(() => 1);
        await handleStart();
      } else if (calibrage === 1) {
        setCalibrage(() => 2);
      } else if (presentation === 0) {
        setPresentation(() => 1); // start presentation
        startPresentation();
      }
    }
    // else if (event.key === 'v') {
    //   if (!audioStream) {
    //     await handleStart();
    //   } else {
    //     handleStop();
    //   }
    //   console.log(`"${event.key}"`);
    // }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', () => handleKeyPress);
  });

  const firstPageTexts = [
    'Préparez vos cordes vocales.',
    'Vous allez bientôt vivre une expérience inédite.',
  ];

  const secondPageTexts = [
    'FAITES TREMBLER LA SALLE...',
    'CRIEZ COMME SI VOTRE VIE EN DEPENDAIT !',
    "C'EST CA QUE VOUS APPELEZ CRIER ?",
    'LACHEZ VOUS !',
    'ON ENTENDS LES MOUCHES VOLER...',
    "C'EST CA VOTRE MAXIMUM?",
    'ON NE VA PAS Y PASSER LA NUIT !',
    'VOUS VOULEZ VRAIMENT VOIR LE FILM ?',
    "VOUS N'AVEZ PLUS DE VOIX ?",
    'BAH ALORS, ON FAIBLIT !',
    'LE FILM PEUT COMMENCER.',
  ];

  return (
    <div className="App">
      <div
        className={`w-[100vw] h-[100vh] ${
          isFirstPage
            ? 'bg-black-background duration-300 bg-bottom bg-cover'
            : ''
        }`}
      >
        <div className="text-white absolute top-1/2 left-1/2 w-[1000px] flex flex-col items-center justify-center translate-x-[-50%] translate-y-[-50%]">
          {calibrage <= 1 ? (
            <div className="text-4xl text-center font-bold">
              {calibrage === 0
                ? "Appuyez sur la barre espace pour initialiser l'application."
                : 'Tapez dans vos mains pour calibrer le micro. Appuyez sur la barre espace pour lancer la présentation.'}
              {calibrage === 1 && (
                <div className="mx-auto w-fit mt-[50px]">
                  {isAudioStarted && (
                    <VUMeter
                      audioStream={audioStream}
                      audioSource={audioSource}
                      audioContext={audioContext}
                      maxFactor={maxFactor}
                      onVolumeChange={micCalibration}
                      setAudioSource={setAudioSource}
                      setAudioContext={setAudioContext}
                      stopHandler={handleStop}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              <div className="text-3xl whitespace-nowrap font-bold text-center w-full">
                {isFirstPage ? (
                  firstPageTexts[presentation]
                ) : (
                  <div className="text-center">
                    <div className="absolute text-4xl font-bold left-1/2 translate-x-[-50%] mt-[-70px]">
                      {textThresold()}
                    </div>
                    <div className="w-[430px] mx-auto border-[0.5px] border-white h-[50px] ring-0 relative">
                      <div
                        style={{ width: progress + '%' }}
                        className="bg-[red] h-[42px] mb-[4px] mx-[4px] mt-[3px] drop-shadow-lg"
                      ></div>
                      <div className="text-4xl mt-[-2px] font-bold absolute top-1/2 left-1/2 text-center translate-x-[-50%] translate-y-[-50%]">
                        {progress}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                {!isFirstPage && (
                  <>
                    <div className="absolute left-0 translate-y-[-50%] mt-[-30px]">
                      {isAudioStarted && (
                        <VUMeter
                          audioStream={audioStream}
                          audioSource={audioSource}
                          audioContext={audioContext}
                          onVolumeChange={handleVolumeChange}
                        />
                      )}
                    </div>
                    <div className="text-5xl absolute bottom-0 mb-[300px] left-1/2 translate-x-[-50%] whitespace-nowrap text-center w-full font-bold">
                      <span className="text-[red]">CRIEZ</span> POUR LANCER LE
                      FILM.
                    </div>
                  </>
                )}
                <div className="absolute top-0 w-full mt-[80px]">
                  <img
                    className="mx-auto  w-[390px]"
                    src="/scream.png"
                    alt="scream"
                  />
                  <div className="text-center font-bold text-xl">
                    PARTAGEZ VOS RÉACTIONS #SCREAMVI
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
