import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import { readdirSync } from "fs";
import helmet from "helmet";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(helmet());

readdirSync(`${__dirname}/routes`).map(async (file) => {
  if (file.endsWith(".ts")) {
    await console.log(`Loading route: ${file}`);
    (await import(`./routes/${file}`)).default(app, prisma);
  }
});

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
