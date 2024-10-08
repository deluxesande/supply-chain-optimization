// pages/api/verifyAsset.js
import { verifyAsset } from "@/blockchain/utils/fabric";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id, qualityCheck } = req.body;
        try {
            await verifyAsset(id, qualityCheck);
            res.status(200).json({ message: "Asset verified successfully" });
        } catch (error) {
            console.error("Error verifying asset:", error);
            res.status(500).json({
                error: `Failed to verify asset: ${error.message}`,
            });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
