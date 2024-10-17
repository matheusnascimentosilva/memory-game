import React, { useState, useEffect } from "react";
import './App.css';

const initialCards = [
  { id: 1, name: "🍎", flipped: false, matched: false },
  { id: 2, name: "🍌", flipped: false, matched: false },
  { id: 3, name: "🍇", flipped: false, matched: false },
  { id: 4, name: "🍉", flipped: false, matched: false },
  { id: 5, name: "🍒", flipped: false, matched: false },
  { id: 6, name: "🍓", flipped: false, matched: false },
  { id: 7, name: "🥝", flipped: false, matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Duplicar e embaralhar as cartas
    const shuffledCards = [...initialCards, ...initialCards]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
  }, []);

  const handleFlip = (index) => {
    if (flippedCards.length === 2) return;

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
        const newCards = [...cards];
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setMatchedPairs(matchedPairs + 1);
        setScore(score + 10);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
        }, 1000);
      }
      setFlippedCards([]);
    }
  }, [flippedCards, cards, matchedPairs, score]);

  return (
    <div className="App">
      <h1>Jogo da Memória</h1>
      <p>{score} pontos</p>
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
      {matchedPairs === initialCards.length && <h2>Parabéns, você venceu!</h2>}
    </div>
  );
}

export default App;
