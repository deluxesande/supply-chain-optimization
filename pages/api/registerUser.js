// pages/api/registerUser.js
import { Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    try {
        const ccpPath = path.resolve(process.cwd(), "connection.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
        const ca = new FabricCAServices(caURL);

        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const userExists = await wallet.get("appUser");
        if (userExists) {
            res.status(200).json({ message: "User already registered" });
            return;
        }

        const adminIdentity = await wallet.get("admin");
        if (!adminIdentity) {
            res.status(500).json({
                error: "Admin identity not found. Enroll admin first.",
            });
            return;
        }

        const provider = wallet
            .getProviderRegistry()
            .getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "admin");

        const secret = await ca.register(
            {
                affiliation: "org1.department1",
                enrollmentID: "appUser",
                role: "client",
            },
            adminUser
        );
        const enrollment = await ca.enroll({
            enrollmentID: "appUser",
            enrollmentSecret: secret,
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: "Org1MSP",
            type: "X.509",
        };
        await wallet.put("appUser", x509Identity);
        res.status(200).json({
            message: "User registered and enrolled successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: `Failed to register user: ${error.message}`,
        });
    }
}
