const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// ROOT ROUTE - FIXES 404 ERROR
app.get('/', (req, res) => {
  res.json({ 
    status: "Alpha Trading Bot Running",
    version: "3.0",
    broker: "Headway",
    account: "3676615",
    endpoints: {
      health: "GET /health",
      signal: "GET /api/signal/:pair",
      trade_log: "POST /api/trade/log"
    },
    pairs: ["BTCUSD", "XAUUSD", "GBPUSD"]
  });
});

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    broker: "Headway",
    account: "3676615"
  });
});

// SIGNAL GENERATOR
app.get('/api/signal/:pair', (req, res) => {
  const { pair } = req.params;
  
  console.log(`[${new Date().toISOString()}] Signal request for ${pair}`);
  
  const validPairs = ['BTCUSD', 'XAUUSD', 'GBPUSD'];
  if (!validPairs.includes(pair)) {
    return res.json({ pair, signal: "HOLD", reason: "Invalid pair" });
  }
  
  const prices = {
    BTCUSD: 65123.45,
    XAUUSD: 2348.67,
    GBPUSD: 1.2734
  };
  
  const currentPrice = prices[pair];
  const atr = currentPrice * 0.005;
  const randomScore = Math.random() * 100;
  const hour = new Date().getUTCHours();
  const isActive = (hour >= 8 && hour <= 22);
  const score = isActive ? randomScore : randomScore * 0.5;
  
  if (score >= 80) {
    const isBuy = Math.random() > 0.5;
    const direction = isBuy ? "BUY" : "SELL";
    let stopLoss, takeProfit;
    
    if (isBuy) {
      stopLoss = currentPrice - atr;
      takeProfit = currentPrice + (atr * 1.5);
    } else {
      stopLoss = currentPrice + atr;
      takeProfit = currentPrice - (atr * 1.5);
    }
    
    console.log(`✅ SIGNAL: ${direction} ${pair} at ${currentPrice}`);
    
    res.json({
      pair: pair,
      signal: direction,
      entryPrice: currentPrice,
      stopLoss: stopLoss,
      takeProfit: takeProfit,
      confidence: score / 100,
      score: Math.round(score),
      broker: "Headway",
      account: "3676615",
      timestamp: new Date().toISOString()
    });
  } else {
    console.log(`❌ NO SIGNAL: ${pair} (Score: ${Math.round(score)}%)`);
    res.json({ 
      pair: pair, 
      signal: "HOLD",
      score: Math.round(score),
      timestamp: new Date().toISOString()
    });
  }
});

// TRADE LOGGING
app.post('/api/trade/log', (req, res) => {
  const trade = req.body;
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 TRADE EXECUTED - Headway Demo 3676615`);
  console.log('='.repeat(50));
  console.log(`📈 Pair: ${trade.pair}`);
  console.log(`🔄 Direction: ${trade.direction}`);
  console.log(`💰 Lot Size: ${trade.lotSize}`);
  console.log(`💵 Entry: ${trade.entryPrice}`);
  console.log(`🛑 SL: ${trade.stopLoss}`);
  console.log(`🎯 TP: ${trade.takeProfit}`);
  console.log(`📊 Confidence: ${trade.confidence}%`);
  console.log('='.repeat(50) + '\n');
  
  res.json({ 
    success: true, 
    message: "Trade logged",
    timestamp: new Date().toISOString()
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log('\n' + '╔════════════════════════════════════════════╗');
  console.log('║     ALPHA TRADING BOT - RUNNING              ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║  🏦 Broker: Headway                         ║`);
  console.log(`║  📊 Demo Account: 3676615                   ║`);
  console.log(`║  🚀 Port: ${PORT}                               ║`);
  console.log(`║  🌐 URL: http://localhost:${PORT}             ║`);
  console.log(`║  📈 Pairs: BTCUSD, XAUUSD, GBPUSD           ║`);
  console.log(`║  ✅ Root route: /                           ║`);
  console.log(`║  💚 Health: /health                         ║`);
  console.log(`║  🎯 Signal: /api/signal/BTCUSD              ║`);
  console.log('╚════════════════════════════════════════════╝\n');
});