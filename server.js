//hosting capabilities
const express = require("express");
require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3000;

// Serve everything in the public folder
app.use(express.static("public"));

//request data from jsons for sunrise and sunset data and osm data
app.get("/sun", async (req, res) => {
  const { lat, lng, date } = req.query;
  console.log(lat, lng, date)
  try {
    const sunResponse = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}&formatted=0`);
    const sunData = await sunResponse.json();
    console.log(sunData)

    const timestamp = Math.floor(Date.now() / 1000);
    const tzResponse = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${process.env.GOOGLE_API_KEY}`);
    const tzData = await tzResponse.json();

    res.json({ sun: sunData, timezone: tzData });

    //if not working, show server error
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//host on port(3000)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});