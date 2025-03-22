"use client"; // Ensure it's a client component
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface TravelPlan {
  city: string;
  start_date: string;
  end_date: string;
  city_description: string;
  travel_plan: string; // Assuming it's a JSON string that needs parsing
}

interface ItineraryDay {
  day: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export default function TravelPlanPage() {
  const params = useParams();
  const city = params.city as string;
  
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!city) return;
    
    const fetchData = async () => {
      try {
        console.log(`Fetching travel plan for city: ${city}`);
        
        const response = await fetch(`http://localhost:5000/api/get-travel-plan?city=${city}`);
        if (!response.ok) throw new Error("Failed to fetch travel plan");
        
        const data = await response.json();
        setTravelPlan(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [city]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!travelPlan) return <p>No travel plan found.</p>;
  
  // Parse travel_plan if it's a JSON string
  const planData = typeof travelPlan.travel_plan === 'string' 
    ? JSON.parse(travelPlan.travel_plan) 
    : travelPlan.travel_plan;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Travel Plan for {travelPlan.city}</h1>
      <p className="mb-6">{travelPlan.city_description}</p>
      
      <h2 className="text-2xl font-semibold mb-3">Itinerary:</h2>
      <div className="space-y-4 mb-6">
        {planData.itinerary.map((dayPlan: ItineraryDay, index: number) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-lg">{dayPlan.day}</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>{dayPlan.morning}</li>
              <li>{dayPlan.afternoon}</li>
              <li>{dayPlan.evening}</li>
            </ul>
          </div>
        ))}
      </div>
      
      <h2 className="text-2xl font-semibold mb-3">Travel Tips:</h2>
      <p className="mb-6">{planData.travel_tips}</p>
      
      <h2 className="text-2xl font-semibold mb-3">Local Food Recommendations:</h2>
      <p className="mb-6">{planData.local_food_recommendations}</p>
      
      <h2 className="text-2xl font-semibold mb-3">Estimated Costs:</h2>
      <p>{planData.estimated_costs}</p>
    </div>
  );
}