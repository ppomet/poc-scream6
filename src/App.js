import './App.css';
import React from 'react';

function App() {
  return (
    <div className="App">
      <div className="w-[100vw] h-[100vh]">
        <div className="text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] relative">
          <div className="text-5xl text-center">
            Vous allez bientôt vivre une expérience inédite.
          </div>
          <div className="absolute">
            <img src="../public/scream.png" alt="scream" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
