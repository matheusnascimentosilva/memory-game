import React, { useState, useEffect } from "react";
import './App.css';

/* The `initialCards` constant is an array of objects representing the cards used in the memory game.
Each object in the array represents a card with the following properties:
- `id`: A unique identifier for the card.
- `name`: The emoji symbol displayed on the card.
- `flipped`: A boolean indicating whether the card is currently flipped (face up) or not.
- `matched`: A boolean indicating whether the card has been matched with its pair. */

const initialCards = [
  { id: 1, name: "🍎", flipped: false, matched: false },
  { id: 2, name: "🍌", flipped: false, matched: false },
  { id: 3, name: "🍇", flipped: false, matched: false },
  { id: 4, name: "🍉", flipped: false, matched: false },
  { id: 5, name: "🍒", flipped: false, matched: false },
  { id: 6, name: "🍓", flipped: false, matched: false },
  { id: 7, name: "🥝", flipped: false, matched: false },
  { id: 8, name: "🍈", flipped: false, matched: false },
  { id: 9, name: "🍋", flipped: false, matched: false },
  { id: 10, name: "🍑", flipped: false, matched: false },
  { id: 11, name: "🥥", flipped: false, matched: false },
  { id: 12, name: "🍍", flipped: false, matched: false },
  { id: 13, name: "🥑", flipped: false, matched: false },
  { id: 14, name: "🍅", flipped: false, matched: false },
];

/* These lines of code are creating instances of the `Audio` object in JavaScript. Each instance is
associated with a specific sound file hosted at the provided URLs. Here's what each instance
represents: */

const flipSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
const matchSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
const winSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");

/**
 * The function `App` implements a memory card game with features such as flipping cards, keeping
 * score, tracking time, managing lives, and displaying a high score.
 * @returns The `App` component is being returned, which contains the game board for a Memory Match
 * game. The component includes elements for displaying the game status such as score, time, lives, and
 * high score. It also renders the game cards with their respective names or question marks based on
 * their flipped or matched status. Additionally, there are messages displayed when the game is won or
 * when the game is over.
 */

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    let timer;
    if (!isGameOver && matchedPairs < initialCards.length) {
      timer = setInterval(() => setTime(time + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [time, isGameOver, matchedPairs]);

  const startGame = () => {
    const shuffledCards = [...initialCards, ...initialCards]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setTime(0);
    setLives(20);
    setIsGameOver(false);
  };

  const handleFlip = (index) => {
    if (flippedCards.length === 2 || isGameOver) return;

    flipSound.play();
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, index]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setScore(score + 1);

      if (cards[first].name === cards[second].name) {
        matchSound.play();
        const newCards = [...cards];
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setMatchedPairs(matchedPairs + 1);
        setScore(score + 10);
        setLives(lives + 2);

        if (matchedPairs + 1 === initialCards.length) {
          winSound.play();
          setIsGameOver(true);
          if (score > highScore) {
            localStorage.setItem('highScore', score);
            setHighScore(score);
          }
        }
      } else {
        setLives(lives - 1);
        if (lives - 1 === 0) {
          setIsGameOver(true);
        }
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
        }, 1000);
      }
      setFlippedCards([]);
    }
  }, [flippedCards, cards, matchedPairs, score, lives, highScore]);

  return (
    <div className="container">
      <div className="sidebar">
        <h1>Jogo da Memória</h1>
        <p>Pontuação: {score}</p>
        <p>Tempo: {time} segundos</p>
        <p>Vidas: {lives}</p>
        <p>High Score: {highScore}</p>
        {(matchedPairs === initialCards.length || isGameOver) && (
          <button onClick={startGame}>Jogar novamente</button>
        )}
      </div>

      <div className="game-board">
        <div className="grid">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
              onClick={() => handleFlip(index)}
            >
              {card.flipped || card.matched ? card.name : "?"}
            </div>
          ))}
        </div>
        {matchedPairs === initialCards.length && (
          <>
            <audio autoPlay src={winSound}></audio>
            <h2 style={{ color: "green" }}>Parabéns, você venceu!</h2>
          </>
        )}
        {isGameOver && lives === 0 && (
          <h2 style={{ color: "red" }}>Fim de Jogo! Tente novamente.</h2>
        )}
      </div>
    </div>
  );
}

/* `export default App;` is exporting the `App` function component as the default export of the
JavaScript module. This allows other parts of the application to import and use the `App` component.
When another file imports this module, they can simply import it as the default export without
needing to specify a specific name for the import. */

export default App;
