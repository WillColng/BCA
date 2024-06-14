import React, { useState, useEffect } from 'react';
import './App.css';

class WongHalvesCounter {
  constructor(decks = 6) {
    this.decks = decks;
    this.reset();
  }

  reset() {
    this.runningCount = 0;
    this.cardsSeen = 0;
    this.trueCount = 0;
  }

  cardValue(card) {
    const values = {
      '2': 0.5, '3': 1, '4': 1, '5': 1.5, '6': 1, '7': 0.5, '8': 0, '9': -0.5,
      '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
    };
    return values[card] || 0;
  }

  updateCount(cards) {
    cards.forEach(card => {
      this.runningCount += this.cardValue(card);
      this.cardsSeen += 1;
    });
    this.updateTrueCount();
  }

  updateTrueCount() {
    const decksRemaining = this.decks - (this.cardsSeen / 52);
    this.trueCount = this.runningCount / decksRemaining;
  }

  getCurrentCount() {
    return {
      runningCount: this.runningCount,
      trueCount: this.trueCount.toFixed(2)
    };
  }
}

const counter = new WongHalvesCounter();

const App = () => {
  const [playerInputs, setPlayerInputs] = useState(Array(7).fill().map(() => ({ cards: [], splitCards: [], active: false, mySeat: false })));
  const [dealerCards, setDealerCards] = useState([]);
  const [counts, setCounts] = useState(counter.getCurrentCount());
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    updateAndDisplayCount();
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
    const index = parseInt(parts[0].replace('player', ''), 10) - 1;
    const splitIndex = parts.length > 1 ? parseInt(parts[1], 10) : null;

    const newInputs = playerInputs.map((input, i) => {
      if (i === index) {
        if (splitIndex !== null) {
          const newSplitCards = input.splitCards.map((split, j) => j === splitIndex ? [...split, card] : split);
          return { ...input, splitCards: newSplitCards };
        }
        return { ...input, cards: [...input.cards, card] };
      }
      return input;
    });

    setPlayerInputs(newInputs);
    updateAndDisplayCount(newInputs, dealerCards);
  };

  const splitCards = (index) => {
    const newInputs = playerInputs.map((input, i) => {
      if (i === index && input.cards.length === 2 && input.cards[0] === input.cards[1]) {
        return { ...input, splitCards: [[input.cards[0]], [input.cards[1]]], cards: [] };
      }
      return input;
    });
    setPlayerInputs(newInputs);
  };

  const updateAndDisplayCount = () => {
    counter.reset();
    playerInputs.forEach(input => {
      counter.updateCount(input.cards);
      input.splitCards.forEach(split => counter.updateCount(split));
    });
    counter.updateCount(dealerCards);
    setCounts(counter.getCurrentCount());
    generateRecommendation();
  };

  const startNewRound = () => {
    setPlayerInputs(Array(7).fill().map(() => ({ cards: [], splitCards: [], active: false, mySeat: false })));
    setDealerCards([]);
    setRecommendation('');
    updateAndDisplayCount();
  };

  const newShuffle = () => {
    counter.reset();
    startNewRound();
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

const PlayerInput = ({ index, data, addCard, setPlayer, deactivatePlayer, takeSeat, splitCards }) => {
  return (
    <div className={`form-group ${data.active ? 'active' : 'inactive'}`} id={`player${index}`}>
      <label htmlFor={`player${index}Cards`}>Player {index} Cards</label>
      <div id={`player${index}Cards`} className={`card-container ${data.active ? '' : 'hidden'}`}>
        {data.cards.map((card, i) => (
          <span key={i} className="card">{card}</span>
        ))}
        {data.splitCards.map((split, i) => (
          <div key={i} className="split">
            {split.map((card, j) => (
              <span key={j} className="card">{card}</span>
            ))}
            <div className="card-buttons">
              {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map(card => (
                <button key={card} onClick={() => addCard(`player${index}_${i}`, card)}>{card}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p id={`player${index}Score`}>Score: {data.score}</p>
      <div className={`card-buttons ${data.active ? '' : 'hidden'}`} id={`player${index}CardButtons`}>
        {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map(card => (
          <button key={card} onClick={() => addCard(`player${index}`, card)}>{card}</button>
        ))}
      </div>
      <div id={`player${index}Split`} className={`split-container ${data.active ? '' : 'hidden'}`}>
        {data.cards.length === 2 && data.cards[0] === data.cards[1] && (
          <button type="button" className="btn split-btn" onClick={() => splitCards(index - 1)}>Split</button>
        )}
      </div>
      {!data.active && !data.mySeat && <button type="button" className="btn set-player-btn" onClick={() => setPlayer(index - 1)}>Set Player</button>}
      {data.active && (
        <>
          <button type="button" className="btn deactivate-btn" onClick={() => deactivatePlayer(index - 1)}>Deactivate</button>
          {!data.mySeat && <button type="button" className="btn take-seat-btn" onClick={() => takeSeat(index - 1)}>Take Seat</button>}
        </>
      )}
      {data.mySeat && <p className="my-seat">My Seat</p>}
    </div>
  );
};

const DealerSection = ({ dealerCards, addCard }) => {
  return (
    <div id="dealerSection">
      <label htmlFor="dealerCardContainer">Dealer Cards</label>
      <div id="dealerCardContainer" className="card-container">
        {dealerCards.map((card, index) => (
          <span key={index} className="card">{card}</span>
        ))}
      </div>
      <p id="dealerScore">Score: {/* Calculate dealer score here */}</p>
      <div className="card-buttons" id="dealerCardButtons">
        {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map(card => (
          <button key={card} onClick={() => addCard('dealerCardContainer', card)}>{card}</button>
        ))}
      </div>
    </div>
  );
};

export default App;
