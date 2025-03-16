"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CityDetails() {
  const params = useParams();
  const router = useRouter();
  const [city, setCity] = useState("");
  const [cityInfo, setCityInfo] = useState<any>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("");
  const [travelPlan, setTravelPlan] = useState(null);

  useEffect(() => {
    setCity(params.city as string);
  }, [params.city]);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("cityInfo");
    const storedStartDate = localStorage.getItem("start_date");
    const storedEndDate = localStorage.getItem("end_date");
    const storedTravelers = localStorage.getItem("travelers");
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Retrieved cityInfo from localStorage:", parsedData);

        if (parsedData.activities?.length > 0) {
          setCityInfo(parsedData);
          setActivities(parsedData.activities); // Set activities separately
          
          // Set dates from cityInfo or direct localStorage items
          setStartDate(parsedData.start_date || storedStartDate || "");
          setEndDate(parsedData.end_date || storedEndDate || "");
          setTravelers(parsedData.travelers || storedTravelers || "");
        } else {
          alert("No activities found. Redirecting...");
          router.push("/");
        }
      } catch (error) {
        console.error("Error parsing city data:", error);
        alert("Invalid city data. Redirecting...");
        router.push("/");
      }
    } else {
      alert("No city data found. Redirecting...");
      router.push("/");
    }
  }, [router]);

  const handleToggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmitActivities = async () => {
    if (selectedActivities.length === 0) {
      alert("Please select at least one activity.");
      return;
    }
<<<<<<< HEAD

=======
  
>>>>>>> 79cc7be1b32a73f43cf414cc142b49b79ccc72db
    if (!cityInfo) {
      alert("City information is missing. Please restart.");
      return;
    }
<<<<<<< HEAD

=======
  
>>>>>>> 79cc7be1b32a73f43cf414cc142b49b79ccc72db
    try {
      const response = await fetch("http://127.0.0.1:5000/generate_travel_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          start_date: startDate,
          end_date: endDate,
          num_travelers: parseInt(travelers, 10),
          selected_activities: selectedActivities,
        }),
      });
<<<<<<< HEAD

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const plan = await response.json();
      console.log("Generated Travel Plan:", plan);

      localStorage.setItem("travelPlan", JSON.stringify(plan));
=======
  
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      const plan = await response.json();
      console.log("Generated Travel Plan:", plan);
  
      // Store the travel plan in localStorage
      localStorage.setItem("travelPlan", JSON.stringify(plan));
  
      // Redirect to the travel plan page
>>>>>>> 79cc7be1b32a73f43cf414cc142b49b79ccc72db
      router.push(`/travel-plan/${city}`);
    } catch (error) {
      console.error("Error generating travel plan:", error);
      alert("Failed to generate travel plan. Check API or console for errors.");
    }
  };

  // Format the date range for display
  const formatDateRange = () => {
    if (!startDate && !endDate) return "Not specified";
    if (startDate && !endDate) return startDate;
    if (!startDate && endDate) return `Until ${endDate}`;
    return `${startDate} to ${endDate}`;
  };

  if (!cityInfo) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-400 drop-shadow-lg animate-fade-in">
          Welcome to {city}
        </h1>
        <p className="text-lg text-gray-300 mt-4">{cityInfo.description}</p>
        <div className="mt-4 text-gray-400 text-lg">
          <p><span className="font-bold text-teal-300">Travel Dates:</span> {formatDateRange()}</p>
          <p><span className="font-bold text-teal-300">Travelers:</span> {travelers || "Not specified"}</p>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mt-10 text-center text-teal-300 animate-fade-in">
        Top Activities to Explore:
      </h2>

      <div className="grid gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {activities.map((activity, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition duration-300 text-center text-lg font-semibold shadow-md
              ${
                selectedActivities.includes(activity)
                  ? "bg-teal-500 text-white shadow-lg scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105"
              }`}
            onClick={() => handleToggleActivity(activity)}
          >
            {activity}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={handleSubmitActivities}
          className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 hover:scale-105 transition duration-200
            disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={selectedActivities.length === 0}
        >
          Generate Travel Plan
        </button>
      </div>
    </div>
  );
}