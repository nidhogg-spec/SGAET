// try {
//     // require('dotenv').config();
// } catch (error) {
//     console.info("Dont load .env ; It isn't a problem, or maybe yes")
// }

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;
const MONGODB_DB: string | undefined = process.env.MONGODB_DB;
const SECRET_KEY: string = process.env.SECRET_KEY || "secret";
const API_DOMAIN: string | undefined = process.env.API_DOMAIN;
const AWS_USER_POOLS_ID: string | undefined = process.env.AWS_USER_POOLS_ID;
const AWS_CLIENT_ID: string | undefined = process.env.AWS_CLIENT_ID;

const LONG_SECRET_KEY: string =
  (SECRET_KEY as string).length < 32 ? SECRET_KEY.padEnd(32, "A") : SECRET_KEY;

export {
  MONGODB_URI,
  MONGODB_DB,
  SECRET_KEY,
  API_DOMAIN,
  AWS_USER_POOLS_ID,
  AWS_CLIENT_ID,
  LONG_SECRET_KEY
};
