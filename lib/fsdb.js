const path = require("path");
const fs = require("fs").promises;

const DB_DIR = path.join(process.cwd(), ".local", "notes");

class FSDB {
  constructor(token) {
    this.token = token;
    this.noteDir = path.join(DB_DIR, this.token);
  }

  async init() {
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.mkdir(this.noteDir, { recursive: true });
  }

  async set(key, value) {
    try {
      await fs.mkdir(this.noteDir, { recursive: true });
      const notePath = path.join(this.noteDir, key);
      await fs.writeFile(notePath, JSON.stringify(value), "utf8");
    } catch (error) {
      console.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async get(key) {
    try {
      const notePath = path.join(this.noteDir, key);
      const content = await fs.readFile(notePath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      if (error.code === "ENOENT") {
        return null;
      }
      console.error(`Error getting key ${key}:`, error);
      throw error;
    }
  }

  async delete(key) {
    try {
      const notePath = path.join(this.noteDir, key);
      await fs.unlink(notePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(`Error deleting key ${key}:`, error);
        throw error;
      }
    }
  }

  async getKeys() {
    try {
      await fs.mkdir(this.noteDir, { recursive: true });
      const files = await fs.readdir(this.noteDir);
      return files;
    } catch (error) {
      console.error("Error getting keys:", error);
      throw error;
    }
  }
}

module.exports = {
  db: new FSDB("pet-token"),
};
