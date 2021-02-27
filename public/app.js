
//initializing a new WebSocket Object  in order to get response from with ship's data from the server
let socket = new WebSocket("ws://34.107.107.97:8080");

//opening a new WebSocket connection
socket.onopen = function(e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
};

//creating an array of arrays which is empty the first time
let selectedShips = [];

//a function that is called when a message is received from the server. 
socket.onmessage = function(event) {
  /* Declaring a new variable which contains all JSON responses from the server.Looping throught allShips array and adding required data and calling findShip method which returns ship's data or null if ship is not found in selectedShips array. Verifying the response from the function and display an amount of 1000 ships. Creating a marker for the selected Ships passing the latitude and longitude as a parameter. Adding the marker to the map and when clicked display the name of the ship. Adding a polyline to every ship with a black color given.Display the polyline in map.Push the ship in selectedShips array.If the ship already exists in an array move it by passing new lat and lon values.move marker to the new position */ 
  let allShips = JSON.parse(event.data);
  try{
    for (let ship of allShips){
      
      let isFound = findShip(ship.mmsi);
        if(isFound === null && selectedShips.length<1000){
          ship.marker = L.marker([ship.latitude , ship.longitude], {icon: shipIcon});
          ship.marker.addTo(mymap).bindPopup(`<b>Name</b>: ${ship.ship_name}`);
          ship.polyline = L.polyline([[ship.latitude , ship.longitude]], {color: 'black'});
          ship.polyline.addEventListener('click', deleteLine);
          ship.polyline.addTo(mymap);
          selectedShips.push(ship);
        }else if (isFound !== null) { 
          isFound.polyline.addLatLng([ship.latitude , ship.longitude]);
          isFound.marker.setLatLng([ship.latitude , ship.longitude]);
        }
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let date = new Date(ship.timestamp);
      let dateFormatted =date.toString();
      document.getElementById('timer').innerHTML = dateFormatted.substr(0,28);
    }
 }catch(err){
        throw err;
   }
 }

 //a function to delete ship's trajectory when a user clicks on
 function deleteLine(e){
   e.target.remove();
 }

 // a function to find if a ship exists in selectedShips array
 function findShip(mmsi) {

  for(let selectedShip of selectedShips){
    if(selectedShip.mmsi === mmsi) {
     return selectedShip;
    }
  }
  return null;
}
 //a function which is called when the WebSocket connection's readyState changes to CLOSED
socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
  }
};
//a function which is called when an error occurs on the WebSocket.
socket.onerror = function(error) {
  console.log(`[error] ${error.message}`);
};

// initialize the map on the "map" div with a given center and zoom
let mymap = L.map('mapid').setView([37.92, 23.51], 10);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia29zdGFza29ra28iLCJhIjoiY2toczU4eTVlMHBqZTJ4a3phY292cnA5NyJ9.1tsK8aqvjFm1BkaFyiH3pg'
}).addTo(mymap);

let shipIcon = L.icon({
  iconUrl: 'ship-icon.png',
  iconSize:     [38, 46], // size of the icon
  iconAnchor:   [19, 46], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
});
