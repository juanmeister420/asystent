import { Application, Request, Response } from "express";
import { readFileSync } from "fs";
import path from "path";
module.exports = (app: Application) => {
  app.get("/serwisy/list", async (req: Request, res: Response) => {
    // TODO ADD AUTH

    try {
      const serwisy = readFileSync(
        path.join(__dirname, "../mock_data.json"),
        "utf-8"
      );
      res.status(200).json(JSON.parse(serwisy).partners);
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};
