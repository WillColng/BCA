import React from 'react';

const PlayerInput = ({ index, data, addCard, setPlayer, deactivatePlayer, takeSeat, splitCards }) => {
  return (
    <div className={`form-group ${data.active ? 'active' : 'inactive'}`} id={`player${index}`}>
      <label htmlFor={`player${index}Cards`}>Player {index} Cards</label>
      <div id={`player${index}Cards`} className={`card-container ${data.active ? '' : 'hidden'}`}>
        {data.cards.map((card, i) => (
          <span key={i} className="card">{card}</span>
        ))}
      </div>
      <p>Score: {data.score}</p>
      <div className={`card-buttons ${data.active ? '' : 'hidden'}`} id={`player${index}CardButtons`}>
        {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map(card => (
          <button key={card} onClick={() => addCard(`player${index}`, card)}>{card}</button>
        ))}
      </div>
      {data.splitCards.map((split, i) => (
        <div key={i} className="split">
          <label htmlFor={`player${index}_split${i}Cards`}>Split {i + 1} Cards</label>
          <div id={`player${index}_split${i}Cards`} className="card-container">
            {split.map((card, j) => (
              <span key={j} className="card">{card}</span>
            ))}
          </div>
          <p>Score: {data.splitScores[i]}</p>
          <div className="card-buttons">
            {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map(card => (
              <button key={card} onClick={() => addCard(`player${index}_${i}`, card)}>{card}</button>
            ))}
          </div>
        </div>
      ))}
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

export default PlayerInput;
