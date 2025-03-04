// app/api/generateActivities.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { country, startDate, endDate, travellers } = req.body;

        try {
            const response = await axios.post('http://localhost:5000/getActivities', {
                country,
                startDate,
                endDate,
                travellers,
            });
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching activities' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}