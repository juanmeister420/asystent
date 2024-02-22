import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import { compare, hash } from "bcrypt";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { sign } from "jsonwebtoken";

const BCRYPT_SALT_ROUNDS = 10;

module.exports = (app: Application, prisma: PrismaClient) => {
  app.post("/auth/register", async (req, res) => {
    const { email, password, nip } = req.body;

    try {
      // Hash the password
      const hashedPassword = await hash(password, BCRYPT_SALT_ROUNDS);

      // Create new account in the database
      const newAccount = await prisma.accounts.create({
        data: {
          email,
          password: hashedPassword,
          nip,
          role: "admin",
        },
      });

      // Respond with created account (excluding password)
      res.json({
        id: newAccount.id,
        email: newAccount.email,
        nip: newAccount.nip,
        creation_date: newAccount.creation_date,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find account by email
      const account = await prisma.accounts.findUnique({
        where: { email },
      });

      if (!account) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Compare password
      const passwordMatch = await compare(password, account.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Create JWT token
      const refreshToken = await sign(
        { id: account.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "365d",
        }
      );

      await prisma.accounts.update({
        where: { id: account.id },
        data: {
          refresh_token: refreshToken,
        },
      });

      const token = await sign(
        { id: account.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "7d",
        }
      );

      // Respond with token
      res.json({ token, refreshToken });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
