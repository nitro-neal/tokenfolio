import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
const bridge = "https://wallet-bridge.binance.org";

// Documentation for binance transcations - https://docs.binance.org/encoding.html
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

    // console log the uri for development
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

    console.log(payload.params[0]);
    onConnectedCallback(payload.params[0]);
    // this.onConnect(payload);
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

  // this.setState({ walletConnector });
}

// const INITIAL_STATE = {
//   walletConnector: null,
//   fetching: false,
//   connected: false,
//   chainId: 1,
//   showModal: false,
//   pendingRequest: false,
//   uri: "",
//   accounts: [],
//   address: "",
//   result: null,
//   assets: []
// };

// class WalletConnectHelper extends Component {
//   state = { ...INITIAL_STATE };

//   //   componentDidMount = () => {
//   //     console.log("componend did mount wallet connect");

//   //     this.walletConnectInit(true);
//   //   };
//   //   constructor(props) {
//   //     super(props);

//   //   }

//   walletConnectInit = async reset => {
//     // bridge url
//     // const bridge = "https://bridge.walletconnect.org";
//     const bridge = "https://wallet-bridge.binance.org";

//     // create new walletConnector
//     const walletConnector = new WalletConnect({ bridge });

//     window.walletConnector = walletConnector;

//     // await this.setState({ walletConnector });
//     this.state.walletConnector = walletConnector;

//     if (reset) {
//       walletConnector.killSession();
//     }

//     // check if already connected
//     if (!walletConnector.connected) {
//       console.log("not connected");
//       // create new session
//       await walletConnector.createSession();

//       // get uri for QR Code modal
//       const uri = walletConnector.uri;

//       // console log the uri for development
//       console.log(uri); // tslint:disable-line

//       // display QR Code modal
//       WalletConnectQRCodeModal.open(uri, () => {
//         console.log("QR Code Modal closed"); // tslint:disable-line
//       });
//     }
//     // subscribe to events
//     await this.subscribeToEvents();
//   };

//   subscribeToEvents = () => {
//     const { walletConnector } = this.state;

//     if (!walletConnector) {
//       return;
//     }

//     walletConnector.on("session_update", async (error, payload) => {
//       console.log('walletConnector.on("session_update")'); // tslint:disable-line

//       if (error) {
//         throw error;
//       }

//       const { chainId, accounts } = payload.params[0];
//       this.onSessionUpdate(accounts, chainId);
//     });

//     walletConnector.on("connect", (error, payload) => {
//       console.log('walletConnector.on("connect")'); // tslint:disable-line

//       if (error) {
//         throw error;
//       }

//       this.onConnect(payload);
//     });

//     walletConnector.on("disconnect", (error, payload) => {
//       console.log('walletConnector.on("disconnect")'); // tslint:disable-line

//       if (error) {
//         throw error;
//       }

//       this.onDisconnect();
//     });

//     if (walletConnector.connected) {
//       const { chainId, accounts } = walletConnector;
//       const address = accounts[0];
//       //   this.setState({
//       //     connected: true,
//       //     chainId,
//       //     accounts,
//       //     address
//       //   });
//     }

//     // this.setState({ walletConnector });
//   };

//   killSession = async () => {
//     const { walletConnector } = this.state;
//     if (walletConnector) {
//       walletConnector.killSession();
//     }
//     this.resetApp();
//   };

//   resetApp = async () => {
//     // await this.setState({ ...INITIAL_STATE });
//   };

//   onConnect = async payload => {
//     console.log(payload.params[0]);
//     const { chainId, accounts } = payload.params[0];
//     const address = accounts[0];
//     // await this.setState({
//     //   connected: true,
//     //   chainId,
//     //   accounts,
//     //   address
//     // });
//     let wcstate = {
//       connected: true,
//       chainId,
//       accounts,
//       address
//     };
//     WalletConnectQRCodeModal.close();
//     this.props.walletConnectConnected(wcstate);
//     // this.getAccountAssets();
//   };

//   onDisconnect = async () => {
//     WalletConnectQRCodeModal.close();
//     this.resetApp();
//   };

//   onSessionUpdate = async (accounts, chainId) => {
//     const address = accounts[0];
//     // await this.setState({ chainId, accounts, address });
//     // await this.getAccountAssets();
//   };

//   //    getAccountAssets = async () => {
//   //     const { address, chainId } = this.state;
//   //     this.setState({ fetching: true });
//   //     try {
//   //       // get account balances
//   //       const assets = await apiGetAccountAssets(address, chainId);

//   //       await this.setState({ fetching: false, address, assets });
//   //     } catch (error) {
//   //       console.error(error); // tslint:disable-line
//   //       await this.setState({ fetching: false });
//   //     }
//   //   };

//   render() {
//     return <div>Wallet Connect Helper</div>;
//   }
// }

// export default WalletConnectHelper;
