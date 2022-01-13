import { Keypair } from '@solana/web3.js';
import * as readline from 'readline-sync';
import { getReturnAmount, randomNumber, totalAmtToBePaid } from './helper';
import { airDropSol, getWalletBalance, transferSOL } from "./solana";

const [MIN, MAX] = [1, 5];

async function playGame() {
    console.log('----------------------SOL STAKE----------------------');
    console.log('------------Max. stake allowed is 2.5 SOL------------');
    console.log('------------Min stake allowed is 0.001 SOL-----------\n');

    try {
        const treasury = new Keypair();
        const player = new Keypair();

        console.log(await airDropSol(player, 2));
        let playerBal = await getWalletBalance(player);

        if (playerBal !== undefined) {
            console.log(`\nPlayer Wallet address = ${player.publicKey.toString()}`);
            console.log(`Player Wallet Balance: ${playerBal}`);

            const amt = parseFloat(readline.question("What is the amount in SOL you would like to stake: "));
            if (amt <= 2.5 && amt >= 0.001 && amt <= playerBal) {
                const ratioString = readline.question("What is ratio of your staking? ").split(':');
                const ratio = (parseFloat(ratioString[1]) / parseFloat(ratioString[0]));

                console.log(await airDropSol(treasury, 2));

                console.log(`You will have to pay ${totalAmtToBePaid(amt)} to proceed forward.`);
                console.log(`You will get ${getReturnAmount(amt, ratio)} if your guess is correct.`);

                const paymentSig = await transferSOL(treasury, player, totalAmtToBePaid(amt));
                console.log(`Signature of payment is: ${paymentSig}`);

                const randInt = randomNumber(MIN, MAX);
                console.log(`\n----------------Number is: ${randInt}----------------\n`);
                const guess = parseInt(readline.question(`Guess a random number between ${MIN} ans ${MAX} both inclusive: `));

                if (guess === randInt) {
                    console.log(`You Win.`);
                    const priceSig = await transferSOL(player, treasury, getReturnAmount(amt, ratio));
                    console.log(`Price signature is: ${priceSig}`);
                    playerBal = await getWalletBalance(player);
                    console.log(`\nPlayer Wallet address = ${player.publicKey.toString()}`);
                    console.log(`Player Wallet Balance: ${playerBal}`);
                } else {
                    console.log(`You loose.`);
                }
            } else {
                console.log('Max stake is 2.5 SOL.');
            }
        } else {
            console.log("Something went wrong :(");
        }
    } catch (er) {
        console.log(er);
    }
}

playGame().catch(console.log);