//map established
const map = L.map('map').setView([20, 0], 2);

//open street map imported 
L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//click to place a marker
let marker;
map.on('click', async function(e){

//constants set up for latitude, longitude, date, and output
const lat = e.latlng.lat;
const lng = e.latlng.lng;
const date = document.getElementById("date").value;
const output = document.getElementById("output");

//if there's no date, say to click on a date
if(!date){
output.textContent = "Please select a date first.";
return;
}

//if there is already a marker, remove it
if(marker){
map.removeLayer(marker);
}

//attribute marker to latitude and longitude and add to map
marker = L.marker([lat,lng]).addTo(map);

try{
//fetch responce from API 
const response = await fetch(
`/sun?lat=${lat}&lng=${lng}&date=${date}`
);

//get response
const data = await response.json();

//if this doesn't work, show error message on screen
if(data.sun.status !== "OK"){

output.textContent = "Error fetching sun data.";
return;

}

//constants established for using timezone data, sunrise/sunset data
const totalOffset = (data.timezone.rawOffset + data.timezone.dstOffset) * 1000;

const sunriseUTC = new Date(data.sun.results.sunrise);
const sunsetUTC  = new Date(data.sun.results.sunset);

const sunriseLocal = new Date(sunriseUTC.getTime() + totalOffset);
const sunsetLocal  = new Date(sunsetUTC.getTime() + totalOffset);

//this is what's shown on the screen
output.innerHTML = `
Location: ${lat.toFixed(2)}, ${lng.toFixed(2)} <br>
Timezone: ${data.timezone.timeZoneName} <br>
Sunrise: ${sunriseLocal.toLocaleTimeString()} <br>
Sunset: ${sunsetLocal.toLocaleTimeString()}
`;

//if this doesn't work, show that something went wrong 
}catch(error){

console.error(error);
output.textContent = "Something went wrong.";

}

});