const { MongoClient } = require("mongodb");

require("dotenv").config();

class DbClient {
  constructor() {
    const serverMode = process.env.NODE_ENV;
    const prodDb = process.env.MONGODB_URL_PROD;
    const devDb = process.env.MONGODB_URL_DEV || "mongodb://localhost:27017";
    const database = process.env.DB_DATABASE || "cryptallion";

    if (serverMode === "development") {
      this.url = devDb;
    }
    if (serverMode === "production") {
      this.url = prodDb;
    }

    this.client = new MongoClient(this.url);
    this.client.connect(); // Connect to the database
    this.db = this.client.db(database); // Select the database
    this.users = this.db.collection("users"); // Select the collection
  }

  async isAlive() {
    try {
      await this.client.connect();
      await this.client.db().command({ ping: 1 }); // Test connection
      return true;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      return false;
    } finally {
      await this.client.close(); // Close connection even on error
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DbClient();
module.exports = dbClient;
