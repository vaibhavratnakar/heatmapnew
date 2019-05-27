// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    id: Number,
    Name: String,
    Cluster: String,
    Datec: String,
    Location: String,
    Query: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);
