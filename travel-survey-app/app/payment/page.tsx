"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/confirmation");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-teal-500 text-white p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-6">Select Payment Method</h1>

        <div className="space-y-4">
          {["Credit Card", "PayPal", "Google Pay"].map((method, index) => (
            <motion.div
              key={index}
              onClick={() => setPaymentMethod(method)}
              className={`cursor-pointer p-6 rounded-lg transition ${
                paymentMethod === method
                  ? "bg-white text-green-600 shadow-lg"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <h2 className="text-2xl font-semibold">{method}</h2>
            </motion.div>
          ))}
        </div>

        {paymentMethod && (
          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-white text-green-600 font-semibold py-3 rounded-lg transition hover:bg-green-700 hover:text-white"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Payment;
