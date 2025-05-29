import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
//---------------------------------------------------------------------------------------

const app = express();
dotenv.config();
const port = process.env.PORT;

//-----------------------------------------------------------------------------------------

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//-------------------------------------------------------------------------------------------
async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS albums(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    await sql`
        CREATE TABLE IF NOT EXISTS songs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255),
            audio VARCHAR(255) NOT NULL,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
    console.log("database initialized successfully !");
  } catch (error) {
    console.log("error in initDB", error);
  }
}

//------------------------------------------------------------------------------------

app.use("/api/v1", adminRoutes);


//---------------------------------------------------------------------------------------

initDB().then(() => {
  app.listen(port, () => {
    console.log(`App is listening on ${port}`);
  });
});
