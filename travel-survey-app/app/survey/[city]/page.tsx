"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SurveyPage() {
  const { city } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<{ question: string; options: string[] }[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city) fetchSurveyQuestions();
  }, [city]);

  const fetchSurveyQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/get_survey_questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching survey questions:", error);
    }
    setLoading(false);
  };


  const handleOptionSelect = (question: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question]: option,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/submit_survey_answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          start_date: localStorage.getItem("start_date"),  
          end_date: localStorage.getItem("end_date"),
          selected_activities: JSON.parse(localStorage.getItem("selected_activities") || "[]"),
          survey_responses: Object.entries(selectedAnswers).map(([question, selected_option]) => ({
            question,
            selected_option
          })),
        }),
      });
  
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      console.log("Survey submitted:", data);
       router.push(`/travel-plan/${city}`);
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };
  
  
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Survey for {city || "Unknown City"}</h2>

      {loading ? (
        <p className="text-center">Loading survey questions...</p>
      ) : (
        <div className="space-y-6">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">{q.question}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {q.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        selectedAnswers[q.question] === option
                          ? "bg-yellow-400 text-black"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                      onClick={() => handleOptionSelect(q.question, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No questions available.</p>
          )}

          {questions.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white py-3 rounded-md mt-4 hover:bg-green-600 font-bold text-lg"
            >
              Submit Answers
            </button>
          )}
        </div>
      )}
    </div>
  );
}
