import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import products from "./products.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.2
});

app.get("/products", (_, res) => res.json(products));

app.post("/recommend", async (req, res) => {
  const query = String(req.body?.query || "").trim();

  if (!query) {
    return res.status(400).json({ error: "Please enter a preference." });
  }

const prompt = `
You are an AI shopping assistant.

Recommend ONLY products from the product list.

User Request:
${query}

Available Products:
${JSON.stringify(products, null, 2)}

Rules:
1. Recommend at most 3 products.
2. Do NOT invent products.
3. Use only product IDs from the list.
4. Return ONLY valid JSON.
5. Do NOT use markdown or backticks.

Expected Output:

{
  "recommendations": [
    {
      "id": 1,
      "reason": "Reason for recommendation"
    }
  ]
}
`;

  try {
    const response = await model.invoke(prompt);
    const text = typeof response.content === "string" ? response.content : "";
    const parsed = JSON.parse(text);

    const validIds = new Set(products.map((product) => product.id));
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations.filter((item) => validIds.has(item.id))
      : [];

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: "Failed to get recommendations." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));