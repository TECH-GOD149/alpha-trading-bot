const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    status: "Alpha Trading Bot Running",
    version: "3.0",
    broker: "Headway",
    account: "3676615"
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    broker: "Headway",
    account: "3676615"
  });
});

app.get('/api/signal/:pair', (req, res) => {
  const { pair } = req.params;
  const valid = ['BTCUSD', 'XAUUSD', 'GBPUSD'];
  
  if (!valid.includes(pair)) {
    return res.json({ pair, signal: "HOLD" });
  }
  
  const prices = { BTCUSD: 65123, XAUUSD: 2348, GBPUSD: 1.2734 };
  const price = prices[pair];
  const score = Math.random() * 100;
  const hour = new Date().getUTCHours();
  const isActive = (hour >= 8 && hour <= 22);
  const finalScore = isActive ? score : score * 0.5;
  
  if (finalScore >= 80) {
    const direction = Math.random() > 0.5 ? "BUY" : "SELL";
    const atr = price * 0.005;
    
    res.json({
      pair,
      signal: direction,
      entryPrice: price,
      stopLoss: direction === "BUY" ? price - atr : price + atr,
      takeProfit: direction === "BUY" ? price + atr * 1.5 : price - atr * 1.5,
      confidence: finalScore / 100,
      timestamp: new Date().toISOString()
    });
  } else {
    res.json({ pair, signal: "HOLD", score: Math.round(finalScore) });
  }
});

app.post('/api/trade/log', (req, res) => {
  console.log("Trade:", req.body);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Alpha Bot running on port ${PORT}`);
});