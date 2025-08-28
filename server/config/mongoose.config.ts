import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbName: string = process.env.DB as string;
const username: string = process.env.ATLAS_USERNAME as string;
const pw: string = process.env.ATLAS_PASSWORD as string;

const uri: string = `mongodb+srv://${username}:${pw}@cluster0.86etoks.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(() => console.log("✅ Established a connection to the database"))
  .catch(err => console.error("❌ Something went wrong when connecting to the database", err));

export default mongoose;
