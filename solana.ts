const {PublicKey, Connection, clusterApiUrl, LAMPORTS_PER_SOL} = require("@solana/web3.js");
import {sendAndConfirmTransaction, Signer, SystemProgram, Transaction} from "@solana/web3.js";

export const transferSOL: (to: Signer, from: Signer, amount: number) => Promise<string | undefined> = async (to, from, amount) => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const transaction = new Transaction().add(SystemProgram.transfer({
            fromPubkey: new PublicKey(from.publicKey.toString()),
            lamports: LAMPORTS_PER_SOL * amount,
            programId: undefined,
            seed: "",
            toPubkey: new PublicKey(to.publicKey.toString())
        }));
        return await sendAndConfirmTransaction(connection, transaction, [from]);
    } catch (er) {
        console.log(er);
    }
};

export const getWalletBalance: (myWallet: Signer) => Promise<number | undefined> = async (myWallet) => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletBal = await connection.getBalance(new PublicKey(myWallet.publicKey));
        return walletBal / LAMPORTS_PER_SOL;
    } catch (er) {
        console.log(er);
    }
};

export const airDropSol: (myWallet: Signer, amt: number) => any = async (myWallet, amt) => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        console.log('======AIRDROPPING 2 SOL======');
        const fromAirDropSignature = await connection.requestAirdrop(new PublicKey(myWallet.publicKey), amt * LAMPORTS_PER_SOL);
        return await connection.confirmTransaction(fromAirDropSignature);
    } catch (er) {
        console.log(er);
    }
};
