import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const client = await MongoClient.connect(process.env.MONGO_DB_URL);

const app = express();

app.use(express.json());

app.use(cors());

const __dirname = path.resolve();

app.listen(3002, () => {
  console.log("App listens to port no 3002");
});

app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Task 1 API

app.get("/", async (req, res) => {
  const field = req.query.field !== "undefined" ? req.query.field : "_id";
  const sortOrder = parseInt(
    req.query.sort !== "undefined" ? req.query.sort : 1
  );

  const agg = [
    {
      $group: {
        _id: "$work_year",
        total_jobs: {
          $sum: 1,
        },
        avg_salary: {
          $avg: "$salary_in_usd",
        },
      },
    },
    {
      $sort: { [field]: sortOrder },
    },
  ];

  try {
    const coll = client.db("assignment").collection("salaries");
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong!" });
  }
});

// Task 2 API

app.get("/subtable", async (req, res) => {
  const year = req.query.year !== "undefined" ? parseInt(req.query.year) : 2024;
  const field = req.query.field !== undefined ? req.query.field : "_id";
  const sortOrder = req.query.sort !== undefined ? parseInt(req.query.sort) : 1;

  const agg = [
    {
      $match: {
        work_year: year,
      },
    },
    {
      $group: {
        _id: "$job_title",
        jobs: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { [field]: sortOrder },
    },
  ];

  try {
    const coll = client.db("assignment").collection("salaries");
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong!" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});