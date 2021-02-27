const express = require('express')
const app = express()
const port = 80

const mysql = require('mysql');
const csv = require('csv-parser')
const fs = require('fs')

//Connection with the database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bQr5XrFkWEE2"
});

const WebSocket = require('ws');
//Creating WebSocker server at port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(client) {
  //Initializing client's state
  client.state = 0;
  //Sending the required data to every client
  SendData(client);
});

//A function which retrieves from the database ship's data and sends them back to the clients
function SendData(client){
  
  let hours = parseInt(client.state/60);
  //When 24 hours are completed, data will be shown from the beginning
  if(hours == 24){
    client.state = 0;
    hours = 0;
  }
  let minutes = client.state%60;
  var sql = "SELECT * FROM assignment.shipdata WHERE HOUR(timestamp)=? AND MINUTE(timestamp)=? ORDER BY timestamp";
  con.query(sql, [hours, minutes], function (err, result) {
    if (err) throw err;
    client.send(JSON.stringify(result));
    //Showing new data each second 
    setTimeout(function(){
      if (client.readyState === client.OPEN) {
        //Adjusting state's value
        client.state++;
        //Sending new data
        SendData(client);
      }
    },1000);
  });
}

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
