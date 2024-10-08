// pages/api/getAssetHistory.js
import { getAssetHistory } from "@/blockchain/utils/fabric";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;
        try {
            const history = await getAssetHistory(id);
            res.status(200).json(history);
        } catch (error) {
            console.error("Error getting asset history:", error);
            res.status(500).json({
                error: `Failed to get asset history: ${error.message}`,
            });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
