"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Packages = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const router = useRouter();

  const packages = [
    { name: "Basic Plan", price: "$10", description: "Unlock full itinerary for this trip." },
    { name: "Premium Plan", price: "$20", description: "Full itinerary + priority support." },
    { name: "VIP Plan", price: "$50", description: "Full itinerary + premium services & recommendations." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-blue-500 to-green-500 text-white p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-6">Choose Your Package</h1>

        <div className="space-y-4">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              onClick={() => setSelectedPackage(pkg.name)}
              className={`cursor-pointer p-6 rounded-lg transition ${
                selectedPackage === pkg.name
                  ? "bg-white text-teal-600 shadow-lg"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <h2 className="text-2xl font-semibold">{pkg.name}</h2>
              <p className="text-lg">{pkg.description}</p>
              <p className="text-xl font-bold mt-2">{pkg.price}</p>
            </motion.div>
          ))}
        </div>

        {selectedPackage && (
          <button
            onClick={() => router.push("/payment")}
            className="mt-6 w-full bg-white text-teal-600 font-semibold py-3 rounded-lg transition hover:bg-teal-700 hover:text-white"
          >
            Proceed to Payment
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Packages;
