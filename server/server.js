// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import connectDB from './configs/mongodb.js';
// import userRouter from './routes/userRoutes.js';

// const app = express();
// const PORT = process.env.PORT || 4000;

// const startServer = async () => {
//   try {
//     await connectDB(); // should log "Database connected" from inside connectDB

//     app.use(express.json());
//     app.use(cors());

//     app.get('/', (req, res) => res.send('API Working'));
//     app.use('/api/user',userRouter)

//     app.listen(PORT, () => {
//       console.log(`Server is running at http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to start server:', err);
//   }
// };

// startServer();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; //  ADD THIS

import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import { clerkWebhooks } from "./controllers/userControllers.js"; //  IMPORT THIS IF NOT YET

const app = express();
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();

    app.use(cors());

    //  RAW parser only for webhook route
    app.use("/api/webhook", bodyParser.raw({ type: "*/*" }));

    //  Normal JSON parser for other routes
    app.use(express.json());

    app.get("/", (req, res) => res.send("API Working"));

    app.use("/api/user", userRouter);

    //  ADD this line if not added
    app.post("/api/webhook", clerkWebhooks);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();

