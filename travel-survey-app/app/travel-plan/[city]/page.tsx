"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface TravelPlan {
  city: string;
  start_date: string;
  end_date: string;
  city_description: string;
  travel_plan: string;
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

function HotelRecommendations({ city, startDate, endDate }: { city: string; startDate: string; endDate: string }) {
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        if (!city || !startDate || !endDate) {
          throw new Error("Missing required parameters: city, startDate, or endDate");
        }

        const url = "https://honesttravel.pythonanywhere.com/google_hotel_list";
        const requestBody = JSON.stringify({
          input_city: city,
          input_dt1: startDate,
          input_dt2: endDate,
        });

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch hotel recommendations: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Raw API Response:", data);

        let hotelsArray: any[] = [];
        if (Array.isArray(data)) {
          hotelsArray = data;
        } else {
          throw new Error("Invalid response format: Expected an array of hotel objects");
        }

        const mappedHotels: HotelOption[] = hotelsArray.map((hotel: any, index: number) => {
          console.log(`Mapping hotel ${index}:`, hotel);

          const hotelName = hotel.name || hotel.hotel_name || "Unnamed Hotel";
          const hotelRating = hotel.rating || hotel.hotel_rating || "4.0";
          const hotelPrice = hotel.price || hotel.hotel_price || "$200/night";
          const hotelImages = hotel.images || hotel.hotel_images || [];
          const hotelDescription = hotel.description !== "N/A" ? hotel.description : hotel.hotel_description || "No description available.";

          return {
            id: `hotel-${index}`,
            name: hotelName,
            rating: parseFloat(hotelRating) || 4.0,
            price: hotelPrice,
            imageUrl: hotelImages.length > 0 ? hotelImages[0] : "/api/placeholder/300/200",
            description: hotelDescription,
          };
        });

        setHotels(mappedHotels);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching hotel recommendations:", error.message);
        setError(error.message);

        console.log("Falling back to mock hotel data");
        const mockHotels = [
          {
            id: "hotel1",
            name: "Grand City Hotel",
            rating: 4.7,
            price: "$250/night",
            imageUrl: "/api/placeholder/300/200",
            description: "Luxury hotel in the heart of downtown with amazing city views.",
          },
          {
            id: "hotel2",
            name: "Riverside Inn",
            rating: 4.5,
            price: "$180/night",
            imageUrl: "/api/placeholder/300/200",
            description: "Charming boutique hotel located near major attractions.",
          },
          {
            id: "hotel3",
            name: "Urban Suites",
            rating: 4.8,
            price: "$320/night",
            imageUrl: "/api/placeholder/300/200",
            description: "Modern all-suite hotel with kitchenettes, perfect for extended stays.",
          },
          {
            id: "hotel4",
            name: "Skyline Lodge",
            rating: 4.6,
            price: "$220/night",
            imageUrl: "/api/placeholder/300/200",
            description: "Cozy lodge with stunning skyline views and excellent amenities.",
          },
          {
            id: "hotel5",
            name: "Ocean Breeze Hotel",
            rating: 4.9,
            price: "$350/night",
            imageUrl: "/api/placeholder/300/200",
            description: "Beachfront hotel with luxurious rooms and top-notch service.",
          },
          {
            id: "hotel6",
            name: "Mountain Retreat",
            rating: 4.4,
            price: "$190/night",
            imageUrl: "/api/placeholder/300/200",
            description: "A serene retreat nestled in the mountains, perfect for relaxation.",
          },
        ];

        setHotels(mockHotels);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [city, startDate, endDate]);

  const hotelsPerPage = 3; // Show 3 hotels at a time
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1));
  };

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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={`star-${i}`}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={`star-half-${i}`}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={`star-empty-${i}`}
            className="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  // Calculate the starting index for the current set of hotels
  const startIndex = currentIndex * hotelsPerPage;
  const displayedHotels = hotels.slice(startIndex, startIndex + hotelsPerPage);

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div className="flex">
          {displayedHotels.map((hotel) => (
            <div key={hotel.id} className="w-1/3 flex-shrink-0 px-3">
              <div className="bg-gray-700 rounded-lg p-6 text-center shadow-lg">
                <div className="relative h-32 w-32 mx-auto mb-4">
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-teal-400 mb-2">{hotel.name}</h3>
                <div className="flex justify-center items-center mb-3">
                  {renderStars(hotel.rating)}
                  <span className="ml-2 text-gray-300 text-sm">{hotel.rating}/5</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{hotel.description}</p>
                <p className="text-teal-400 font-semibold mb-4">{hotel.price}</p>
                <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-colors text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots for Navigation */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full mx-1 ${
              currentIndex === index ? "bg-teal-400" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TravelPlanPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityFromParams = params.city as string;

  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isBlurred, setIsBlurred] = useState(true); // Default to blurred

  const [localStorageData, setLocalStorageData] = useState<{
    city: string;
    startDate: string;
    endDate: string;
  }>({ city: "", startDate: "", endDate: "" });

  const fetchCityImage = async (city: string) => {
    if (!city) {
      console.error("No city provided for image fetch");
      setBackgroundImage("");
      return;
    }

    try {
      const response = await fetch(`/api/getCityImage?city=${encodeURIComponent(city)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Response is not JSON. Content-Type: ${contentType}`);
      }
      const data = await response.json();
      setBackgroundImage(data.imageUrl);
      console.log("Background image set to:", data.imageUrl);
    } catch (error) {
      console.error("Error fetching city image:", error);
      setBackgroundImage("");
    }
  };

  useEffect(() => {
    if (!cityFromParams) return;

    // Check for unblur query parameter from payment success redirect
    const shouldUnblur = searchParams.get("unblur") === "true";
    setIsBlurred(!shouldUnblur); // If unblur=true, set isBlurred to false

    // Load city, startDate, and endDate from localStorage
    const storedCity = localStorage.getItem("city") || "";
    const storedStartDate = localStorage.getItem("start_date") || "";
    const storedEndDate = localStorage.getItem("end_date") || "";

    console.log("Stored values:", { storedCity, storedStartDate, storedEndDate });

    setLocalStorageData({
      city: storedCity,
      startDate: storedStartDate,
      endDate: storedEndDate,
    });

    const fetchData = async () => {
      try {
        console.log(`Fetching travel plan for city: ${cityFromParams}`);

        const response = await fetch(`http://localhost:5000/api/get-travel-plan?city=${cityFromParams}`);
        if (!response.ok) throw new Error("Failed to fetch travel plan");

        const data = await response.json();
        setTravelPlan(data);
      } catch (error: any) {
        console.error("Error fetching travel plan:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCityImage(cityFromParams);
    fetchData();
  }, [cityFromParams, searchParams]);

  const handleUnblur = () => {
    router.push(`/travel-packages/${cityFromParams}`);
  };

  const handleDownload = () => {
    if (isBlurred) {
      alert("Please purchase a package to unblur and print the itinerary.");
      router.push(`/travel-packages/${cityFromParams}`);
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to print the itinerary.");
      return;
    }

    // Get the entire HTML content of the page
    const pageContent = document.documentElement.outerHTML;

    // Get all stylesheets
    const stylesheets = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          console.warn("Cannot access stylesheet:", e);
          return '';
        }
      })
      .join('\n');

    // Write the content to the print window
    printWindow.document.write(`
      <html>
        <head>
          <title>Travel Plan for ${cityFromParams}</title>
          <style>${stylesheets}</style>
        </head>
        <body>
          ${pageContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleShare = () => {
    if (isBlurred) {
      alert("Please purchase a package to unblur and share the plan.");
      router.push(`/travel-packages/${cityFromParams}`);
      return;
    }
    const shareUrl = `${window.location.origin}/travel-plan/${cityFromParams}`;
    const shareText = `Check out my travel plan for ${cityFromParams}: ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: `Travel Plan for ${cityFromParams}`,
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      const shareOptions = [
        {
          name: "WhatsApp",
          url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
        },
        {
          name: "Email",
          url: `mailto:?subject=Travel Plan for ${cityFromParams}&body=${encodeURIComponent(shareText)}`,
        },
        {
          name: "Copy Link",
          action: () => {
            navigator.clipboard.writeText(shareUrl).then(() => {
              alert("Link copied to clipboard!");
            });
          },
        },
      ];

      const handleOptionClick = (option) => {
        if (option.action) {
          option.action();
        } else {
          window.open(option.url, "_blank");
        }
      };

      const selectedOption = prompt(
        "Select sharing method:\n" +
        shareOptions.map((opt, index) => `${index + 1}. ${opt.name}`).join("\n")
      );
      if (selectedOption !== null) {
        const index = parseInt(selectedOption) - 1;
        if (shareOptions[index]) {
          handleOptionClick(shareOptions[index]);
        } else {
          alert("Invalid selection!");
        }
      }
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const city = localStorageData.city || travelPlan?.city || cityFromParams || "";
  const startDate = localStorageData.startDate || travelPlan?.start_date || "";
  const endDate = localStorageData.endDate || travelPlan?.end_date || "";

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

  if (!city || !startDate || !endDate) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Missing Information</h2>
          <p className="text-gray-300">Please select a city and valid date range from the homepage.</p>
          <button
            className="mt-6 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-colors"
            onClick={() => router.push("/")}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const planData = travelPlan && typeof travelPlan.travel_plan === "string"
    ? JSON.parse(travelPlan.travel_plan)
    : travelPlan?.travel_plan || { itinerary: [], travel_tips: "", local_food_recommendations: "", estimated_costs: "" };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateForApi = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const startDateForApi = formatDateForApi(startDate);
  const endDateForApi = formatDateForApi(endDate);

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <div
        className="relative py-16 mb-8 shadow-md bg-cover bg-center"
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-4xl mx-auto px-6 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-teal-400">{city}</h1>
          <p className="text-lg text-gray-300">
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <p className={isBlurred ? "text-gray-300 leading-relaxed blur-sm" : "text-gray-300 leading-relaxed"}>
            {travelPlan?.city_description || "Explore the wonders of this destination!"}
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-teal-400 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Your Itinerary
          </h2>

          <div className="space-y-6">
            {planData.itinerary.map((dayPlan: ItineraryDay, index: number) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-teal-900 px-6 py-3">
                  <h3 className="font-bold text-xl">{dayPlan.day}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-400 mb-1">Morning</h4>
                      <p className={index === 0 ? "text-gray-300" : isBlurred ? "text-gray-300 blur-sm" : "text-gray-300"}>
                        {dayPlan.morning}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-400 mb-1">Afternoon</h4>
                      <p className={index === 0 ? "text-gray-300" : isBlurred ? "text-gray-300 blur-sm" : "text-gray-300"}>
                        {dayPlan.afternoon}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-400 mb-1">Evening</h4>
                      <p className={index === 0 ? "text-gray-300" : isBlurred ? "text-gray-300 blur-sm" : "text-gray-300"}>
                        {dayPlan.evening}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Travel Tips
            </h2>
            <p className={isBlurred ? "text-gray-300 leading-relaxed blur-sm" : "text-gray-300 leading-relaxed"}>
              {planData.travel_tips || "No travel tips available."}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Local Food
            </h2>
            <p className={isBlurred ? "text-gray-300 leading-relaxed blur-sm" : "text-gray-300 leading-relaxed"}>
              {planData.local_food_recommendations || "No food recommendations available."}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-teal-400 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Hotel Recommendations
          </h2>
          <div className={isBlurred ? "blur-sm" : ""}>
            <HotelRecommendations
              city={city}
              startDate={startDateForApi}
              endDate={endDateForApi}
            />
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Estimated Costs
          </h2>
          <p className={isBlurred ? "text-gray-300 leading-relaxed blur-sm" : "text-gray-300 leading-relaxed"}>
            {planData.estimated_costs || "No cost estimates available."}
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-md transition-colors shadow-lg flex items-center"
            onClick={handleDownload}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Print Itinerary
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md transition-colors shadow-lg flex items-center"
            onClick={handleShare}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share Plan
          </button>
          {isBlurred ? (
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-md transition-colors shadow-lg flex items-center"
              onClick={handleUnblur}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Unblur Plan
            </button>
          ) : (
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md transition-colors shadow-lg flex items-center"
              onClick={handleBackToHome}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}