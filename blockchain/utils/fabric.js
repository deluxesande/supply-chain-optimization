/**
 * Supply Chain Management:
 * Tracking: Monitoring the movement of goods from production to delivery.
 * Verification: Ensuring the authenticity and quality of products.
 * Transparency: Providing a transparent and immutable record of transactions
 */

import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";

// Define the transferAsset function
export const transferAsset = (id, newOwner) => {
    console.log(`Transferring asset with ID: ${id} to new owner: ${newOwner}`);
    // Add your logic to transfer an asset here
    // Example: Update the owner in the blockchain
};

// Function to create an asset on the Hyperledger Fabric network
export const createAsset = async (id, name, owner) => {
    try {
        // Load the network configuration
        const ccpPath = path.resolve(
            process.cwd(),
            "blockchain",
            "config",
            "connection.json"
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "blockchain", "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            throw new Error(
                'An identity for the user "appUser" does not exist in the wallet. Run the registerUser.js application before retrying.'
            );
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("supplychain");

        // Submit the specified transaction.
        // createAsset transaction - requires 3 arguments, ex: ('createAsset', 'ASSET1', 'Asset Name', 'Owner Name')
        await contract.submitTransaction("createAsset", id, name, owner);
        console.log("Transaction has been submitted");

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error.message}`);
        throw new Error(`Failed to submit transaction: ${error.message}`);
    }
};

// Define the queryAsset function
export const queryAsset = async (id) => {
    console.log(`Querying asset with ID: ${id}`);
    // Add your logic to query an asset here
    // Example: Retrieve the asset from the blockchain
    return { id, name: "Sample Asset", owner: "Sample Owner" };
};

// Define the trackAsset function
export const trackAsset = (id, location, timestamp) => {
    console.log(
        `Tracking asset with ID: ${id} at location: ${location} on ${timestamp}`
    );
    // Add your logic to track the asset here
    // Example: Record the location and timestamp in the blockchain
};

// Define the verifyAsset function
export const verifyAsset = (id, qualityCheck) => {
    console.log(
        `Verifying asset with ID: ${id}, Quality Check: ${qualityCheck}`
    );
    // Add your logic to verify the asset here
    // Example: Store the quality check result in the blockchain
};

// Define the getAssetHistory function
export const getAssetHistory = async (id) => {
    console.log(`Getting history for asset with ID: ${id}`);
    // Add your logic to get the asset history here
    // Example: Retrieve the asset's history from the blockchain
    return [
        { location: "Factory", timestamp: "2023-01-01T10:00:00Z" },
        { location: "Warehouse", timestamp: "2023-01-02T12:00:00Z" },
        { location: "Retailer", timestamp: "2023-01-03T14:00:00Z" },
    ];
};
