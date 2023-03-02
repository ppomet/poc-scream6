import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import VUMeter from './components/Vumeter/Vumeter';
import logo from './public/scream_compressed.png';

function App() {
  const [audioStream, setAudioStream] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [presentation, setPresentation] = useState(0);
  const [progressConf, setProgressConf] = useState({
    // prod values
    increment: 0.5, //0.5
    quantity: 0, //0
    threshold: 20, //20
  });
  const progConfRef = useRef(progressConf);
  const [presText, setPresText] = useState('');
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(progress);

  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const [corrIterations, setCorrIterations] = useState(0);

  const [audioCorrection, setAudioCorrection] = useState({
    // prod values
    flatFactor: 0.05, //0.05
    current: 1.42, //2
    maxVol: 0.7, //0.7
    offset: 0.1, //0.1
    margin: 0.05, //0.05
  });

  let waitFlag = false;
  let started = false;
  // prod values:
  let volumeThreshold = 0.85; //  0.85
  let progressTimer = 140; // 140
  const timeBetweenSlides = 8000; // 8000

  const startPresentation = () => {
    setTimeout(() => {
      setIsFirstPage(false);
    }, timeBetweenSlides);
  };

  const endPresentation = () => {
    setTimeout(() => {
      setIsLastPage(true);
    }, timeBetweenSlides);
  };

  const segmentAndProgress = () => {
    // console.log(`seg prog(${progress}) progREF(${progressRef.current})`);
    if (progressRef.current < 6) {
      setPresText(secondPageTexts[0]);
      // alert('triggered');
      // setProgressConf()
    } else if (progressRef.current < 14) {
      setPresText(secondPageTexts[1]);
      // setProgressConf()
    } else if (progressRef.current < 23) {
      setPresText(secondPageTexts[2]);
      // setProgressConf()
    } else if (progressRef.current < 36) {
      setPresText(secondPageTexts[3]);
      // setProgressConf()
    } else if (progressRef.current < 42) {
      setPresText(secondPageTexts[4]);
      // setProgressConf()
    } else if (progressRef.current < 59) {
      setPresText(secondPageTexts[5]);
      // setProgressConf()
    } else if (progressRef.current < 66) {
      setPresText(secondPageTexts[6]);
      // setProgressConf()
    } else if (progressRef.current < 78) {
      setPresText(secondPageTexts[7]);
      // setProgressConf()
    } else if (progressRef.current < 89) {
      setPresText(secondPageTexts[8]);
      // setProgressConf()
    } else if (progressRef.current < 100) {
      setPresText(secondPageTexts[9]);
      // setProgressConf()
    } else {
      setPresText(secondPageTexts[10]);
    }
  };

  const handleStart = async () => {
    // debugger;
    console.log('handlestart');
    console.log(`started ${started}`);
    if (!started) {
      started = true;
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
      setAudioStream(stream);
    }
  };

  useEffect(() => {
    const asyncFix = async () => {
      if (audioStream !== null) {
        const context = await new AudioContext();
        setAudioContext(context);
        const source = await context.createMediaStreamSource(audioStream);
        setAudioSource(source);
        setIsAudioStarted(true);
        //---------------------------------------------------------
        setPresentation(() => 1);
        startPresentation();
        //---------------------------------------------------------
      }
    };
    asyncFix();
  }, [audioStream]);

  const handleStop = () => {
    console.log('handlestop');
    console.log(audioSource);
    audioSource.disconnect();
    audioStream.getTracks().forEach((track) => track.stop());
    setAudioStream(null);
  };

  useEffect(() => {
    // fix of progress inside a setTimeout
    progressRef.current = progress;
    progConfRef.current = progressConf;
    segmentAndProgress();
  }, [progress, progressConf]);

  const handleVolumeChange = (volume) => {
    if (!waitFlag && progressRef.current < 100) {
      segmentAndProgress();
      waitFlag = true;
      setTimeout(() => {
        waitFlag = false;
        if (volume >= volumeThreshold) {
          if (progConfRef.current.quantity < progConfRef.current.threshold) {
            setProgressConf((progressConf) => {
              return {
                ...progressConf,
                quantity: progressConf.quantity + progressConf.threshold,
              };
            });
          } else {
            setProgressConf((progressConf) => {
              return {
                ...progressConf,
                quantity: 0,
              };
            });
            if (progressRef.current < 100)
              setProgress((progress) => progress + 1);
          }
        }
      }, progressTimer);
    } else if (progressRef.current >= 100) {
      endPresentation();
      // handleStop(); // sometimes in the future I may debug this function ...
    }
  };

  const handleKeyPress = async (event) => {
    if (event.key === ' ' && !started) {
      if (presentation === 0) {
        await handleStart();
        // setPresentation(() => 1);
        // startPresentation();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  const redText = 'CRIEZ';
  const afterRedText = ` POUR LANCER LE FILM.`;

  const footText = 'PARTAGEZ VOS RÉACTIONS #SCREAMVI';
  const endText = 'NOUVELLE VILLE. NOUVELLES RÈGLES.';

  const firstPageTexts = [
    'Préparez vos cordes vocales.',
    'Vous allez bientôt vivre une expérience inédite.',
  ];

  const secondPageTexts = [
    'FAITES TREMBLER LA SALLE...',
    'CRIEZ COMME SI VOTRE VIE EN DÉPENDAIT !',
    'C’EST ÇA QUE VOUS APPELEZ CRIER ?',
    'LÂCHEZ-VOUS !',
    'ON ENTEND LES MOUCHES VOLER...',
    'C’EST ÇA VOTRE MAXIMUM ?',
    'ON NE VA PAS Y PASSER LA NUIT !',
    'VOUS VOULEZ VRAIMENT VOIR LE FILM ?',
    'VOUS N’AVEZ PLUS DE VOIX ?',
    'BAH ALORS, ON FAIBLIT ?',
    'LE FILM PEUT COMMENCER.',
  ];

  // {isLastPage ? `${''}` : `${''}` }

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
          <div className="w-full">
            <div className="text-6xl whitespace-nowrap font-bold text-center w-full">
              {isFirstPage ? (
                firstPageTexts[presentation]
              ) : (
                <div className="text-center">
                  {!isLastPage && (
                    <div className="absolute text-5xl font-bold left-1/2 translate-x-[-50%] mt-[-70px]">
                      {presText}
                    </div>
                  )}
                  {!isLastPage && (
                    <div
                      id="progress-stuff"
                      className="w-[440px] mx-auto border-[1.2px] border-white h-[50px] ring-0 relative"
                    >
                      <div
                        style={{
                          width: (progress < 100 ? progress : 100) * 0.98 + '%',
                        }}
                        className={`${
                          progress < 100 ? 'bg-[red]' : ' bg-[green]'
                        }  h-[42px] mb-[4px] mx-[4px] mt-[3px] drop-shadow-lg`}
                      ></div>
                      <div className="text-4xl mt-[-2px] font-bold absolute top-1/2 left-1/2 text-center translate-x-[-50%] translate-y-[-50%]">
                        {progress < 100 ? progress : 100}%
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              {!isFirstPage && !isLastPage && (
                <>
                  <div className="absolute left-0 translate-y-[-50%] mt-[-30px]">
                    {isAudioStarted && (
                      <VUMeter
                        audioSource={audioSource}
                        audioContext={audioContext}
                        correctionFactors={audioCorrection}
                        lastTime={lastTime}
                        corrIterations={corrIterations}
                        setCorrIterations={setCorrIterations}
                        setLastTime={setLastTime}
                        setAudioCorrection={setAudioCorrection}
                        onVolumeChange={handleVolumeChange}
                      />
                    )}
                  </div>
                  {!isLastPage && (
                    <div className="text-5xl absolute bottom-0 mb-[300px] left-1/2 translate-x-[-50%] whitespace-nowrap text-center w-full font-bold">
                      <span className="text-[red]">{redText}</span>
                      {afterRedText}
                    </div>
                  )}
                </>
              )}
              <div
                id="bob"
                className={`${
                  isLastPage
                    ? 'absolute top-0 w-full mt-[-100px]'
                    : 'absolute top-0 w-full mt-[60px]'
                }`}
              >
                <img
                  id="scream-logo"
                  className={`${
                    !isLastPage
                      ? 'mx-auto  w-[390px]                   '
                      : 'mx-auto  w-[490px]                   '
                  }`}
                  src={logo}
                  alt="scream"
                />
                {isLastPage && (
                  <div>
                    <div className="w-full absolute text-5xl text-center font-bold left-1/2 translate-x-[-50%] mt-[15px]">
                      {endText}
                    </div>
                  </div>
                )}
                <div
                  id="foot"
                  className={
                    isLastPage
                      ? `${'text-center font-bold text-3xl mt-[75px]'}`
                      : `${'text-center font-bold text-3xl mt-[20px]'}`
                  }
                >
                  {footText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
