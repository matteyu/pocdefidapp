import React from "react";
import {
  MetaMaskButton,
  useSDK,
} from "@metamask/sdk-react-ui";
import TokenBalances from './components/TokenBalances';
import CreateLoan from './components/CreateLoan';
import RepayLoan from './components/RepayLoan';
import OutstandingLoans from "./components/OutstandingLoans";

const App: React.FC = () => {
  const { connected, account } = useSDK();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DeFi DApp</h1>
      {(connected && account) ? (
        <div>
        <p className="mb-4">Connected Wallet: {account}</p>
        <TokenBalances walletAddress={account} />
        <CreateLoan walletAddress={account} />
        <RepayLoan walletAddress={account} />
        <OutstandingLoans walletAddress={account} />
      </div>
      ) : (
        <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
      )}
    </div>
  );
};

export default App;
