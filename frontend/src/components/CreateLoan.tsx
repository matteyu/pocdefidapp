import React, { useState } from 'react';
import { ethers } from 'ethers';
import LoanContractABI from '../contracts/LoanContractABI.json';

const LOAN_CONTRACT_ADDRESS = process.env.REACT_APP_LOAN_CONTRACT_ADDRESS || '';

interface CreateLoanProps {
  walletAddress: string | null;
}

const CreateLoan: React.FC<CreateLoanProps> = ({ walletAddress }) => {
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [loanAmount, setLoanAmount] = useState<string>("");

  const handleCreateLoan = async () => {
    if (!walletAddress) return;

    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
    const signer = provider.getSigner();
    const loanContract = new ethers.Contract(LOAN_CONTRACT_ADDRESS, LoanContractABI, signer);

    const tx = await loanContract.createLoan(nftAddress, tokenId, walletAddress, ethers.utils.parseUnits(loanAmount, 18));
    await tx.wait();
    console.log("Loan created successfully");
    window.location.reload()
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">Create Loan</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">NFT Address</label>
        <input
          type="text"
          value={nftAddress}
          onChange={(e) => setNftAddress(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Token ID</label>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Loan Amount (ERC20)</label>
        <input
          type="text"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleCreateLoan}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
      >
        Create Loan
      </button>
    </div>
  );
};

export default CreateLoan;
