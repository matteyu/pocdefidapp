import React, { useState } from "react";
import { ethers } from "ethers";
import LoanContractABI from "../contracts/LoanContractABI.json";
import ERC20TokenABI from '../contracts/ERC20TokenABI.json';

const LOAN_CONTRACT_ADDRESS = process.env.REACT_APP_LOAN_CONTRACT_ADDRESS || "";
const ERC20_CONTRACT_ADDRESS =
  process.env.REACT_APP_ERC20_CONTRACT_ADDRESS || "";

interface RepayLoanProps {
  walletAddress: string | null;
}

const RepayLoan: React.FC<RepayLoanProps> = ({ walletAddress }) => {
  const [loanId, setLoanId] = useState<string>("");

  const handleRepayLoan = async () => {
    if (!walletAddress) return;

    const provider = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_RPC_URL
    );
    const signer = provider.getSigner();
    const loanContract = new ethers.Contract(
      LOAN_CONTRACT_ADDRESS,
      LoanContractABI,
      signer
    );

    const erc20Contract = new ethers.Contract(
      ERC20_CONTRACT_ADDRESS,
      ERC20TokenABI,
      signer
    );
    const loansCount = await loanContract.getLoansCount(walletAddress);
    for (let i = 0; i < loansCount; i++) {
      const loan = await loanContract.loans(walletAddress, i);
      if (loan.id.toString() === loanId) {
        const allowance = await erc20Contract.allowance(walletAddress, LOAN_CONTRACT_ADDRESS);
        const requiredAmount = loan.amount;
    
        if (allowance.lt(requiredAmount)) {
          const txApprove = await erc20Contract.approve(LOAN_CONTRACT_ADDRESS, requiredAmount);
          await txApprove.wait();
        }

        const txRepay = await loanContract.repayLoan(
          loanId,
          ERC20_CONTRACT_ADDRESS
        );
        await txRepay.wait();
        console.log("Loan repaid successfully");
        window.location.reload()
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">Repay Loan</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Loan ID
        </label>
        <input
          type="text"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          className="mt-1
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleRepayLoan}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
      >
        Repay Loan
      </button>
    </div>
  );
};

export default RepayLoan;
