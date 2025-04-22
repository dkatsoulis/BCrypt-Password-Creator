import { passwords, type Password, type InsertPassword } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  savePassword(password: InsertPassword): Promise<Password>;
  getPassword(id: number): Promise<Password | undefined>;
  getPasswords(): Promise<Password[]>;
}

export class MemStorage implements IStorage {
  private passwords: Map<number, Password>;
  currentId: number;

  constructor() {
    this.passwords = new Map();
    this.currentId = 1;
  }

  async savePassword(insertPassword: InsertPassword): Promise<Password> {
    const id = this.currentId++;
    const password: Password = { ...insertPassword, id };
    this.passwords.set(id, password);
    return password;
  }

  async getPassword(id: number): Promise<Password | undefined> {
    return this.passwords.get(id);
  }

  async getPasswords(): Promise<Password[]> {
    return Array.from(this.passwords.values());
  }
}

export const storage = new MemStorage();
