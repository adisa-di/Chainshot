import "./index.scss";


/**
 * Key class used to store private key, sender pair from the server
 */
class PrivateKey {
  constructor() {
    this.sender = "";
    this.private = "";
  }

  setSender(sender) {
    this.sender = sender;
  }

  setPrivateKey(key) {
    this.private = key;
  }

  getKeyFromSender(sender) {
    if (sender === this.sender) return this.private;
  }
}

const server = "http://localhost:3042";
const key = new PrivateKey();

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then((res) => {

    const {balance, privateKey} = res;
    if (!balance) {
      document.getElementById("balance").innerHTML = 0;
      return;
    }

    key.setSender(value);
    key.setPrivateKey(privateKey);

    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  const privateKey = key.getKeyFromSender(sender);


  const body = JSON.stringify({
    sender, amount, recipient, privateKey
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  }).catch(error => {
    console.log(error);
  }) 
});
