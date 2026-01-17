export const PORT = 5555;
import 'dotenv/config';

const db_ip = process.env.MONGO_IP;
const db_port = process.env.MONGO_PORT;
const db_name = process.env.MONGO_DB;
const db_user = process.env.MONGO_USER;
const db_password = process.env.MONGO_PWD;
const MONGO_URI = `${db_ip}:${db_port}`;
export const db_URI = `mongodb://${db_user}:${db_password}@${MONGO_URI}/${db_name}`;
console.log(`db_URI: ${db_URI}`);
