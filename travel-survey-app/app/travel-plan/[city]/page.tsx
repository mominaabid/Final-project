"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TravelPlan {
  city: string;
  country?: string;
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

interface PlanData {
  itinerary: ItineraryDay[];
  travel_tips: string;
  local_food_recommendations: string;
  estimated_costs: string;
  accommodation?: string;
  transportation?: string;
}

export default function TravelPlanPage() {
  const params = useParams();
  const city = params.city as string;
  
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [country, setCountry] = useState("");
  
  useEffect(() => {
    if (!city) return;
    
    const fetchData = async () => {
      setLoading(true);
      setPageLoading(true);
      
      try {
        console.log(`Fetching travel plan for city: ${city}`);
        
        // Simulate loading time for visual effect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await fetch(`http://localhost:5000/api/get-travel-plan?city=${city}`);
        if (!response.ok) throw new Error("Failed to fetch travel plan");
        
        const data = await response.json();
        setTravelPlan(data);
        
        // Parse travel_plan if it's a JSON string
        const parsed = typeof data.travel_plan === 'string' 
          ? JSON.parse(data.travel_plan) 
          : data.travel_plan;
        
        setPlanData(parsed);
        setCountry(data.country || "");
        
        // Fetch background image
        fetchBackgroundImage(data.city, data.country);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
        // Add a small delay before removing the loader
        setTimeout(() => {
          setPageLoading(false);
        }, 500);
      }
    };
    
    fetchData();
  }, [city]);
  
  const fetchBackgroundImage = async (city: string, country?: string) => {
    try {
      // This would be your actual API call to Unsplash
      // For example:
      // const response = await fetch(`/api/getLocationImage?location=${city},${country}`);
      // const data = await response.json();
      // setBackgroundImage(data.imageUrl);
      
      // For demo purposes, we'll use a placeholder image
      setBackgroundImage(`/api/placeholder/1920/1080`);
    } catch (error) {
      console.error("Failed to fetch background image:", error);
    }
  };
  
  // SVG Loader component
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
          Preparing your travel plan...
        </motion.div>
      </div>
    </motion.div>
  );
  
  if (loading && !travelPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse text-xl font-medium">Loading your adventure...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-red-500/20 text-red-300 p-6 rounded-lg max-w-md text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!travelPlan || !planData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl font-medium">No travel plan found.</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* SVG Loader */}
      <AnimatePresence>
        {pageLoading && <SVGLoader />}
      </AnimatePresence>
      
      {/* Hero Section with Background Image */}
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* City Description */}
        <div className="bg-gray-800 bg-opacity-80 rounded-xl p-8 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-teal-300 mb-4">About Your Destination</h2>
          <p className="text-xl leading-relaxed text-gray-200">
            {travelPlan.city_description}
          </p>
        </div>
        
        {/* Itinerary Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-teal-300 mb-6 text-center">Your Itinerary</h2>
          
          <div className="space-y-6">
            {planData.itinerary.map((dayPlan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-gray-800/70 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="bg-teal-600 px-6 py-3">
                  <h3 className="text-xl font-bold text-white">{dayPlan.day}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-teal-300">Morning</h4>
                      <p className="text-gray-300">{dayPlan.morning}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-teal-300">Afternoon</h4>
                      <p className="text-gray-300">{dayPlan.afternoon}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-teal-300">Evening</h4>
                      <p className="text-gray-300">{dayPlan.evening}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Two Column Layout for Tips and Food */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/70 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-teal-300 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Travel Tips
            </h2>
            <p className="text-gray-300 leading-relaxed">{planData.travel_tips}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/70 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-teal-300 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Local Food Recommendations
            </h2>
            <p className="text-gray-300 leading-relaxed">{planData.local_food_recommendations}</p>
          </motion.div>
        </div>
        
        {/* Accommodation Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/70 rounded-lg p-6 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-teal-300 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Accommodation
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {planData.accommodation || 
              `We recommend staying in the city center area for easy access to major attractions. There are several options ranging from luxury hotels to budget-friendly hostels. For longer stays, consider booking an apartment through a vacation rental service for a more authentic local experience.`
            }
          </p>
        </motion.div>
        
        {/* Transportation Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/70 rounded-lg p-6 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold text-teal-300 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Transportation
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {planData.transportation || 
              `Public transportation in ${city} is efficient and well-connected. Consider purchasing a multi-day transit pass to save money. For day trips outside the city, trains offer a comfortable option. Rideshare services and taxis are readily available throughout the city, but may be more expensive during peak hours.`
            }
          </p>
        </motion.div>
        
        {/* Estimated Costs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-teal-600/20 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-teal-300 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estimated Costs
          </h2>
          <p className="text-gray-200 leading-relaxed">{planData.estimated_costs}</p>
        </motion.div>
        
        {/* Print/Save Button */}
        <div className="flex justify-center mt-12 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg shadow-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
            onClick={() => window.print()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Travel Plan
          </motion.button>
        </div>
        
        <div className="text-center mt-8 mb-16 text-gray-400">
          Enjoy your adventure in {city}!
        </div>
      </div>
    </div>
  );
}