// pages/api/trackAsset.js
import { trackAsset } from "@/blockchain/utils/fabric";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id, location, timestamp } = req.body;
        try {
            await trackAsset(id, location, timestamp);
            res.status(200).json({ message: "Asset tracked successfully" });
        } catch (error) {
            console.error("Error tracking asset:", error);
            res.status(500).json({
                error: `Failed to track asset: ${error.message}`,
            });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
