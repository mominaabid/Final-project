// app/api/generateTravelPlan.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { city, selectedActivities } = req.body;

        try {
            const response = await axios.post('http://localhost:5000/generateTravelPlan', {
                city,
                selectedActivities,
            });
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Error generating travel plan' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}