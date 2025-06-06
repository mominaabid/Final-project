"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CityDetails() {
  const params = useParams();
  const router = useRouter();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cityInfo, setCityInfo] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set city from URL params immediately for initial render
    const cityName = decodeURIComponent(params.city);
    setCity(cityName);

    // Retrieve start_date, end_date, and travelers from localStorage
    const storedStartDate = localStorage.getItem("start_date") || "";
    const storedEndDate = localStorage.getItem("end_date") || "";
    const storedTravelers = localStorage.getItem("travelers") || "";
    setStartDate(storedStartDate);
    setEndDate(storedEndDate);
    setTravelers(storedTravelers);

    // Function to fetch all data
    const fetchAllData = async () => {
      try {
        // Fetch city info from backend with a minimum 3-4 second delay
        const minDelay = 3000; // 3 seconds
        const maxDelay = 4000; // 4 seconds
        const startTime = Date.now();
        const response = await fetch("http://127.0.0.1:5000/get_city_info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: cityName,
            start_date: storedStartDate,
            end_date: storedEndDate,
            travelers: storedTravelers,
          }),
        });

        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Direct API Response:", data);

        if (data.description && data.activities?.length > 0) {
          setCityInfo(data);
          setActivities(data.activities);
          setCountry(data.country || "");

          // Fetch background image
          const imgResponse = await fetch(`/api/getCityImage?city=${encodeURIComponent(data.country || cityName)}`);
          if (!imgResponse.ok) throw new Error(`Image fetch failed! Status: ${imgResponse.status}`);
          const imgData = await imgResponse.json();
          setBackgroundImage(imgData.imageUrl || "/mountains.jpg");

          // Ensure minimum 3-4 second delay for loader animation
          const elapsedTime = Date.now() - startTime;
          const delay = Math.random() * (maxDelay - minDelay) + minDelay;
          const remainingDelay = Math.max(0, delay - elapsedTime);
          if (remainingDelay > 0) await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        } else {
          alert("No activities found for this city. Redirecting...");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch activities. Redirecting...");
        router.push("/");
      } finally {
        setIsLoading(false); // Hide loader only when all data is ready
      }
    };

    // Start fetching data
    fetchAllData();
  }, [params.city, router]);

  const handleToggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmitActivities = () => {
    if (selectedActivities.length === 0) {
      alert("Please select at least one activity.");
      return;
    }

    if (!cityInfo) {
      alert("City information is missing. Please restart.");
      return;
    }

    setIsLoading(true);

    localStorage.setItem("selected_activities", JSON.stringify(selectedActivities));

    setTimeout(() => {
      router.push(`/survey/${city}`);
    }, 800);
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) return "Not specified";
    if (startDate && !endDate) return startDate;
    if (!startDate && endDate) return `Until ${endDate}`;
    return `${startDate} to ${endDate}`;
  };

  const SVGLoader = () => (
    <motion.div
      className="fixed inset-0 bg-gray-900/95 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <svg className="svg-calLoader" xmlns="http://www.w3.org/2000/svg" width="230" height="230">
          <path
            className="cal-loaderpath"
            d="M86.429 40c63.616-20.04 101.511 25.08 107.265 61.93 6.487 41.54-18.593 76.99-50.6 87.643-59.46 19.791-101.262-23.577-107.142-62.616C29.398 83.441 59.945 48.343 86.43 40z"
            fill="none"
            stroke="#0099cc"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 10 10 10 10 10 10 432"
            strokeDashoffset="77"
          />
          <path
            className="cal-loaderplane"
            d="M141.493 37.93c-1.087-.927-2.942-2.002-4.32-2.501-2.259-.824-3.252-.955-9.293-1.172-4.017-.146-5.197-.23-5.47-.37-.766-.407-1.526-1.448-7.114-9.773-4.8-7.145-5.344-7.914-6.327-8.976-1.214-1.306-1.396-1.378-3.79-1.473-1.036-.04-2-.043-2.153-.002-.353.1-.87.586-1 .952-.139.399-.076.71.431 2.22.241.72 1.029 3.386 1.742 5.918 1.644 5.844 2.378 8.343 2.863 9.705.206.601.33 1.1.275 1.125-.24.097-10.56 1.066-11.014 1.032a3.532 3.532 0 0 1-1.002-.276l-.487-.246-2.044-2.613c-2.234-2.87-2.228-2.864-3.35-3.309-.717-.287-2.82-.386-3.276-.163-.457.237-.727.644-.737 1.152-.018.39.167.805 1.916 4.373 1.06 2.166 1.964 4.083 1.998 4.27.04.179.004.521-.076.75-.093.228-1.109 2.064-2.269 4.088-1.921 3.34-2.11 3.711-2.123 4.107-.008.25.061.557.168.725.328.512.72.644 1.966.676 1.32.029 2.352-.236 3.05-.762.222-.171 1.275-1.313 2.412-2.611 1.918-2.185 2.048-2.32 2.45-2.505.241-.111.601-.232.82-.271.267-.058 2.213.201 5.912.8 3.036.48 5.525.894 5.518.914 0 .026-.121.306-.27.638-.54 1.198-1.515 3.842-3.35 9.021-1.029 2.913-2.107 5.897-2.4 6.62-.703 1.748-.725 1.833-.594 2.286.137.46.45.833.872 1.012.41.177 3.823.24 4.37.085.852-.25 1.44-.688 2.312-1.724 1.166-1.39 3.169-3.948 6.771-8.661 5.8-7.583 6.561-8.49 7.387-8.702.233-.065 2.828-.056 5.784.011 5.827.138 6.64.09 8.62-.5 2.24-.67 4.035-1.65 5.517-3.016 1.136-1.054 1.135-1.014.207-1.962-.357-.38-.767-.777-.902-.893z"
            fill="#000033"
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-teal-400 text-xl font-medium mt-4"
        >
          Loading your travel experience...
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AnimatePresence>
        {isLoading && <SVGLoader />}
      </AnimatePresence>
      
      {!isLoading && (
        <>
          <div className="relative h-96 overflow-hidden">
            {backgroundImage && (
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <img
                  src={backgroundImage}
                  alt={`${city}, ${country}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6">
              <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-2 tracking-tight drop-shadow-lg">
                {city}
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-teal-300 text-center tracking-wide drop-shadow-md">
                {country}
              </h2>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <div className="bg-gray-800 bg-opacity-80 rounded-xl p-8 shadow-xl">
              <p className="text-xl leading-relaxed text-gray-200 mb-6">
                {cityInfo?.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700 rounded-lg p-4">
                  <span className="block text-teal-300 font-semibold">Travel Dates</span>
                  <span className="text-lg">{formatDateRange()}</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <span className="block text-teal-300 font-semibold">Travelers</span>
                  <span className="text-lg">{travelers || "Not specified"}</span>
                </div>
                <div className="md:col-span-1 col-span-2 bg-gray-700 rounded-lg p-4">
                  <span className="block text-teal-300 font-semibold">Selected Activities</span>
                  <span className="text-lg">{selectedActivities.length} of {activities.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pb-16">
            <h2 className="text-3xl font-bold text-center text-teal-300 mb-8">
              Choose Your Activities
            </h2>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (index % 10) }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleToggleActivity(activity)}
                  className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 group ${
                    selectedActivities.includes(activity)
                      ? "ring-4 ring-teal-400 scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  <div className={`absolute inset-0 ${
                    selectedActivities.includes(activity)
                      ? "bg-teal-500 bg-opacity-80"
                      : "bg-gray-800 bg-opacity-70 group-hover:bg-opacity-60"
                  } transition-colors duration-300`}></div>
                  
                  <div className="p-6 relative z-10 h-full flex items-center justify-center">
                    <h3 className={`text-xl font-bold text-center ${
                      selectedActivities.includes(activity) ? "text-white" : "text-gray-100"
                    }`}>
                      {activity}
                    </h3>
                  </div>
                  
                  {selectedActivities.includes(activity) && (
                    <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-teal-600 rounded-full w-8 h-8 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitActivities}
                className="px-8 py-4 bg-teal-500 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-teal-600 transition duration-300
                  disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={selectedActivities.length === 0}
              >
                <span>Generate Travel Plan</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
            
            <div className="text-center mt-8 text-gray-400">
              Start your adventure in {city} today
            </div>
          </div>
        </>
      )}
    </div>
  );
}