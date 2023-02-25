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
  const [progress, setProgress] = useState(26);

  const startPresentation = () => {
    setTimeout(() => {
      setIsFirstPage(false);
    }, 5000);
  };

  const handleStart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);
  };

  const handleStop = () => {
    audioSource.disconnect();
    audioStream.getTracks().forEach((track) => track.stop());
    setAudioStream(null);
  };

  const handleVolumeChange = (volume) => {
    // Do something with the volume level
  };

  const handleKeyPress = async (event) => {
    if (event.key === ' ') {
      if (calibrage === 0) {
        setCalibrage(() => 1);
      } else if (calibrage === 1) {
        setCalibrage(() => 2);
      } else if (presentation === 0) {
        setPresentation(() => 1); // start presentation
        startPresentation();
      }
      console.log(`"${event.key}"`);
    } else if (event.key === 'v') {
      if (!audioStream) {
        await handleStart();
      } else {
        handleStop();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    console.log('toto');
    return () => window.removeEventListener('keydown', () => handleKeyPress);
  });

  const firstPageTexts = [
    'Préparez vos cordes vocales.',
    'Vous allez bientôt vivre une expérience inédite.',
  ];

  const secondPageTexts = [
    'Préparez vos cordes vocales.',
    "C'EST ÇA QUE VOUS APPELEZ CRIER ?",
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
        <div className="text-white absolute top-1/2 left-1/2 w-[1200px] flex flex-col items-center justify-center translate-x-[-50%] translate-y-[-50%]">
          {calibrage <= 1 ? (
            <div className="text-4xl text-center font-bold">
              {calibrage === 0
                ? "Appuyez sur la barre espace pour initialiser l'application."
                : 'Tapez dans vos mains pour calibrer le micro. Appuyez sur la barre espace pour lancer la présentation.'}
              {calibrage === 1 && (
                <VUMeter
                  audioStream={audioStream}
                  audioSource={audioSource}
                  audioContext={audioContext}
                  onVolumeChange={handleVolumeChange}
                  setAudioSource={setAudioSource}
                  setAudioContext={setAudioContext}
                />
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
                      {secondPageTexts[1]}
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
                    <div className="absolute left-0 mr-[80px]">
                      <VUMeter
                        audioStream={audioStream}
                        audioSource={audioSource}
                        audioContext={audioContext}
                        onVolumeChange={handleVolumeChange}
                        setAudioSource={setAudioSource}
                        setAudioContext={setAudioContext}
                      />
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
