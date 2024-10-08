// pages/api/createAsset.js
import { createAsset } from "../../blockchain/utils/fabric";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id, name, owner } = req.body;
        try {
            await createAsset(id, name, owner);
            res.status(200).json({ message: "Asset created successfully" });
        } catch (error) {
            console.error("Error creating asset:", error);
            res.status(500).json({
                error: `Failed to create asset: ${error.message}`,
            });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
