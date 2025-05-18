"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Facebook } from "lucide-react";

// Initialize Stripe with your public key (use environment variable in production)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51R0kOcB9agy1awEbArALohIYrsimLkp466JWJgq80DOCpmTh5cGW8xNBnmDEDsS4lWtjjgEeleJjzxPq0GFChEJA00Ab2rht9V"
);

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

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isVisible, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSignInComplete, setIsSignInComplete] = useState(false);
  const [error, setError] = useState("");

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      
      setShowPopup(true);
      setIsSignInComplete(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred during login. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleNextClick = () => {
    if (isSignInComplete) {
      onLoginSuccess(email);
    } else {
      console.error("Sign-in not completed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[22rem] p-6 min-h-[35rem] relative">
        <button onClick={onClose} className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <h2 className="text-2xl font-bold text-center text-black mb-4">Welcome Back</h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-black mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className="text-xs text-green-600 hover:text-green-800 block mt-1 underline">Forgot your password?</a>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-gray-600 text-white px-3 py-2 rounded-md font-medium hover:shadow-lg transform transition-all hover:scale-105 active:scale-95 text-sm"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-black">Or continue with</span>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <button className="w-full text-black flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md transition-all duration-200 hover:bg-gray-600 hover:text-white hover:border-transparent group text-sm">
            <svg className="w-4 h-4 text-green-600 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
              <path d="M24 3C12.972 3 4 11.972 4 23s8.972 20 20 20 20-8.972 20-20S35.028 3 24 3zm0 36.2C13.972 39.2 6.8 32.028 6.8 23S13.972 6.8 24 6.8 41.2 13.972 41.2 23 34.028 39.2 24 39.2z" />
              <path d="M22.928 23h-7.128v2.4h4.488c-.528 1.2-1.68 2.4-3.312 3.192L19.2 32C21.68 30.8 23.68 28.728 24.4 25.6H22.928z" />
            </svg>
            <span>Continue with Google</span>
          </button>
          <button className="w-full flex items-center text-black justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md transition-all duration-200 hover:bg-gray-600 hover:text-white hover:border-transparent group text-sm">
            <Facebook className="w-4 h-4 text-green-600 group-hover:text-white" />
            <span>Continue with Facebook</span>
          </button>
        </div>
        <div className="text-center space-y-2 mb-4">
          <div className="text-gray-600 text-xs">
            Don't have an account?{" "}
            <button className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-black font-medium underline text-xs">Sign up</button>
          </div>
        </div>
        <div className="flex justify-between gap-2 mt-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 text-sm"
          >
            Back
          </button>
          <button
            onClick={handleNextClick}
            disabled={!isSignInComplete}
            className={`flex-1 px-3 py-2 rounded-md text-white transition-all duration-200 ${
              isSignInComplete
                ? "bg-gradient-to-r from-green-600 to-gray-600 hover:shadow-lg hover:scale-95 active:scale-90"
                : "bg-gray-400 cursor-not-allowed"
            } text-sm`}
          >
            Next
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-md shadow-lg text-xs">
          Login completed successfully!
        </div>
      )}
    </div>
  );
};

export default function TravelPackagesPage() {
  const params = useParams();
  const router = useRouter();
  const city = params.city as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
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
              "Standard attractions",
            ],
            popularity: "high",
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
              "Priority customer support",
            ],
            popularity: "medium",
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
              "Personalized souvenir guide",
            ],
            popularity: "low",
          },
        ];

        setPackages(mockPackages);

        const mockTestimonials: Testimonial[] = [
          {
            name: "John Doe",
            text: "The Essential Explorer package was perfect for my weekend getaway! It covered all the must-see spots and I had a great time exploring the city.",
            imageUrl: "/john-doe.jpg",
          },
          {
            name: "Sarah Smith",
            text: "The Premium Explorer package took my trip to the next level! The hidden gems and personalized itinerary made all the difference.",
            imageUrl: "/sarah-smith.jpg",
          },
          {
            name: "Alex Johnson",
            text: "I splurged on the Luxury Experience package and it was totally worth it! From VIP access to luxury dining, this was the best trip I've ever had.",
            imageUrl: "/alex-johnson.jpg",
          },
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

  const handlePurchase = async (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowLogin(true);
  };

  const handleLoginSuccess = async (email: string) => {
    if (!selectedPackage) {
      setError("No package selected");
      setShowLogin(false);
      return;
    }

    setLoadingPackageId(selectedPackage.id);
    setError("");
    try {
      const priceInCents = Math.round(selectedPackage.price * 100);
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          packagePrice: priceInCents,
          city,
          currency: "usd",
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      const { sessionId } = data;

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }

      // Store login info in localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("selectedPackage", JSON.stringify(selectedPackage));

      // Redirect to TravelPlanPage with unblurred content
      router.push(`/travel-plan/${city}`);
    } catch (error: any) {
      console.error("Error initiating checkout:", error);
      setError(error.message || "An error occurred during checkout. Please try again.");
    } finally {
      setLoadingPackageId(null);
      setSelectedPackage(null);
      setShowLogin(false);
    }
  };

  const renderPopularityBadge = (popularity: "low" | "medium" | "high") => {
    switch (popularity) {
      case "high":
        return (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        );
      case "medium":
        return (
          <span className="bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium">
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
    const interval = setInterval(goToNextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-4 border-b-4 border-green-400 rounded-full animate-spin mb-4"></div>
          <p className="text-green-400 text-lg">Loading available packages...</p>
        </div>
      </div>
    );
  }

  if (error && !loadingPackageId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-300">Error: {error}</p>
          <button
            className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-green-400">
            Travel Packages for {city}
          </h1>
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
              className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg border transition-colors transform hover:scale-105 ${
                selectedPackage?.id === pkg.id
                  ? "border-green-500 bg-green-900/20"
                  : "border-gray-700 hover:border-green-500"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-green-400">{pkg.name}</h2>
                    <p className="text-gray-400 text-sm">{pkg.duration}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold text-white">${pkg.price}</span>
                    {renderPopularityBadge(pkg.popularity)}
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{pkg.description}</p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Features:</h3>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-400 mr-2 mt-0.5"
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

                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={loadingPackageId === pkg.id}
                  className={`w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center text-lg font-medium ${
                    loadingPackageId === pkg.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingPackageId === pkg.id ? (
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  ) : (
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
                  )}
                  {loadingPackageId === pkg.id ? "Processing..." : "Purchase Package"}
                </button>

                {loadingPackageId === pkg.id && (
                  <p className="text-green-400 mt-4">Redirecting to Stripe Checkout...</p>
                )}
                {error && selectedPackage?.id === pkg.id && (
                  <p className="text-red-500 mt-4">{error}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-green-400 mb-8">What Our Customers Say</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-between">
              <button
                onClick={goToPreviousTestimonial}
                className="bg-green-500 text-white p-3 rounded-full shadow-lg"
              >
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
              <button
                onClick={goToNextTestimonial}
                className="bg-green-500 text-white p-3 rounded-full shadow-lg"
              >
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
                  <h3 className="text-green-500 text-xl font-semibold">{testimonial.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isVisible={showLogin}
        onClose={() => {
          setShowLogin(false);
          setSelectedPackage(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}