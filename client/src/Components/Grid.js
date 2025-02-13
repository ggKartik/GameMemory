import React, { useState, useEffect } from "react";
import "./Grid.css";

const Grid = ({ rows, columns, level, setLevel }) => {
  const [cardsArray, setCardsArray] = useState([
    { name: "shell", img: "img/blueshell.png" },
    { name: "star", img: "img/star.png" },
    { name: "bobomb", img: "img/bobomb.png" },
    { name: "mario", img: "img/mario.png" },
    { name: "luigi", img: "img/luigi.png" },
    { name: "peach", img: "img/peach.png" },
    { name: "1up", img: "img/1up.png" },
    { name: "mushroom", img: "img/mushroom.png" },
    { name: "thwomp", img: "img/thwomp.png" },
    { name: "bulletbill", img: "img/bulletbill.png" },
    { name: "coin", img: "img/coin.png" },
    { name: "goomba", img: "img/goomba.png" },
    { name: "logo1", img: "img/logo1.jpeg" },
    { name: "logo2", img: "img/logo2.jpeg" },
    { name: "logo3", img: "img/logo3.jpeg" },
    { name: "logo4", img: "img/logo4.jpeg" },
    { name: "logo5", img: "img/logo5.jpeg" },
    { name: "logo6", img: "img/logo6.jpeg" },
    { name: "logo7", img: "img/logo7.jpeg" },
    { name: "house", img: "img/house.jpeg" },
    { name: "whitedog", img: "img/whitedog.jpeg" },
  ]);

  const [gameGrid, setGameGrid] = useState([]);
  const [firstGuess, setFirstGuess] = useState("");
  const [secondGuess, setSecondGuess] = useState("");
  const [count, setCount] = useState(0);
  const [previousTarget, setPreviousTarget] = useState(null);
  const [revealedCards, setRevealedCards] = useState([]); // Track revealed cards
  const [revealedCardsLength, setRevealedCardsLength] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false); // Loading state
  const delay = 500;

  // Initialize the game grid
  useEffect(() => {
    const duplicatedCards = cardsArray.slice(0, (rows * columns) / 2);
    const shuffledCards = duplicatedCards.concat(duplicatedCards);
    shuffledCards.sort(() => 0.5 - Math.random());
    const updatedCards = shuffledCards.map((card) => {
      card.matched = 0; // Set matched to 0 for each card
      return card; // Return the updated card
    });
    setGameGrid(updatedCards);
    setFirstGuess("");
    setSecondGuess("");
    setCount(0);
    setPreviousTarget(null);
    setRevealedCards([]);
    setRevealedCardsLength(0);
    setIsLoaded(true); // Set loaded when grid is set
  }, [rows, columns]);

  // Handle card click
  const handleClick = (index) => {
    if (
      count >= 2 ||
      gameGrid[index].name === previousTarget ||
      gameGrid[index].matched ||
      revealedCards.includes(index) // Prevent re-revealing already revealed cards
    ) {
      return;
    }

    // Add the card to the revealed cards list
    setRevealedCards((prev) => [...prev, index]);

    if (count === 0) {
      setFirstGuess(gameGrid[index].name);
      setCount(1);
      setPreviousTarget(index);
    } else if (count === 1) {
      setSecondGuess(gameGrid[index].name);
      setCount(2);

      if (firstGuess === gameGrid[index].name) {
        setTimeout(() => {
          const updatedGrid = [...gameGrid];
          updatedGrid[index].matched = true;
          setRevealedCardsLength(revealedCardsLength + 1);
          updatedGrid[previousTarget].matched = true;
          setGameGrid(updatedGrid);
          resetGuesses();
        }, delay);
      } else {
        setTimeout(() => {
          resetGuesses();
          setRevealedCards([]); // Hide unmatched cards after delay
        }, delay);
      }
    }
  };

  // Reset guesses
  const resetGuesses = () => {
    setFirstGuess("");
    setSecondGuess("");
    setCount(0);
    setPreviousTarget(null);
  };

  // Check if the game is complete
  useEffect(() => {
    const allMatched = revealedCardsLength === (rows * columns) / 2;
    if (allMatched) {
      alert(`Congratulations! You completed the level ${level}`);
      setLevel(level + 1);
    }
  }, [revealedCardsLength, rows, columns, level]);

  return (
    isLoaded ? (
      <div className="game">
        <section
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "10px",
          }}
        >
          {gameGrid.map((card, index) => (
            <div
              key={index}
              className={`card ${revealedCards.includes(index) ? 'selected' : ''}`}
              onClick={() => handleClick(index)}
            >
              <div className="front">
                <img
  src={revealedCards.includes(index) || card.matched ? card.img : "img/question.gif"}
  alt={card.name}
  style={{ objectFit: "contain" }}
/>
              </div>
              <div className="back"></div>
            </div>
          ))}
        </section>
      </div>
    ) : (
      <div>Loading...</div> // Render a loading message while the grid is not loaded
    )
  );
};

export default Grid;
