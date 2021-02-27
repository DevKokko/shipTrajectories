const mysql = require('mysql');
const csv = require('csv-parser')
const fs = require('fs')

//Initializing empty array
const results = [];

//Connection with the database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bQr5XrFkWEE2"
});

con.connect(function(err) {
  if (err) throw err;

  var sql = "CREATE TABLE IF NOT EXISTS assignment.shipdata (timestamp DATETIME, mmsi INT, imo INT, navigational_status INT, longitude FLOAT, latitude FLOAT, heading INT, cog FLOAT, sog FLOAT, ship_name VARCHAR(255), call_sign VARCHAR(255), ship_type INT, draught INT, size_bow INT, size_stern INT, size_port INT, size_starboard INT, destination VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });

  //Initializing counter
  let c = 1;
  var sql = "INSERT INTO assignment.shipdata VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  //Parsing csv and inserting to database
  fs.createReadStream('./day.csv')
    .pipe(csv())
    .on('data', (data) => {
      
      con.query(sql, Object.values(data), function (err, result) {
        if (err){
          console.log(err);
          console.log("ERROR " + (c++));
          console.log(Object.values(data));
          throw err;
        }
      });
    })
    .on('end', () => {
      console.log("Done");
    });
  console.log("Connected!");
});
