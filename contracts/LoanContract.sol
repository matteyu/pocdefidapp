// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract LoanContract is ERC721Holder, Ownable(msg.sender) {
    struct Loan {
        uint256 id;
        address nftAddress;
        uint256 tokenId;
        address borrowerAddress;
        uint256 amount;
        bool isRepaid;
    }

    mapping(address => Loan[]) public loans;

    uint256 private nextLoanId;

    // Event to track loan creation
    event LoanCreated(uint256 indexed id, address indexed nftAddress, uint256 indexed tokenId, address borrowerAddress, uint256 amount);

    // Function to create a new loan
    function createLoan(address _nftAddress, uint256 _tokenId, address _borrowerAddress, uint256 _amount) external {
        // Ensure the caller is the owner of the NFT
        require(
            IERC721(_nftAddress).ownerOf(_tokenId) == msg.sender,
            "LoanContract: Caller is not the owner of the NFT"
        );

        // Transfer the NFT to the contract
        IERC721(_nftAddress).safeTransferFrom(msg.sender, address(this), _tokenId);

        // Increment the loan ID
        uint256 loanId = nextLoanId++;

        // Add the loan to the mapping
        loans[_borrowerAddress].push(Loan(loanId, _nftAddress, _tokenId, _borrowerAddress, _amount, false));

        // Emit an event
        emit LoanCreated(loanId, _nftAddress, _tokenId, _borrowerAddress, _amount);
    }

    // Function to repay a loan
    function repayLoan(uint256 _loanId, address _paymentTokenAddress) external {
        Loan storage loan = loans[msg.sender][_loanId];

        // Ensure the loan exists and is not repaid
        require(loan.id == _loanId, "LoanContract: Loan does not exist");
        require(!loan.isRepaid, "LoanContract: Loan is already repaid");

        // Transfer the payment token to the contract
        uint256 loanAmount = loan.amount;
        IERC20(_paymentTokenAddress).transferFrom(msg.sender, address(this), loanAmount);

        // Transfer the NFT back to the borrower
        IERC721(loan.nftAddress).safeTransferFrom(address(this), loan.borrowerAddress, loan.tokenId);

        // Mark the loan as repaid
        loan.isRepaid = true;
    }

    // Function to get the total number of loans associated with an address
    function getLoansCount(address _borrowerAddress) external view returns (uint256) {
        return loans[_borrowerAddress].length;
    }
}
