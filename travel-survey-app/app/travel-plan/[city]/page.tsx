"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TravelPlanPage() {
  const router = useRouter();
  const [travelPlan, setTravelPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTravelPlan = async () => {
      setLoading(true);
      try {
        // Fetch the travel plan from the backend
        const response = await fetch('http://127.0.0.1:5000/get_travel_plan', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching travel plan: ${response.status}`);
        }

        const data = await response.json();
        setTravelPlan(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching travel plan:', err);
        setError('Failed to load travel plan. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPlan();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Loading Your Travel Plan</h2>
          <p className="text-gray-600 mt-2">Fetching your personalized itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !travelPlan) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Something went wrong</h2>
          <p className="text-gray-600 mt-2">{error || 'Unable to load your travel plan'}</p>
          <button 
            onClick={handleBackToHome}
            className="mt-6 bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Process the travel plan data for display
  const plan = travelPlan;
  const city = plan.city;
  const startDate = plan.start_date;
  const endDate = plan.end_date;
  const numTravelers = plan.num_travelers;
  const travelPlans = plan.travel_plan;

  // Parse the travel plan from the backend
  const parseTravelPlan = () => {
    try {
      // The backend returns a string, so we need to parse it
      let parsedPlan = typeof travelPlans === 'string' 
        ? JSON.parse(travelPlans) 
        : travelPlans;
      
      if (typeof parsedPlan === 'string') {
        parsedPlan = JSON.parse(parsedPlan);
      }
      
      return parsedPlan;
    } catch (err) {
      console.error('Error parsing travel plan:', err);
      return {
        itinerary: [],
        accommodation: {
          name: "Not available",
          description: "Accommodation details could not be loaded",
          price: "N/A",
          image: "/hotel.jpg"
        },
        transportation: {
          type: "Not available",
          details: "Transportation details could not be loaded",
          price: "N/A"
        },
        totalCost: "N/A"
      };
    }
  };

  const parsedPlan = parseTravelPlan();

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-teal-800 text-white sticky top-0 z-50 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Honest Travel" 
              className="h-14 mr-2"
              width={70}
              height={70}
            />
            <h1 className="text-xl font-bold">Honest Travel</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBackToHome}
              className="bg-transparent border border-white px-3 py-1 rounded hover:bg-white hover:text-teal-800 transition-colors"
            >
              Back to Activities
            </button>
            <button 
              onClick={handlePrint} 
              className="bg-white text-teal-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Print Plan
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div 
            className="h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url('/api/placeholder/800/400')` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-4xl font-bold">{city} Travel Plan</h1>
                <p className="mt-2 text-xl">
                  {startDate} to {endDate} • {numTravelers} Traveler{numTravelers !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Your Personalized Travel Experience</h2>
                <p className="text-gray-600 mt-1">
                  We've created a custom itinerary based on your selected activities
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-semibold">
                  Total Cost: {parsedPlan.totalCost || 'Calculating...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold">Daily Itinerary</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {parsedPlan.itinerary && parsedPlan.itinerary.map((day) => (
              <div key={day.day} className="p-6">
                <h3 className="text-xl font-semibold mb-4">Day {day.day}</h3>
                
                <div className="space-y-6">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="flex">
                      <div className="w-32 flex-shrink-0 text-gray-500 font-medium">
                        {activity.time}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{activity.activity}</h4>
                        <p className="text-gray-600 mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodation & Transportation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Accommodation */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold">Accommodation</h2>
            </div>
            
            <div className="p-6">
              <div 
                className="h-48 bg-cover bg-center rounded-lg mb-4"
                style={{ backgroundImage: `url('/api/placeholder/400/200')` }}
              ></div>
              
              <h3 className="text-xl font-semibold">{parsedPlan.accommodation?.name || 'Luxury Hotel'}</h3>
              <p className="text-gray-600 mt-2">{parsedPlan.accommodation?.description || 'Comfortable accommodations with excellent amenities.'}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold">{parsedPlan.accommodation?.price || 'Contact for pricing'}</span>
              </div>
            </div>
          </div>
          
          {/* Transportation */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold">Transportation</h2>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 p-6 rounded-lg mb-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <h3 className="text-xl font-semibold ml-4">{parsedPlan.transportation?.type || 'Private Transportation'}</h3>
                </div>
              </div>
              
              <p className="text-gray-600">{parsedPlan.transportation?.details || 'Comfortable transportation for all your activities and transfers.'}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold">{parsedPlan.transportation?.price || 'Contact for pricing'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Action */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Ready to Book Your Trip?</h2>
              <p className="text-gray-600 mb-6">Complete your booking now to secure your personalized travel experience</p>
              
              <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg">
                Complete Booking
              </button>
              
              <p className="mt-4 text-sm text-gray-500">
                By clicking "Complete Booking", you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
        
        {/* Share Plan */}
        <div className="print:hidden bg-gray-50 rounded-lg shadow p-6 text-center mb-8">
          <h3 className="text-lg font-semibold mb-2">Share Your Travel Plan</h3>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </button>
            <button className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </button>
            <button className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </button>
            <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="print:hidden text-center text-gray-500 text-sm pt-4 pb-12">
          <p>© {new Date().getFullYear()} Honest Travel. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-teal-600">Terms of Service</a>
            <a href="#" className="hover:text-teal-600">Privacy Policy</a>
            <a href="#" className="hover:text-teal-600">Contact Us</a>
          </div>
        </div>
      </div>
    </main>
  );
}