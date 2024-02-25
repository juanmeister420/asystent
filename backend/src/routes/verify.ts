import { PrismaClient } from "@prisma/client";

import { Application, Request, Response } from "express";

import { sign, verify } from "jsonwebtoken";

interface decodedToken {
  id: string;
  iat: number;
  exp: number;
}

module.exports = (app: Application, prisma: PrismaClient) => {
  app.get("/auth/verify", async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    try {
      const decoded = verify(token, process.env.SECRET_KEY_JWT as string, {
        ignoreExpiration: true,
      }) as decodedToken;

      if (!decoded) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      if (decoded.exp < Date.now() / 1000) {
        console.log("Token expired");
      }

      const user = await prisma.accounts.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "No user Found" });
      }
      console.log({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      return res.status(200).json({
        message: "Authorized",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token is not valid" });
      }

      return res.status(500).json({ message: "There's an error" });
    }
  });
};
