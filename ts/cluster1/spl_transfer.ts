import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("5srf9KVMZkRgoLmAxJfJJ7qPtEpihGBaawkneqRecycR");

// Recipient address
const to = new PublicKey("4J7kYZUjgWz4r1TA82tYup8xxrvqRBXuvWyhEPdN1pfa");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        let fromAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
        let toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(connection, keypair, fromAta.address, toAta.address, keypair, 1e7);
        //const signature = tx.send
        console.log("Your tx is: {} ", tx);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();