var mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const path = require("path");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var async = require('async');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const elasticsearch = require('elasticsearch');
var total = 0;

var db;
const client = new elasticsearch.Client({
  hosts: [ `http://localhost:8200`]
});

const dbRoute = "mongodb://localhost:27017/test"; 
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let Db = mongoose.connection;

Db.once("open", () => console.log("connected to the database"));

Db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
 
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });//
});

router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

function saveheatmapdata(req, res, response, temp){
    const { id, Name, Cluster, Datec, Location, Query } = req.body;
    var dbo = db.db("test");
    var myobj = response;
    // console.log(response);
    dbo.collection(temp).insertMany(myobj, function(err, res){
      if (err) throw err;
      });
    });
}

function getheatmapdatafromelastic(req, res){
  const { id, Name, Cluster, Datec, Location, Query } = req.body;
    client.cat.count({index:Name}, function(error, res) {
      if(error) throw error;
      else  total = +res.split(' ')[2]
  
    var i;
    var temp = "a";
    var ID = '' + id;
    temp = temp + ID;
    var size = 500;
    var page = 10000/size;
    for(i=0; i<page; i++){
      // if ((i*size) > total) {
      //   var from = total%size; 
      // } else {
      //   var from = i*size;
      // }
      console.log("Size" + size + " from " + i*size);
      client.search({
        index: Name,
        size: size, from:i*size
      }, function(error, response){
          if(error) {
            console.log(error);
          }
         // console.log(response);
         async.eachSeries(response, function(item, cb){
           setTimeout(function(){
             return saveheatmapdata(req, res, response.hits.hits, temp);
           });
         });
          
      });
    }
  
  });
  
  // for
  
}
function saveHeatMapFormData(req, res){
  let data = new Data();
  const { id, Name, Cluster, Datec, Location, Query } = req.body;

  if ((!id && id !== 0) || !Name || !Datec) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.Name = Name;
  data.Location = Location;
  data.Datec = Datec;
  data.Cluster = Cluster;
  data.id = id;
  data.Query = Query;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return getheatmapdatafromelastic(req, res);
  
  
  });

}
router.post("/putData", (req, res) => {
  saveHeatMapFormData(req, res);
});
  

app.use("/api", router);
 

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
});

app.get('/map', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});