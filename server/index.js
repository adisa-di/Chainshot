const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const helper = require('./helper');


// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const balances = {};

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const {balance, privateKey} = balances[address] || 0;

  res.send({ balance, privateKey });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, privateKey} = req.body;

  if (!balances[sender]) {
    res.status(500).send({ error: "Sender does not exist"});
    return;
  }

  const {x, y} = balances[sender];
  const msg = {sender, recipient, amount};

  // sign message with private key
  const {message, signature} = helper.signMessage(privateKey, msg);
  const verify = helper.verifyMessage(signature, {x, y}, message);

  if (verify) {
    console.log('Transfering funds...');
    balances[sender].balance -= amount;
    balances[recipient].balance = (balances[recipient].balance || 0) + +amount;
    res.send({ balance: balances[sender].balance });
  } else {
    res.status(500).send({ err: "Could not verify sender"});
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  helper.generateKeysAndBalances(balances, process.env.accounts);
});
