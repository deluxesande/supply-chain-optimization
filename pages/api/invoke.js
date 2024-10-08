// pages/api/invoke.js
import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    try {
        const ccpPath = path.resolve(process.cwd(), "connection.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get("appUser");
        if (!identity) {
            res.status(500).json({
                error: "User identity not found. Register user first.",
            });
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        const network = await gateway.getNetwork("mychannel");
        const contract = network.getContract("mycontract");

        const result = await contract.evaluateTransaction("queryAllCars");
        await gateway.disconnect();

        res.status(200).json({ result: result.toString() });
    } catch (error) {
        res.status(500).json({
            error: `Failed to evaluate transaction: ${error.message}`,
        });
    }
}
