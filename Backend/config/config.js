import dotenv from 'dotenv';
dotenv.config(); //to use environment varraible

  const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET, // here MONGO__URI is a vrraible in .env file

}
  export default config