import { v4 as uuidv4 } from 'uuid';
import * as escrowService from './escrowService';
import * as walletService from './walletService';
import logger from '../utils/logger';

/**
 * Initiate a loan request (lender locks funds for borrower).
 */
export const initiateLoanOffer = async (
    lenderUserId: string,
    amount: number,
    borrowerUserId: string
): Promise<string> => {
    const loanId = uuidv4();

    // 1. Get Lender and Escrow Wallets
    const lenderWallet = await walletService.getWalletByUserAndType(lenderUserId, 'personal');
    // Platform usually has a dedicated escrow wallet or user has one
    // For this MVP, we use the Platform Escrow wallet
    const platformEscrowWallet = await walletService.getWalletByUserAndType('platform_admin_id', 'escrow');

    if (!lenderWallet || !platformEscrowWallet) throw new Error('Wallets not found');

    // 2. Lock funds
    await escrowService.lockFunds(
        lenderWallet.id,
        platformEscrowWallet.id,
        amount,
        'Loan Offer',
        loanId
    );

    logger.info(`Loan offer initiated: ${loanId} | Lender: ${lenderUserId} | Amount: ${amount}`);
    return loanId;
};

/**
 * Complete loan disbursement (Move from escrow to borrower).
 */
export const disburseLoan = async (
    loanId: string,
    borrowerUserId: string,
    escrowWalletId: string
): Promise<string> => {
    const borrowerWallet = await walletService.getWalletByUserAndType(borrowerUserId, 'personal');
    if (!borrowerWallet) throw new Error('Borrower wallet not found');

    // Find amount from escrow records (internal helper or direct query)
    // For simplicity, we assume release is called with correct params

    // Release
    return await escrowService.releaseFunds(
        escrowWalletId,
        borrowerWallet.id,
        0, // Amount should be fetched from DB in production
        loanId
    );
};
