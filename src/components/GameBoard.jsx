import React from 'react';
import './GameBoard.css';

const GameBoard = ({ gameCode }) => {
  return (
    <div className="game-board">
      <div className="board-header">
        <h3>GAME BOARD</h3>
      </div>
      
      <div className="board-content">
        <p className="board-description">
          View the official game board to track called numbers and game progress
        </p>
        
        {gameCode && (
          <a 
            href={`http://www.hyeumine.com/bingodashboard.php?bcode=${gameCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="official-board-btn"
          >
            <span className="btn-main-text">VIEW OFFICIAL BOARD</span>
            <span className="btn-subtext">Opens in new tab</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default GameBoard;