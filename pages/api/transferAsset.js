// pages/api/transferAsset.js
import { transferAsset } from "../../blockchain/utils/fabric";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id, newOwner } = req.body;
        try {
            await transferAsset(id, newOwner);
            res.status(200).json({ message: "Asset transferred successfully" });
        } catch (error) {
            console.error("Error transferring asset:", error);
            res.status(500).json({
                error: `Failed to transfer asset: ${error.message}`,
            });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
