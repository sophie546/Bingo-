import React from 'react';
import BingoCard from './BingoCard';
import './CardGrid.css';

const CardGrid = ({ cards, onRemoveCard, onCheckWin, calledNumbers }) => {
  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Bingo Cards</h3>
        <p>Add a new card to begin playing</p>
      </div>
    );
  }

  return (
    <div className="card-grid-container">
      <div className="grid-header">
        <h2>BINGO CARDS</h2>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">TOTAL:</span>
            <span className="stat-value">{cards.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">WINNERS:</span>
            <span className="stat-value winner">{cards.filter(c => c.isWinner).length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">ACTIVE:</span>
            <span className="stat-value active">{cards.filter(c => !c.isWinner).length}</span>
          </div>
        </div>
      </div>
      
      <div className="cards-grid">
        {cards.map(card => (
          <BingoCard
            key={card.id}
            card={card}
            calledNumbers={calledNumbers}
            onRemove={onRemoveCard}
            onCheckWin={onCheckWin}
          />
        ))}
      </div>
    </div>
  );
};

export default CardGrid;