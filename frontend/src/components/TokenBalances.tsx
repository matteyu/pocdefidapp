import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ERC721TokenABI from '../contracts/ERC721TokenABI.json';
import ERC20TokenABI from '../contracts/ERC20TokenABI.json';

const ERC20_CONTRACT_ADDRESS = process.env.REACT_APP_ERC20_CONTRACT_ADDRESS || '';
const ERC721_CONTRACT_ADDRESS = process.env.REACT_APP_ERC721_CONTRACT_ADDRESS || '';

interface TokenBalancesProps {
  walletAddress: string | null;
}

const TokenBalances: React.FC<TokenBalancesProps> = ({ walletAddress }) => {
  const [erc721Tokens, setErc721Tokens] = useState<string[]>([]);
  const [erc20Balance, setErc20Balance] = useState<string>("");

  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (!walletAddress) return;
      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const erc721Contract = new ethers.Contract(ERC721_CONTRACT_ADDRESS, ERC721TokenABI, provider);
      const erc20Contract = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20TokenABI, provider);

      // Fetch ERC721 Tokens
      const totalSupply = await erc721Contract.nextTokenId();
      const tokens = [];
      for (let i = 0; i < totalSupply; i++) {
        const owner = await erc721Contract.ownerOf(i);
        if (owner.toLowerCase() === walletAddress.toLowerCase()) {
          const tokenURI = await erc721Contract.tokenURI(i);
          tokens.push(tokenURI);
        }
      }
      setErc721Tokens(tokens);

      // Fetch ERC20 Token Balance
      const balance = await erc20Contract.balanceOf(walletAddress);
      setErc20Balance(ethers.utils.formatUnits(balance, 18));
    };

    fetchTokenBalances();
  }, [walletAddress]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">Token Balances</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">ERC721 Tokens:</h3>
        <ul className="list-disc list-inside">
          {erc721Tokens.length > 0 ? (
            erc721Tokens.map((tokenURI, index) => (
              <li key={index}>{tokenURI}</li>
            ))
          ) : (
            <li>No ERC721 tokens found</li>
          )}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold">ERC20 Token Balance:</h3>
        <p>{erc20Balance} ERC20 Tokens</p>
      </div>
    </div>
  );
};

export default TokenBalances;
