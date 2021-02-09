import { MongoClient } from "mongodb";
import {CRUD_log} from "../../src/FuncionalidadInterna/Log/CRUD";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  let result = await CRUD(req,{Message:'XD',Action:'Create'});
  console.log("xd1"+result);
  res.json({result:result});
};