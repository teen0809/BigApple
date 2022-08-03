import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Web3 from "web3";

import { EthereumContext } from "context/EthereumContext";
import LandingPage from "pages/landing";

import "assets/css/App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [provider, setProvider] = useState<any>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAcc, setCurrentAcc] = useState("");

  useEffect(() => {
    const { ethereum }: any = window;

    if (ethereum && ethereum.isMetaMask) {
      setProvider(ethereum);
      setWeb3(new Web3(ethereum));
      ethereum.on("accountsChanged", (accs: any) => {
        setAccounts(accs);
        setCurrentAcc(accs[0]);
      });
      ethereum.on("chainChanged", (chainId: string) => {
        if (chainId === "0x1") {
          toast("Ethereum mainnet connected successfully");
        } else {
          toast.error("Please connect to Ethereum Mainnet", {
            theme: "dark",
          });
        }
      });
    } else {
      toast.error("Please install Metamask wallet in this browser", {
        theme: "dark",
      });
    }
  }, []);

  useEffect(() => {
    const setCurrentlyConnectedAccount = async () => {
      let accounts = await web3.eth.getAccounts();
      if (accounts && accounts.length > 0) {
        setCurrentAcc(accounts[0]);
      }
    };
    if (web3) {
      setCurrentlyConnectedAccount();
    }
  }, [web3]);

  return (
    <>
      {" "}
      <EthereumContext.Provider
        value={{ provider, accounts, web3, currentAcc }}
      >
        <Router>
          <Route exact path="/" component={LandingPage} />
        </Router>
      </EthereumContext.Provider>
      <ToastContainer />
    </>
  );
}

export default App;
