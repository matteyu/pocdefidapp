import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import LoanContractABI from '../contracts/LoanContractABI.json';

const LOAN_CONTRACT_ADDRESS = process.env.REACT_APP_LOAN_CONTRACT_ADDRESS || '';

interface Loan {
  id: number;
  nftAddress: string;
  tokenId: number;
  borrowerAddress: string;
  amount: string;
  isRepaid: boolean;
}

interface OutstandingLoansProps {
  walletAddress: string | null;
}

const OutstandingLoans: React.FC<OutstandingLoansProps> = ({ walletAddress }) => {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!walletAddress) return;

      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const loanContract = new ethers.Contract(LOAN_CONTRACT_ADDRESS, LoanContractABI, provider);

      // Fetch all outstanding loans associated with the wallet address
      const loansCount = await loanContract.getLoansCount(walletAddress);
      const loansData = [];
      for (let i = 0; i < loansCount; i++) {
        const loan = await loanContract.loans(walletAddress, i);
        loansData.push({
          id: Number(loan.id),
          nftAddress: loan.nftAddress,
          tokenId: Number(loan.tokenId),
          borrowerAddress: loan.borrowerAddress,
          amount: ethers.utils.formatUnits(loan.amount, 18),
          isRepaid: loan.isRepaid
        });
      }
      setLoans(loansData);
    };

    fetchLoans();
  }, [walletAddress]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">Outstanding Loans</h2>
      {loans.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NFT Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrower Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{loan.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{loan.nftAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap">{loan.tokenId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{loan.borrowerAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap">{loan.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{loan.isRepaid ? "Repaid" : "Outstanding"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No outstanding loans found</p>
      )}
    </div>
  );
};

export default OutstandingLoans;
