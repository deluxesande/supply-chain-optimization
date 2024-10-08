// pages/api/queryAsset.js
import { queryAsset } from "@/blockchain/utils/fabric"; // Ensure this matches your export

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;
        try {
            const asset = await queryAsset(id);
            res.status(200).json(asset);
        } catch (error) {
            console.error("Error querying asset:", error);
            res.status(500).json({
                error: `Failed to query asset: ${error.message}`,
            });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
