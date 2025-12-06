import React, { useState, useEffect } from 'react';
import './App.css';
import CardGrid from './components/CardGrid';
import GameControls from './components/GameControls';
import GameBoard from './components/GameBoard';

function App() {
  const [cards, setCards] = useState([]);
  const [gameState, setGameState] = useState({
    isWatching: false,
    currentNumbers: [],
    gameCode: '',
    manualMode: true
  });
  const [inputGameCode, setInputGameCode] = useState('');

  // Update game board when game code changes
  useEffect(() => {
    if (gameState.gameCode) {
      fetchGameBoard();
    }
  }, [gameState.gameCode]);

  const handleSetGameCode = () => {
    if (inputGameCode.trim()) {
      setGameState(prev => ({ ...prev, gameCode: inputGameCode.trim() }));
    }
  };

  const fetchGameBoard = async () => {
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = `http://www.hyeumine.com/bingodashboard.php?bcode=${gameState.gameCode}`;
      
      const response = await fetch(proxyUrl + targetUrl, {
        headers: {
          'Origin': 'http://localhost:3000',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      const text = await response.text();
      console.log('Game board response:', text.substring(0, 200));
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const allText = doc.body.textContent || '';
      
      const numberRegex = /\b([1-9]|[1-6][0-9]|7[0-5])\b/g;
      const numberMatches = allText.match(numberRegex);
      
      if (numberMatches) {
        const uniqueNumbers = [...new Set(numberMatches)];
        console.log('Found numbers:', uniqueNumbers);
        setGameState(prev => ({ ...prev, currentNumbers: uniqueNumbers }));
      } else {
        console.log('No numbers found in response');
        setGameState(prev => ({ ...prev, currentNumbers: [] }));
      }
      
    } catch (error) {
      console.error('Error fetching game board:', error);
      window.open(`http://www.hyeumine.com/bingodashboard.php?bcode=${gameState.gameCode}`, '_blank');
      alert(`Game board opened in new tab. Please check it manually.`);
    }
  };

  const addNewCard = async () => {
    if (!gameState.gameCode) {
      alert('Please enter a game code first!');
      return;
    }
    
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = `http://www.hyeumine.com/getcard.php?bcode=${gameState.gameCode}`;
      
      const response = await fetch(proxyUrl + targetUrl);
      const data = await response.json();
      
      console.log('Full card response:', data);
      
      if (data === 0 || data === "0") {
        alert('Invalid game code or game not found');
        return;
      }

      const token = data.playcard_token;
      const cardData = data.card;
      
      console.log('Token:', token);
      console.log('Card data:', cardData);
      
      const newCard = {
        id: Date.now(),
        token: token,
        cardData: cardData,
        isWinner: false
      };

      setCards(prev => [...prev, newCard]);
      
      alert(`✅ Card added successfully!\n\nToken: ${token}\n\nYour card numbers are ready!`);
      
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Failed to add new card. Error: ' + error.message);
    }
  };

  const removeCard = (cardId) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const checkCardWin = async (cardToken, cardId) => {
    try {
      console.log('Checking win for token:', cardToken);
      
      // Open the win check URL in a new tab for manual inspection
      const winUrl = `http://www.hyeumine.com/checkwin.php?playcard_token=${cardToken}`;
      console.log('Win check URL:', winUrl);
      
      // Open in new tab for debugging
      window.open(winUrl, '_blank');
      
      // Try to fetch the response
      const response = await fetch(winUrl);
      const html = await response.text();
      
      console.log('Raw HTML response length:', html.length);
      console.log('First 500 chars:', html.substring(0, 500));
      
      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Get all text content
      const textContent = doc.body.textContent || '';
      console.log('Text content:', textContent);
      
      // Check for win indicators - looking at the actual response structure
      let isWinner = false;
      const lowercaseText = textContent.toLowerCase().replace(/\s+/g, ' ');
      console.log('Cleaned text:', lowercaseText);
      
      // More specific win detection
      if (lowercaseText.includes('bingo') || 
          lowercaseText.includes('win') ||
          lowercaseText.includes('congratulations') ||
          lowercaseText.includes('you win') ||
          lowercaseText.includes('winner') ||
          lowercaseText.includes('has won') ||
          lowercaseText.includes('prize')) {
        isWinner = true;
        console.log('WIN DETECTED via text match');
      }
      
      // Also check for "1" in the response (some APIs use this)
      if (textContent.includes('1') && !textContent.includes('0')) {
        isWinner = true;
        console.log('WIN DETECTED via "1"');
      }
      
      // Check for no-win indicators
      if (lowercaseText.includes('no win') ||
          lowercaseText.includes('not a winner') ||
          lowercaseText.includes('keep playing') ||
          lowercaseText.includes('try again')) {
        isWinner = false;
        console.log('NO WIN detected');
      }
      
      // Check for empty or error responses
      if (textContent.trim() === '' || textContent.includes('error')) {
        console.log('Empty or error response');
        alert('Could not check win status. Please check manually in the opened tab.');
        return;
      }
      
      console.log('Final win determination:', isWinner);
      
      // Update card status
      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, isWinner } : card
      ));

      // Show appropriate message
      if (isWinner) {
        alert(`🎉 BINGO! YOU WIN! 🎉\n\nToken: ${cardToken}\n\nPlease check the opened tab to confirm your win!`);
      } else {
        alert(`Not a winning card yet. Keep playing!\n\nToken: ${cardToken}\n\nCheck the opened tab for details.`);
      }
      
    } catch (error) {
      console.error('Error checking win:', error);
      
      // Fallback: Open the URL and show manual instructions
      const winUrl = `http://www.hyeumine.com/checkwin.php?playcard_token=${cardToken}`;
      window.open(winUrl, '_blank');
      
      alert(`Error checking card. A new tab has been opened.\n\nPlease check manually:\n${winUrl}\n\nLook for "BINGO", "WIN", or "Congratulations" in the page.`);
    }
  };

  const checkAllCards = async () => {
    if (cards.length === 0) {
      alert('No cards to check!');
      return;
    }
    
    alert(`Checking all ${cards.length} cards...\n\nA new tab will open for each card check.`);
    
    for (const card of cards) {
      await checkCardWin(card.token, card.id);
      // Small delay between checks
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const toggleWatchMode = () => {
    setGameState(prev => ({ ...prev, isWatching: !prev.isWatching }));
  };

  const addManualNumber = () => {
    const input = prompt('Enter called number (e.g., 1, 16, 31, 46, 61):\nJust the number, no letters!');
    if (input) {
      const number = input.trim();
      const num = parseInt(number);
      if (!isNaN(num) && num >= 1 && num <= 75) {
        if (!gameState.currentNumbers.includes(number)) {
          setGameState(prev => ({
            ...prev,
            currentNumbers: [...prev.currentNumbers, number].sort((a, b) => a - b)
          }));
          alert(`Added number: ${number}`);
        } else {
          alert(`Number ${number} is already added.`);
        }
      } else {
        alert('Invalid number! Must be between 1 and 75.');
      }
    }
  };

  const copyTokenToClipboard = () => {
    if (cards.length === 0) {
      alert('No cards yet!');
      return;
    }
    
    const token = cards[0].token;
    navigator.clipboard.writeText(token)
      .then(() => {
        alert(`Token copied to clipboard:\n${token}\n\nNow test it at:\nhttp://www.hyeumine.com/checkwin.php?playcard_token=${token}`);
      })
      .catch(err => {
        alert('Failed to copy: ' + err);
      });
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>E-Bingo</h1>
        
        <div className="game-code-section">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter Game Code (e.g. 8HSSmpno)"
              value={inputGameCode}
              onChange={(e) => setInputGameCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSetGameCode()}
              className="code-input"
            />
            
            <button onClick={handleSetGameCode} className="primary-button">
              Set Game Code
            </button>
          </div>
          
          {gameState.gameCode && (
            <div className="current-game-info">
              <div className="game-code-display">
                Active Game: <strong className="code-value">{gameState.gameCode}</strong>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="app-container">
        <div className="game-sidebar">
          <GameControls
            onAddCard={addNewCard}
            onCheckAll={checkAllCards}
            onToggleWatch={toggleWatchMode}
            isWatching={gameState.isWatching}
            cardCount={cards.length}
            onManualNumber={addManualNumber}
          />
          
          <GameBoard
            numbers={gameState.currentNumbers}
            isWatching={gameState.isWatching}
            onRefresh={fetchGameBoard}
            gameCode={gameState.gameCode}
          />
        </div>

        <div className="cards-section">
          <CardGrid
            cards={cards}
            onRemoveCard={removeCard}
            onCheckWin={checkCardWin}
            calledNumbers={gameState.currentNumbers}
          />
        </div>
      </div>
    </div>
  );
}

export default App;