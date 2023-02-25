import './App.css';
import React, { useEffect, useState } from 'react';
import VUMeter from './components/Vumeter/Vumeter';

// eslint-disable-next-line react/function-component-definition, react/prop-types
const Fragments = ({ fragmentContent }) => {
  return <div>{fragmentContent}</div>;
};

function App() {
  // const isFirstPage = false;

  const [fragment, setFragment] = useState('rien');
  // const [fragmentContent, setFragmentContent] = useState('null');
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [audioStream, setAudioStream] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [audioSource, setAudioSource] = useState(null);

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
      setFragment(() => 'makeid(40)');
      // setFragmentContent(makeid(10));
      if (isFirstPage) {
        setIsFirstPage(() => false);
      }
    } else if (event.key === 'v') {
      if (!audioStream) {
        await handleStart();
      } else {
        handleStop();
      }
    }
    // setLastPressedKey(event.key);
    console.log(`"${event.key}"`);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  return (
    <div className="App">
      <div
        className={`w-[100vw] h-[100vh] ${
          isFirstPage ? 'bg-black-background bg-bottom bg-cover' : ''
        }`}
      >
        <div className="text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <div className="text-3xl font-bold text-center w-[30vw]">
            {fragment}
          </div>
          <div className="relative">
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
            <div className="text-4xl absolute bottom-0 mb-[200px] text-center w-full font-bold">
              <span className="text-[red]">CRIEZ</span> POUR LANCER LE FILM.
            </div>
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
      </div>
    </div>
  );
}

export default App;
