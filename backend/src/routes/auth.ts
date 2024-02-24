import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { Application, Request, Response } from "express";

import { sign } from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const BCRYPT_SALT_ROUNDS = 12;

module.exports = (app: Application, prisma: PrismaClient) => {
  app.post(
    "/auth/register",
    [
      body("nip")
        .isInt()
        .isLength({ min: 10, max: 10 })
        .withMessage("Numer NIP musi składać się z 10 cyfr."),
      body("email").isEmail().withMessage("Email is not valid"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    ],
    async (req: Request, res: Response) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nip, email, password } = req.body;

      try {
        const existingUser = await prisma.accounts.findFirst({
          where: {
            OR: [{ nip }, { email }],
          },
        });

        if (existingUser) {
          return res.status(409).json({
            message: "User with the same NIP or email already exists",
          });
        }

        const hashedPassword = await hash(password, BCRYPT_SALT_ROUNDS);

        const newUser = await prisma.accounts.create({
          data: {
            email,
            password: hashedPassword,
            nip,
            role: "admin",
          },
        });

        res
          .status(201)
          .json({ message: "User registered successfully", user: newUser });
      } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  );

  app.post(
    "/auth/login",
    [
      body("email").isEmail().withMessage("Email is not valid"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
        const user = await prisma.accounts.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const accessToken = sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_KEY_JWT as string,
          { expiresIn: "30d" } // 30 days
        );

        // Generate Refresh Token
        const refreshToken = sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_KEY_JWT as string,
          { expiresIn: "365d" } // 1 year
        );

        // You can store refreshToken in your DB if you want to manage logout/refresh
        await prisma.accounts.update({
          where: { id: user.id },
          data: { refresh_token: refreshToken },
        });

        res.status(200).json({ accessToken, refreshToken });
      } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  );
};
