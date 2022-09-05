import { Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI)
  throw new Error("Define the MONGODB_URI environmental variable");
if (!MONGODB_DB)
  throw new Error("Define the MONGODB_DB environmental variable");
const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

export class myMongoDB {
  static instance: myMongoDB | null = null;

  public client: MongoClient;
  public db!: Db;

  private constructor() {
    console.log("Conectando db ...");
    this.client = new MongoClient(MONGODB_URI as string, opts);
  }

  public async validateConnection() {
    if (!this.client.isConnected()) {
      console.log("Reconectando db ...");

      await this.client.connect();
      this.db = this.client.db(MONGODB_DB);
    }
  }

  static async getMyService() {
    if (!this.instance) this.instance = new myMongoDB();
    await this.instance.validateConnection();
    return this.instance;
  }
}
