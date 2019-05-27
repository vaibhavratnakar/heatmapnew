// /backend/data.js
var mongoose = require("mongoose");
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;
var DataSchema = new Schema(
  {
    id: Number,
    Prop_ID: Number,
    Lat: SchemaTypes.Double,
    Long: SchemaTypes.Double,
    LastUpdateDate: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data1", DataSchema);
