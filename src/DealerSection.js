import React from 'react';

const DealerSection = ({ dealerCards, addCard }) => {
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

  const dealerScore = calculateScore(dealerCards);

  return (
    <div id="dealerSection">
      <label htmlFor="dealerCardContainer">Dealer Cards</label>
      <div id="dealerCardContainer" className="card-container">
        {dealerCards.map((card, index) => (
          <span key={index} className="card">{card}</span>
        ))}
      </div>
      <p id="dealerScore">Score: {dealerScore}</p>
      <div className="card-buttons" id="dealerCardButtons">
        {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map(card => (
          <button key={card} onClick={() => addCard('dealer', card)}>{card}</button>
        ))}
      </div>
    </div>
  );
};

export default DealerSection;
