import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { passwordGenerationSchema, type GeneratedPassword } from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// Generate a secure random password
function generateRandomPassword(
  length: number,
  options: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  }
): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_-+=<>?";

  let availableChars = "";
  if (options.uppercase) availableChars += uppercaseChars;
  if (options.lowercase) availableChars += lowercaseChars;
  if (options.numbers) availableChars += numberChars;
  if (options.special) availableChars += specialChars;

  // Fallback if nothing is selected
  if (availableChars === "") {
    availableChars = lowercaseChars + numberChars;
  }

  // Generate password
  let password = "";
  const randomBytes = crypto.randomBytes(length * 2);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % availableChars.length;
    password += availableChars.charAt(randomIndex);
  }

  // Ensure at least one character from each selected type
  let adjustedPassword = password;
  
  if (options.uppercase) {
    const randomPos = crypto.randomInt(length);
    const randomChar = uppercaseChars.charAt(crypto.randomInt(uppercaseChars.length));
    adjustedPassword = adjustedPassword.substring(0, randomPos) + randomChar + adjustedPassword.substring(randomPos + 1);
  }
  
  if (options.lowercase) {
    const randomPos = crypto.randomInt(length);
    const randomChar = lowercaseChars.charAt(crypto.randomInt(lowercaseChars.length));
    adjustedPassword = adjustedPassword.substring(0, randomPos) + randomChar + adjustedPassword.substring(randomPos + 1);
  }
  
  if (options.numbers) {
    const randomPos = crypto.randomInt(length);
    const randomChar = numberChars.charAt(crypto.randomInt(numberChars.length));
    adjustedPassword = adjustedPassword.substring(0, randomPos) + randomChar + adjustedPassword.substring(randomPos + 1);
  }
  
  if (options.special) {
    const randomPos = crypto.randomInt(length);
    const randomChar = specialChars.charAt(crypto.randomInt(specialChars.length));
    adjustedPassword = adjustedPassword.substring(0, randomPos) + randomChar + adjustedPassword.substring(randomPos + 1);
  }
  
  return adjustedPassword;
}

// Generate a bcrypt hash
function generateBcryptHash(password: string, costFactor: number): string {
  const salt = bcrypt.genSaltSync(costFactor);
  return bcrypt.hashSync(password, salt);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate passwords and their bcrypt hashes
  app.post("/api/generate-passwords", async (req, res) => {
    try {
      const validatedData = passwordGenerationSchema.parse(req.body);
      const { count, length, costFactor, options } = validatedData;
      
      // Generate passwords and their hashes
      const generatedPasswords: GeneratedPassword[] = [];
      
      for (let i = 0; i < count; i++) {
        const password = generateRandomPassword(length, options);
        const hash = generateBcryptHash(password, costFactor);
        
        generatedPasswords.push({ password, hash });
      }
      
      res.json({ generatedPasswords });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        console.error("Error generating passwords:", error);
        res.status(500).json({ message: "Failed to generate passwords" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
