import './App.css';
import React, { useEffect, useState } from 'react';

function makeid(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// eslint-disable-next-line react/function-component-definition
const Fragments = ({ fragmentContent }) => {
  return <div>{fragmentContent}</div>;
};

const Vumeter = (props) => {
  return <canvas id="meter" width="50" height="500"></canvas>;
};

function App() {
  // const isFirstPage = false;

  const [fragment, setFragment] = useState('rien');
  const [fragmentContent, setFragmentContent] = useState('null');
  const [isFirstPage, setIsFirstPage] = useState(true);

  const handleKeyPress = (event) => {
    if (event.key === ' ') {
      setFragment(makeid(40));
      // setFragmentContent(makeid(10));
      if (isFirstPage) {
        setIsFirstPage(() => false);
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
              <Vumeter />
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
