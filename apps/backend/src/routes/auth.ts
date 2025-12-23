import { z } from "zod";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { encrypt } from "../utils/encryption";

const prisma = new PrismaClient();
const router = Router();

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  binanceApiKey: z.string().min(10),
  binanceSecretKey: z.string().min(10)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const { email, password, binanceApiKey, binanceSecretKey } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      binanceApiKeyEnc: encrypt(binanceApiKey),
      binanceSecretEnc: encrypt(binanceSecretKey)
    }
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "30m" }
  );

  res.json({ token });
});

/* ---------- LOGIN ---------- */
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "30m" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email }
  });
});

export default router;