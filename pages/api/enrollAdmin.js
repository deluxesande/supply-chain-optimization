// pages/api/enrollAdmin.js
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

        const adminExists = await wallet.get("admin");
        if (adminExists) {
            res.status(200).json({ message: "Admin already enrolled" });
            return;
        }

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
        res.status(200).json({ message: "Admin enrolled successfully" });
    } catch (error) {
        res.status(500).json({
            error: `Failed to enroll admin: ${error.message}`,
        });
    }
}
