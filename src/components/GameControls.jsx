import React from 'react';
import './GameControls.css';

const GameControls = ({ onAddCard, onCheckAll, cardCount }) => {
  return (
    <div className="game-controls">
      <h3>CONTROLS</h3>
      
      <div className="control-buttons">
        <button onClick={onAddCard} className="control-btn add-card-btn">
          <span className="btn-text">ADD NEW CARD</span>
          <span className="btn-subtext">Generate new bingo card</span>
        </button>
        
        <button 
          onClick={onCheckAll}
          className="control-btn check-all-btn"
          disabled={cardCount === 0}
        >
          <span className="btn-text">CHECK ALL CARDS</span>
          <span className="btn-subtext">Verify all cards for wins</span>
        </button>
      </div>
      
      <div className="game-info">
        <div className="info-item">
          <span className="info-label">CARDS IN PLAY</span>
          <div className="card-count">{cardCount}</div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;