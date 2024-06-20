import React, { useState, useEffect } from 'react';
import './App.css';
import PlayerInput from './PlayerInput';
import DealerSection from './DealerSection';
import WongHalvesCounter from './WongHalvesCounter';

const counter = new WongHalvesCounter();

const App = () => {
  const initialPlayerState = () => ({
    cards: [],
    splitCards: [],
    active: false,
    mySeat: false,
    score: 0,
    splitScores: []
  });

  const [playerInputs, setPlayerInputs] = useState(Array(7).fill().map(initialPlayerState));
  const [dealerCards, setDealerCards] = useState([]);
  const [counts, setCounts] = useState(counter.getCurrentCount());
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    updateDisplayCount();
  }, [playerInputs, dealerCards]);

  const setPlayer = (index) => {
    const newInputs = playerInputs.map((input, i) => i === index ? { ...input, active: true } : input);
    setPlayerInputs(newInputs);
  };

  const deactivatePlayer = (index) => {
    const newInputs = playerInputs.map((input, i) => i === index ? { ...input, active: false, mySeat: false } : input);
    setPlayerInputs(newInputs);
  };

  const takeSeat = (index) => {
    const newInputs = playerInputs.map((input, i) => i === index ? { ...input, mySeat: true } : input);
    setPlayerInputs(newInputs);
  };

  const addCard = (containerId, card) => {
    const parts = containerId.split('_');
    if (parts[0] === 'dealer') {
      const newDealerCards = [...dealerCards, card];
      setDealerCards(newDealerCards);
      updateDisplayCount(playerInputs, newDealerCards);
    } else {
      const index = parseInt(parts[0].replace('player', ''), 10) - 1;
      const splitIndex = parts.length > 1 ? parseInt(parts[1], 10) : null;

      const newInputs = playerInputs.map((input, i) => {
        if (i === index) {
          if (splitIndex !== null) {
            const newSplitCards = input.splitCards.map((split, j) => j === splitIndex ? [...split, card] : split);
            return { ...input, splitCards: newSplitCards, splitScores: newSplitCards.map(split => calculateScore(split)) };
          }
          const newCards = [...input.cards, card];
          return { ...input, cards: newCards, score: calculateScore(newCards) };
        }
        return input;
      });

      setPlayerInputs(newInputs);
      updateDisplayCount(newInputs, dealerCards);
    }
  };

  const splitCards = (index) => {
    const newInputs = playerInputs.map((input, i) => {
      if (i === index && input.cards.length === 2 && input.cards[0] === input.cards[1]) {
        const newSplitCards = [[input.cards[1]]];
        return { ...input, splitCards: newSplitCards, cards: [input.cards[0]], score: calculateScore([input.cards[0]]), splitScores: newSplitCards.map(split => calculateScore(split)) };
      }
      return input;
    });
    setPlayerInputs(newInputs);
  };

  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;
    cards.forEach(card => {
      if (card === 'A') {
        aces += 1;
        score += 11;
      } else if (['K', 'Q', 'J'].includes(card)) {
        score += 10;
      } else {
        score += parseInt(card, 10);
      }
    });
    while (score > 21 && aces) {
      score -= 10;
      aces -= 1;
    }
    return score;
  };

  const updateDisplayCount = (newPlayerInputs = playerInputs, newDealerCards = dealerCards) => {
    newPlayerInputs.forEach(input => {
      counter.updateCount(input.cards);
      input.splitCards.forEach(split => counter.updateCount(split));
    });
    counter.updateCount(newDealerCards);
    setCounts(counter.getCurrentCount());
  };

  const startNewRound = () => {
    const newInputs = playerInputs.map(input => ({
      ...input,
      cards: [],
      splitCards: [],
      score: 0,
      splitScores: []
    }));
    setPlayerInputs(newInputs);
    setDealerCards([]);
    setRecommendation('');
    updateDisplayCount(newInputs, []); // Обновляем отображение без сброса счетчика
  };

  const newShuffle = () => {
    counter.reset();
    setCounts(counter.getCurrentCount()); // сброс счетчиков
    const newInputs = Array(7).fill().map(initialPlayerState);
    setPlayerInputs(newInputs);
    setDealerCards([]);
    setRecommendation('');
  };

  const generateRecommendation = () => {
    // Generate recommendation logic
  };

  return (
    <div id="app">
      <div className="top-right-buttons">
        <button onClick={newShuffle}>New Shuffle</button>
        <button onClick={startNewRound}>Start New Round</button>
      </div>
      <div className="top-left-count" id="output">
        <p>Running Count: {counts.runningCount}</p>
        <p>True Count: {counts.trueCount}</p>
      </div>
      <div id="playerInputs" className="grid-container">
        {playerInputs.map((input, index) => (
          <PlayerInput key={index} index={index + 1} data={input} addCard={addCard} setPlayer={setPlayer} deactivatePlayer={deactivatePlayer} takeSeat={takeSeat} splitCards={splitCards} />
        ))}
      </div>
      <DealerSection dealerCards={dealerCards} addCard={addCard} />
      <div id="recommendation">{recommendation}</div>
    </div>
  );
};

export default App;
