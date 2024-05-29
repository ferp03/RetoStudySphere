import React from 'react';
import NavBar from '../Components/NavBar';
import Logo from '../Components/Logo';
import './Game.css';

const Game = () => {
  return (
    <>
      <NavBar />
      <div className="game-container">
        <header>
          <Logo />
          <h1>Play Game for Extra Credit</h1>
        </header>
        <div className="game-content">
        <iframe src="https://i.simmer.io/@LordVader305/astro-blast" title="Astro Blast Game" ></iframe>
        </div>
      </div>
    </>
  );
};

export default Game;
