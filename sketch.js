// Create a Leaflet map centered at latitude 20, longitude 0, zoom level 2
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tile layer (the visual map background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors' // Required attribution
}).addTo(map);

let marker; // Variable to store the current map marker

// Run this function whenever the user clicks on the map
map.on('click', async function (e) {

  // Get clicked latitude and longitude
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  // Get selected date from input field
  const date = document.getElementById("date").value;

  // Get output display element
  const output = document.getElementById("output");

  // If no date is selected, show message and stop execution
  if (!date) {
    output.textContent = "Please select a date first.";
    return;
  }

  // Remove old marker if one already exists
  if (marker) {
    map.removeLayer(marker);
  }

  // Add a new marker at the clicked location
  marker = L.marker([lat, lng]).addTo(map);

  try {
    // Fetch sunrise and sunset data from the API
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}&formatted=0`
    );

    // Convert API response to JSON
    const data = await response.json();

    // If API returns an error status, show message
    if (data.status !== "OK") {
      output.textContent = "Error fetching sun data.";
      return;
    }

    // Convert sunrise and sunset times to local time format
    const sunrise = new Date(data.results.sunrise).toLocaleTimeString();
    const sunset = new Date(data.results.sunset).toLocaleTimeString();

    // Display location and sun times in the output element
    output.innerHTML = `
      Location: ${lat.toFixed(2)}, ${lng.toFixed(2)} <br>
      Sunrise: ${sunrise} <br>
      Sunset: ${sunset}
    `;

  } catch (error) {
    // Log error to console and show fallback message
    console.error(error);
    output.textContent = "Something went wrong.";
  }

});
