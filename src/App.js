import './App.css';
import React from 'react';

function App() {
  const isFirstPage = false;

  return (
    <div className="App">
      <div
        className={`w-[100vw] h-[100vh] ${
          isFirstPage ? 'bg-black-background bg-bottom bg-cover' : ''
        }`}
      >
        <div className="text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <div className="text-3xl font-bold text-center">
            Vous allez bientôt vivre une expérience inédite.
          </div>

          <div className="relative">
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
