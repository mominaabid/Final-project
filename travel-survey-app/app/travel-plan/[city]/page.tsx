"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

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

interface HotelOption {
  id: string;
  name: string;
  rating: number;
  price: string;
  imageUrl: string;
  description: string;
}

// Hotel Recommendations Component
function HotelRecommendations({ city }: { city: string }) {
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Attempt to fetch from your actual API endpoint
        const response = await fetch(`http://localhost:5000/api/get-hotel-recommendations?city=${encodeURIComponent(city)}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch hotel recommendations");
        }
        
        const data = await response.json();
        setHotels(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching hotel recommendations:", error);
        // If the API call fails, we'll fall back to some mock data
        // In production, you might want to show the error instead
        console.log("Falling back to mock hotel data");
        
        // Mock data as fallback
        const mockHotels = [
          {
            id: "hotel1",
            name: "Grand City Hotel",
            rating: 4.7,
            price: "$250/night",
            imageUrl: "/api/placeholder/300/200",
            description: "Luxury hotel in the heart of downtown with amazing city views and premium amenities."
          },
          {
            id: "hotel2",
            name: "Riverside Inn",
            rating: 4.5,
            price: "$180/night",
            imageUrl: "/api/placeholder/300/200",
            description: "Charming boutique hotel located near major attractions with complimentary breakfast."
          },
          {
            id: "hotel3",
            name: "Urban Suites",
            rating: 4.8,
            price: "$320/night",
            imageUrl: "/api/placeholder/300/200",
            description: "Modern all-suite hotel with kitchenettes, perfect for extended stays and families."
          }
        ];
        
        setHotels(mockHotels);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [city]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-t-4 border-b-4 border-teal-400 rounded-full animate-spin mb-2"></div>
          <p className="text-teal-400 text-sm">Loading hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-700 p-4 rounded-md text-center">
        <p className="text-red-400">Unable to load hotel recommendations: {error}</p>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-gray-700 p-4 rounded-md text-center">
        <p className="text-gray-300">No hotel recommendations available for this location.</p>
      </div>
    );
  }

  // Render Star Rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={`star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={`star-half-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={`star-empty-${i}`} className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <div key={hotel.id} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-48 w-full">
            <img 
              src={hotel.imageUrl} 
              alt={hotel.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-teal-400">{hotel.name}</h3>
              <span className="bg-teal-900 text-teal-400 text-sm px-2 py-1 rounded">
                {hotel.price}
              </span>
            </div>
            <div className="flex items-center mb-3">
              {renderStars(hotel.rating)}
              <span className="ml-2 text-gray-300 text-sm">{hotel.rating}/5</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              {hotel.description}
            </p>
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-colors text-sm">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-4 border-b-4 border-teal-400 rounded-full animate-spin mb-4"></div>
          <p className="text-teal-400 text-lg">Loading your travel plan...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-300">Error: {error}</p>
          <button 
            className="mt-6 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!travelPlan) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">No Travel Plan Found</h2>
          <p className="text-gray-300">We couldn't find a travel plan for this destination.</p>
        </div>
      </div>
    );
  }

  // Parse travel_plan if it's a JSON string
  const planData = typeof travelPlan.travel_plan === 'string'
    ? JSON.parse(travelPlan.travel_plan)
    : travelPlan.travel_plan;

  // Format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Hero section with city name */}
      <div className="bg-gray-800 py-16 mb-8 shadow-md">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-teal-400">{travelPlan.city}</h1>
          <p className="text-lg text-gray-300">
            {formatDate(travelPlan.start_date)} - {formatDate(travelPlan.end_date)}
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6">
        {/* City description */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <p className="text-gray-300 leading-relaxed">{travelPlan.city_description}</p>
        </div>
        
        {/* Itinerary section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-teal-400 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Your Itinerary
          </h2>
          
          <div className="space-y-6">
            {planData.itinerary.map((dayPlan, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-teal-900 px-6 py-3">
                  <h3 className="font-bold text-xl">{dayPlan.day}</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-400 mb-1">Morning</h4>
                      <p className="text-gray-300">{dayPlan.morning}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-400 mb-1">Afternoon</h4>
                      <p className="text-gray-300">{dayPlan.afternoon}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-400 mb-1">Evening</h4>
                      <p className="text-gray-300">{dayPlan.evening}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional information in cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Travel Tips */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Travel Tips
            </h2>
            <p className="text-gray-300 leading-relaxed">{planData.travel_tips}</p>
          </div>
          
          {/* Local Food */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Local Food
            </h2>
            <p className="text-gray-300 leading-relaxed">{planData.local_food_recommendations}</p>
          </div>
        </div>
        
        {/* Hotel Recommendations */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-teal-400 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Hotel Recommendations
          </h2>
          
          <HotelRecommendations city={travelPlan.city} />
        </div>
        
        {/* Estimated Costs */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estimated Costs
          </h2>
          <p className="text-gray-300 leading-relaxed">{planData.estimated_costs}</p>
        </div>
        
        {/* Bottom action buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-md transition-colors shadow-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Itinerary
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md transition-colors shadow-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Plan
          </button>
        </div>
      </div>
    </div>
  );
}