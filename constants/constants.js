// export const PORT = 5000;
// export const MONGO_URI = "mongodb+srv://aarthi_db_user:lcMEAXOKBKgCxYnI@cluster.hbb0ymu.mongodb.net/?appName=Cluster";
// export const JWT_SECRET = "BWiWl5AKiPVU58uLfqzNlT/TJpP23oC4Z+38K8C6AW5cVUw/ZSuHS6cQBxDI/LvGsfVMAcWas0fe9h3Fan8gPw==";
// export const EMAIL_USER = "aarthiraju@datapro.in";
// export const EMAIL_PASS = "rrep gqff evcz fzdv";




import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
