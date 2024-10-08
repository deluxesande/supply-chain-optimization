import handler from "../transferAsset";
import * as fabricUtils from "../../../blockchain/utils/fabric";

jest.mock("../../../blockchain/utils/fabric", () => ({
    transferAsset: jest.fn(),
}));

describe("POST /api/transferAsset", () => {
    let consoleErrorSpy;

    beforeAll(() => {
        consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should transfer asset successfully", async () => {
        fabricUtils.transferAsset.mockResolvedValue();

        const req = {
            method: "POST",
            body: { id: "asset1", newOwner: "Org2" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Asset transferred successfully",
        });
    });

    it("should return 500 if transfer fails", async () => {
        fabricUtils.transferAsset.mockRejectedValue(
            new Error("Transfer failed")
        );

        const req = {
            method: "POST",
            body: { id: "asset1", newOwner: "Org2" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Failed to transfer asset: Transfer failed",
        });
    });

    it("should return 405 for non-POST methods", async () => {
        const req = { method: "GET" };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
    });
});
