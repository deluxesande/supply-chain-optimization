import FabricCAServices from "fabric-ca-client";
import { Gateway, Wallets } from "fabric-network";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    try {
        // Load the network configuration
        const ccpPath = path.resolve(
            process.cwd(),
            "blockchain",
            "config",
            "connection.json"
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Check if certificateAuthorities is defined
        if (
            !ccp.certificateAuthorities ||
            !ccp.certificateAuthorities["ca.org1.example.com"]
        ) {
            throw new Error(
                "Certificate Authority configuration not found in connection.json"
            );
        }

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "blockchain", "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get("admin");
        if (identity) {
            res.status(200).json({
                message:
                    'An identity for the admin user "admin" already exists in the wallet',
            });
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({
            enrollmentID: "admin",
            enrollmentSecret: "adminpw",
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: "Org1MSP",
            type: "X.509",
        };
        await wallet.put("admin", x509Identity);

        res.status(200).json({
            message:
                'Successfully enrolled admin user "admin" and imported it into the wallet',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: `Failed to enroll admin user "admin": ${error.message}`,
        });
    }
}
