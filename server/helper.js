// keys & hashing
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const verifyMessage = (signature, publicKey, msg) => {
  const key = ec.keyFromPublic(publicKey, 'hex');
  const msgHash = SHA256(msg).toString();
  return key.verify(msgHash, signature)
}

const signMessage = (privateKey, message) => {
  // private key of sender
  const key = ec.keyFromPrivate(privateKey);
  const msgHash = SHA256(message);
  const signature = key.sign(msgHash.toString());

  return ({
    message,
    signature: {
      r: signature.r.toString(16),
      s: signature.s.toString(16)
    }
  });
}

const generateKeysAndBalances = (balances, accounts) => {

  for (let i = 0; i < accounts; i++) {
    // get keys
    const keyPair = ec.genKeyPair();

    // gen keys
    const x = keyPair.getPublic().x.toString(16);
    const y = keyPair.getPublic().y.toString(16);
    const privateKey = keyPair.getPrivate().toString(16);
    const publicKey = keyPair.getPublic().encode('hex');

    // get account address
    const address = publicKey.substring(0, publicKey.length - 80);

    balances[address] = {
      balance: Math.floor(Math.random() * 300),
      x,
      y,
      privateKey,
      publicKey
    };
  }

  console.log("\n------- Accounts -------\n")
  for (const address in balances) {
    const {balance} = balances[address];
    console.log(`Account: ${address}, Balance: ${balance} ETH`);
  }
}

module.exports.generateKeysAndBalances = generateKeysAndBalances;
module.exports.signMessage = signMessage;
module.exports.verifyMessage = verifyMessage;