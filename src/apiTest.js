export const testAPI = async () => {
  const GAME_CODE = 'HEelhJos';
  
  console.log('Testing Bingo API...');
  
  try {
    // Test getcard endpoint
    console.log('1. Testing getcard.php...');
    const cardResponse = await fetch(`http://www.hyeumine.com/getcard.php?bcode=${GAME_CODE}`);
    const cardData = await cardResponse.text();
    console.log('Card response:', cardData);
    
    // Test checkwin endpoint
    console.log('2. Testing checkwin.php...');
    // We need a token to test this
    if (cardData && cardData !== "0") {
      const token = typeof cardData === 'string' ? cardData : (cardData.playcard_token || 'test_token');
      const winResponse = await fetch(`http://www.hyeumine.com/checkwin.php?playcard_token=${token}`);
      const winData = await winResponse.text();
      console.log('Win check response:', winData);
    }
    
    // Test dashboard endpoint
    console.log('3. Testing bingodashboard.php...');
    const boardResponse = await fetch(`http://www.hyeumine.com/bingodashboard.php?bcode=${GAME_CODE}`);
    const boardData = await boardResponse.text();
    console.log('Board response:', boardData);
    
    return {
      card: cardData,
      board: boardData
    };
  } catch (error) {
    console.error('API test failed:', error);
    return null;
  }
};