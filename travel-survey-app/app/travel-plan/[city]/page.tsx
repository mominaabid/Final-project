"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const TravelPlan = () => {
  const [travelPlan, setTravelPlan] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTravelPlan = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get_travel_plan");
        const data = await response.json();
        const planArray = data.travel_plan.split("\n").filter(line => line.trim() !== "");
        setTravelPlan(planArray);
      } catch (error) {
        console.error("Error fetching travel plan:", error);
      }
    };

    fetchTravelPlan();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-green-500 to-teal-500 text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">
          Your Travel Adventure
        </h1>

        {travelPlan.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {travelPlan.slice(0, showAll ? travelPlan.length : 2).map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-xl"
              >
                <p className="text-lg">{day}</p>
              </motion.div>
            ))}

            {!showAll && (
              <button
                onClick={() => router.push("/packages")}
                className="mt-6 w-full bg-white text-blue-600 font-semibold py-3 rounded-lg transition hover:bg-blue-700 hover:text-white"
              >
                Unlock Full Itinerary
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-12"
          >
            <p className="text-xl text-white/80">Loading your adventure...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TravelPlan;
