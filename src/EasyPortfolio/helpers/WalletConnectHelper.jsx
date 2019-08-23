import WalletConnect from "@trustwallet/walletconnect";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { crypto } from "@binance-chain/javascript-sdk";
const bridge = "https://wallet-bridge.binance.org";

// Documentation for binance transcations - https://docs.binance.org/encoding.html
// Wallet connect https://gitlab.com/canyacoin/binancechain/beptools/blob/master/src/components/pages/Wallet/walletConnect.js
export function isWalletConnected() {
  const walletConnector = new WalletConnect({ bridge });
  window.walletConnector = walletConnector;

  return walletConnector.connected;
}

export async function walletConnectInit(onConnectedCallback) {
  const walletConnector = new WalletConnect({ bridge });
  window.walletConnector = walletConnector;

  // check if already connected
  if (!walletConnector.connected) {
    console.log("not connected");
    await walletConnector.createSession();
    const uri = walletConnector.uri;

    console.log(uri); // tslint:disable-line

    // display QR Code modal
    WalletConnectQRCodeModal.open(uri, () => {
      console.log("QR Code Modal closed"); // tslint:disable-line
    });
  }

  // subscribe to events
  await subscribeToEvents(walletConnector, onConnectedCallback);

  return walletConnector;
}

function subscribeToEvents(walletConnector, onConnectedCallback) {
  walletConnector.on("session_update", async (error, payload) => {
    console.log('walletConnector.on("session_update")'); // tslint:disable-line

    if (error) {
      throw error;
    }

    const { chainId, accounts } = payload.params[0];
    // this.onSessionUpdate(accounts, chainId);
  });

  walletConnector.on("connect", (error, payload) => {
    console.log('walletConnector.on("connect")'); // tslint:disable-line

    if (error) {
      throw error;
    }

    walletConnector
      .getAccounts()
      .then(result => {
        // Returns the accounts
        const account = result.find(account => account.network === 714);
        console.log("ACCOUNT:", account);
        console.log("WALLET CONNECT ACCOUNTS RESULTS " + account.address);
        console.log("ADDR:", crypto.decodeAddress(account.address));

        onConnectedCallback(payload.params[0]);
      })
      .catch(error => {
        // Error returned when rejected
        console.error(error);
      });

    console.log(payload.params[0]);
  });

  walletConnector.on("disconnect", (error, payload) => {
    console.log('walletConnector.on("disconnect")'); // tslint:disable-line

    if (error) {
      throw error;
    }

    WalletConnectQRCodeModal.close();
    // this.onDisconnect();
  });

  if (walletConnector.connected) {
    const { chainId, accounts } = walletConnector;
    const address = accounts[0];

    // return walletConnect
  }
}
