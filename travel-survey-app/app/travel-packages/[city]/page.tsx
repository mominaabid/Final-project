"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
  features: string[];
  popularity: "low" | "medium" | "high";
}

interface Testimonial {
  name: string;
  text: string;
  imageUrl: string;
}

export default function TravelPackagesPage() {
  const params = useParams();
  const city = params.city as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Mock data for packages
        const mockPackages: Package[] = [
          {
            id: "basic",
            name: "Essential Explorer",
            price: 29.99,
            description: `See the best of ${city} with our basic package. Includes standard itinerary and minimal customization.`,
            duration: "Access for 30 days",
            features: [
              "Full itinerary access",
              "PDF download option",
              "Basic restaurant recommendations",
              "Standard attractions"
            ],
            popularity: "high"
          },
          {
            id: "premium",
            name: "Premium Explorer",
            price: 49.99,
            description: `Experience ${city} like a local with our premium package. Includes customized itinerary and off-the-beaten-path locations.`,
            duration: "Access for 60 days",
            features: [
              "Everything in Essential",
              "Customizable itinerary",
              "Hidden gem locations",
              "Premium restaurant bookings",
              "Transportation guidance",
              "Priority customer support"
            ],
            popularity: "medium"
          },
          {
            id: "luxury",
            name: "Luxury Experience",
            price: 99.99,
            description: `The ultimate ${city} experience. Fully personalized plans with exclusive access and VIP treatment.`,
            duration: "Lifetime access",
            features: [
              "Everything in Premium",
              "Personal travel assistant",
              "VIP attraction access",
              "Luxury dining reservations",
              "Hotel upgrade assistance",
              "24/7 travel support",
              "Personalized souvenir guide"
            ],
            popularity: "low"
          }
        ];

        setPackages(mockPackages);

        // Mock testimonials with image URLs pointing to the public folder
        const mockTestimonials: Testimonial[] = [
          {
            name: "John Doe",
            text: "The Essential Explorer package was perfect for my weekend getaway! It covered all the must-see spots and I had a great time exploring the city.",
            imageUrl: "/john-doe.jpg" // Image in the public folder
          },
          {
            name: "Sarah Smith",
            text: "The Premium Explorer package took my trip to the next level! The hidden gems and personalized itinerary made all the difference.",
            imageUrl: "/sarah-smith.jpg" // Image in the public folder
          },
          {
            name: "Alex Johnson",
            text: "I splurged on the Luxury Experience package and it was totally worth it! From VIP access to luxury dining, this was the best trip I've ever had.",
            imageUrl: "/alex-johnson.jpg" // Image in the public folder
          }
        ];

        setTestimonials(mockTestimonials);

        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching packages:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPackages();
  }, [city]);

  const renderPopularityBadge = (popularity: "low" | "medium" | "high") => {
    switch (popularity) {
      case "high":
        return (
          <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        );
      case "medium":
        return (
          <span className="bg-teal-700 text-white px-3 py-1 rounded-full text-xs font-medium">
            Popular
          </span>
        );
      default:
        return null;
    }
  };

  const goToNextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPreviousTestimonial = () => {
    setCurrentTestimonialIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    const interval = setInterval(goToNextTestimonial, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-4 border-b-4 border-teal-400 rounded-full animate-spin mb-4"></div>
          <p className="text-teal-400 text-lg">Loading available packages...</p>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Hero section */}
      <div className="bg-gray-800 py-16 mb-8 shadow-md">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-teal-400">Travel Packages for {city}</h1>
          <p className="text-lg text-gray-300">
            Choose the perfect package to enhance your {city} experience
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Package cards aligned horizontally */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-teal-500 transition-colors transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-teal-400">{pkg.name}</h2>
                    <p className="text-gray-400 text-sm">{pkg.duration}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold text-white">${pkg.price}</span>
                    {renderPopularityBadge(pkg.popularity)}
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{pkg.description}</p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-teal-400 mb-3">Features:</h3>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-teal-400 mr-2 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/checkout/${pkg.id}?city=${city}`}>
                  <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center text-lg font-medium">
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-1 0a1 1 0 110 2 1 1 0 010-2z"
                      />
                    </svg>
                    Purchase Package
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-teal-400 mb-8">What Our Customers Say</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-between">
              <button className="bg-teal-500 text-white p-3 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 rotate-180"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="bg-teal-500 text-white p-3 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="flex overflow-x-auto space-x-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-80 bg-gray-800 p-8 rounded-lg shadow-lg text-center"
                >
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full mx-auto mb-6"
                  />
                  <p className="text-gray-300 text-lg italic mb-4">"{testimonial.text}"</p>
                  <h3 className="text-teal-500 text-xl font-semibold">{testimonial.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
