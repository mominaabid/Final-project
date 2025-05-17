import express from "express";
import axios from "axios";

const router = express.Router();

// Amadeus API credentials (store securely in environment variables)
const AMADEUS_CLIENT_ID = "Op8hIL2GdOwzGhHmQQAlP6GQ3B5cxEla"; // Replace with your Amadeus client ID
const AMADEUS_CLIENT_SECRET = "vgzprnoROLzgZavm"; // Replace with your Amadeus secret key
const AMADEUS_API_URL = "https://test.api.amadeus.com/v1"; // Use test API for development

// Get Amadeus API token
async function getAmadeusToken() {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      `grant_type=client_credentials&client_id=${AMADEUS_CLIENT_ID}&client_secret=${AMADEUS_CLIENT_SECRET}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching Amadeus token:", error);
    throw new Error("Failed to authenticate with Amadeus API");
  }
}

// Hotel search endpoint
router.get("/amadeus-hotels", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  try {
    const token = await getAmadeusToken();

    // Fetch hotels from Amadeus Hotel Search API
    const response = await axios.get(
      `${AMADEUS_API_URL}/shopping/hotel-offers`,
      {
        params: {
          cityCode: city, // Assumes city is an IATA city code (e.g., "NYC" for New York)
          radius: 20, // Search radius in km
          radiusUnit: "KM",
          includeClosed: false,
          adults: 1,
          ratings: "3,4,5", // Filter by 3, 4, or 5-star hotels
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching hotels from Amadeus:", error);
    res.status(500).json({ error: "Failed to fetch hotel recommendations" });
  }
});

export default router;