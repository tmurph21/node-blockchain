// PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
const Blockchain = require('./../blockchain');
const P2pServer = require('./p2p-server');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains(); // syncs all websockets
  res.redirect('/blocks');
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

p2pServer.listen();
