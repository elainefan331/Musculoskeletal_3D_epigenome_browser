// export const PORT = 5555;
import "dotenv/config";
// Environment
export const NODE_ENV = process.env.NODE_ENV || "development";
// Server Configuration
export const PORT = process.env.PORT || 5555;

// Database Configuration
const db_ip = process.env.MONGO_IP;
const db_port = process.env.MONGO_PORT;
const db_name = process.env.MONGO_DB;
const db_user = process.env.MONGO_USER;
const db_password = process.env.MONGO_PWD;
const MONGO_URI = `${db_ip}:${db_port}`;
export const db_URI = `mongodb://${db_user}:${db_password}@${MONGO_URI}/${db_name}`;
// console.log(`db_URI: ${db_URI}`);

// Frontend Configuration
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Log configuration (only in development)
if (NODE_ENV === "development") {
  console.log(`🔧 Environment: ${NODE_ENV}`);
  console.log(`🔧 PORT: ${PORT}`);
  console.log(`🔧 db_URI: ${db_URI}`);
  console.log(`🔧 FRONTEND_URL: ${FRONTEND_URL}`);
}
