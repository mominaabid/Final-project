"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { city } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to TravelPlanPage with unblur=true
      router.push(`/travel-plan/${city}?unblur=true`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [city, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <svg
          className="w-16 h-16 text-teal-400 mx-auto mb-4"
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
        <h2 className="text-2xl font-bold text-teal-400 mb-4">Payment Successful!</h2>
        <p className="text-gray-300 mb-6">
          Your payment has been processed successfully. You will be redirected to your travel plan in a few seconds...
        </p>
        <div className="animate-pulse text-teal-400">
          Redirecting to {city} travel plan...
        </div>
      </div>
    </div>
  );
}