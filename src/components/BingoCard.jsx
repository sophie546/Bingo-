import React, { useState } from 'react';
import './BingoCard.css';

const BingoCard = ({ card, calledNumbers, onRemove, onCheckWin }) => {
  const { id, token, cardData, isWinner } = card;
  const [markedNumbers, setMarkedNumbers] = useState([]);

  // Get card numbers from API data
  const getCardNumbers = () => {
    if (cardData && typeof cardData === 'object') {
      const numbers = [];
      
      ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
        if (cardData[letter] && Array.isArray(cardData[letter])) {
          cardData[letter].forEach(num => {
            numbers.push(num);
          });
        }
      });
      
      return numbers;
    }
    
    return generateMockCard();
  };
  
  const cardNumbers = getCardNumbers();
  
  // Split into columns
  const bingoColumns = {
    B: cardNumbers.slice(0, 5),
    I: cardNumbers.slice(5, 10),
    N: cardNumbers.slice(10, 15),
    G: cardNumbers.slice(15, 20),
    O: cardNumbers.slice(20, 25)
  };

  // Check if number is called
  const isNumberCalled = (number) => {
    if (!number) return false;
    const numStr = number.toString();
    return calledNumbers.includes(numStr) || markedNumbers.includes(numStr);
  };

  // Toggle marking
  const toggleMarkNumber = (number) => {
    if (!number) return;
    const numStr = number.toString();
    setMarkedNumbers(prev => 
      prev.includes(numStr) 
        ? prev.filter(n => n !== numStr)
        : [...prev, numStr]
    );
  };

  // Check for potential win
  const checkPotentialWin = () => {
    const patterns = [
      // Rows
      [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
      // Columns
      [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
      // Diagonals
      [0,6,12,18,24], [4,8,12,16,20]
    ];
    
    return patterns.some(pattern =>
      pattern.every(index => isNumberCalled(cardNumbers[index]))
    );
  };

  const isPotentialWinner = checkPotentialWin();

  return (
    <div className={`bingo-card ${isWinner ? 'winner' : ''} ${isPotentialWinner ? 'potential-winner' : ''}`}>
      <div className="card-header">
        <div className="card-title-section">
          <h3>BINGO CARD</h3>
          <div className="card-status">
            <div className={`status-indicator ${isWinner ? 'winner' : isPotentialWinner ? 'potential' : 'active'}`}>
              {isWinner ? 'WINNER' : isPotentialWinner ? 'POTENTIAL' : 'ACTIVE'}
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button 
            onClick={() => onCheckWin(token, id)}
            className={`check-btn ${isWinner ? 'winner-btn' : ''} ${isPotentialWinner ? 'potential-btn' : ''}`}
          >
            CHECK WIN
          </button>
          <button onClick={() => onRemove(id)} className="remove-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="card-grid">
        <div className="bingo-header">
          {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
            <div key={letter} className={`bingo-letter ${letter}`}>
              {letter}
              <div className="letter-glow"></div>
            </div>
          ))}
        </div>
        
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div key={rowIndex} className="card-row">
            {['B', 'I', 'N', 'G', 'O'].map((col, colIndex) => {
              const number = bingoColumns[col] ? bingoColumns[col][rowIndex] : '';
              const isCalled = isNumberCalled(number);
              
              return (
                <div 
                  key={`${col}-${rowIndex}`}
                  className={`card-cell ${isCalled ? 'called' : ''}`}
                  onClick={() => toggleMarkNumber(number)}
                  title={`${number} - Click to mark/unmark`}
                >
                  {number}
                  {isCalled && <div className="cell-mark"></div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="card-footer">
        <div className="token-display">
          <div className="token-label">TOKEN</div>
          <div className="token-value">{token?.substring(0, 14)}...</div>
        </div>
      </div>
    </div>
  );
};

const generateMockCard = () => {
  const card = [];
  const ranges = [
    { letter: 'B', min: 1, max: 15, count: 5 },
    { letter: 'I', min: 16, max: 30, count: 5 },
    { letter: 'N', min: 31, max: 45, count: 5 },
    { letter: 'G', min: 46, max: 60, count: 5 },
    { letter: 'O', min: 61, max: 75, count: 5 }
  ];
  
  ranges.forEach(({ min, max }) => {
    const numbers = new Set();
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    Array.from(numbers).sort((a, b) => a - b).forEach(num => card.push(num));
  });
  
  return card;
};

export default BingoCard;