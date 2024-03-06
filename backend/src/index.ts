import express from "express";
import { readdirSync } from "fs";
import helmet from "helmet";
import cors from "cors";

import prisma from "./prisma_connector";

import { writeFile, readFile } from "fs/promises";
import { fakerPL as faker } from "@faker-js/faker";
import { join } from "path";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

const generateMockPartners = async (numOfEntries: number) => {
  try {
    // Read the current mock_data.json file
    const data = JSON.parse(
      await readFile(join(__dirname, "mock_data.json"), "utf8")
    );

    // Generate mock data for partners
    const mockPartners = [];
    for (let i = 0; i < numOfEntries; i++) {
      mockPartners.push({
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        nip: faker.number.int({ min: 1000000000, max: 9999999999 }),
        phone: faker.phone.number(),
        address: `${faker.location.streetAddress()}, ${faker.location.zipCode()} ${faker.location.city()}`,
        bank_account: faker.finance.iban(),
        status: faker.helpers.arrayElement(["active", "pending", "blocked"]),
        created_at: faker.date.past().toISOString(),
        total_shop: faker.number.int({ min: 1, max: 1000 }),
        total_customer: faker.number.int({ min: 1, max: 10000 }),
        total_profit: faker.number.int({ min: 1000, max: 1000000 }),
        total_shop_month: faker.number.int({ min: 1, max: 100 }),
        total_customer_month: faker.number.int({ min: 1, max: 1000 }),
        total_profit_month: faker.number.int({ min: 100, max: 10000 }),
        total_shop_today: faker.number.int({ min: 1, max: 100 }),
        total_customer_today: faker.number.int({ min: 1, max: 1000 }),
        total_profit_today: faker.number.int({ min: 10, max: 1000 }),
      });
    }

    // Update the partners key in the data object
    data.partners = mockPartners;

    // Write the updated object back to mock_data.json
    await writeFile(
      join(__dirname, "mock_data.json"),
      JSON.stringify(data, null, 2),
      "utf8"
    );

    console.log(
      `${numOfEntries} mock partners generated and saved to mock_data.json`
    );
  } catch (error) {
    console.error("Error generating mock partners:", error);
  } finally {
    process.exit();
  }
};

readdirSync(`${__dirname}/routes`).map(async (file) => {
  if (file.endsWith(".ts")) {
    await console.log(`Loading route: ${file}`);
    (await import(`./routes/${file}`)).default(app, prisma);
  }
});

app.listen(3000, async () => {
  console.log("Server running on port 3000");
  // await generateMockPartners(50);
});
