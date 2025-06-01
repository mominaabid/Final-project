"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SurveyPage() {
  const { city } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<{ question: string; options: string[] }[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true); // Loader state for initial fetch
  const [submitLoading, setSubmitLoading] = useState(false); // Loader state for submission
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState("/mountains.jpg");

  useEffect(() => {
    if (city) fetchSurveyQuestions();
    const storedImage = localStorage.getItem("backgroundImage") || "/mountains.jpg";
    setBackgroundImage(storedImage);
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
      alert("Failed to fetch survey questions. Redirecting...");
      router.push(`/city/${city}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (question: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question]: option,
    }));
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 400);
    }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
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
            selected_option,
          })),
        }),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      console.log("Survey submitted:", data);
      await router.push(`/travel-plan/${city}`);
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey. Please try again.");
      setSubmitLoading(false);
    }
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (direction === "next" && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const progress = questions.length > 0 ? (Object.keys(selectedAnswers).length / questions.length) * 100 : 0;

  const isQuestionAnswered = (questionIndex: number) => {
    return questionIndex < questions.length && selectedAnswers[questions[questionIndex].question] !== undefined;
  };

  const cityName = city ? city.charAt(0).toUpperCase() + city.slice(1) : "Unknown City";

  const getQuestionCategory = (question: string): string => {
    const lowercaseQuestion = question.toLowerCase();
    if (lowercaseQuestion.includes("food") || lowercaseQuestion.includes("restaurant") || lowercaseQuestion.includes("eat") || lowercaseQuestion.includes("cuisine")) {
      return "food";
    } else if (lowercaseQuestion.includes("activity") || lowercaseQuestion.includes("things to do")) {
      return "activities";
    } else if (lowercaseQuestion.includes("budget") || lowercaseQuestion.includes("price") || lowercaseQuestion.includes("cost") || lowercaseQuestion.includes("spend")) {
      return "budget";
    } else if (lowercaseQuestion.includes("comfort") || lowercaseQuestion.includes("luxury") || lowercaseQuestion.includes("accommodation") || lowercaseQuestion.includes("hotel")) {
      return "comfort";
    } else if (lowercaseQuestion.includes("transport") || lowercaseQuestion.includes("travel") || lowercaseQuestion.includes("getting around")) {
      return "transportation";
    } else if (lowercaseQuestion.includes("sightseeing") || lowercaseQuestion.includes("landmark") || lowercaseQuestion.includes("attraction")) {
      return "sightseeing";
    } else if (lowercaseQuestion.includes("adventure") || lowercaseQuestion.includes("outdoor") || lowercaseQuestion.includes("hiking") || lowercaseQuestion.includes("extreme")) {
      return "adventure";
    } else if (lowercaseQuestion.includes("shopping") || lowercaseQuestion.includes("souvenir")) {
      return "shopping";
    } else {
      return "general";
    }
  };

  const getQuestionIcon = (question: string) => {
    const category = getQuestionCategory(question);
    const iconVariants = {
      food: {
        initial: { rotate: -10, scale: 0.8 },
        animate: {
          rotate: [0, 10, 0, 10, 0],
          scale: [1, 1.1, 1, 1.1, 1],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 3 },
        },
      },
      activities: {
        initial: { y: 10, opacity: 0.6 },
        animate: {
          y: [0, -5, 0],
          opacity: [1, 0.8, 1],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 2 },
        },
      },
      budget: {
        initial: { scale: 0.8, opacity: 0.6 },
        animate: {
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 1.5 },
        },
      },
      comfort: {
        initial: { scale: 0.8 },
        animate: {
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 2.5 },
        },
      },
      transportation: {
        initial: { x: -10 },
        animate: {
          x: [0, 10, 0],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 2 },
        },
      },
      sightseeing: {
        initial: { rotate: -5, scale: 0.9 },
        animate: {
          rotate: [0, 5, 0],
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 3 },
        },
      },
      adventure: {
        initial: { scale: 0.8, rotate: -5 },
        animate: {
          scale: [1, 1.15, 1],
          rotate: [0, 5, 0],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 1.5 },
        },
      },
      shopping: {
        initial: { y: 5, scale: 0.9 },
        animate: {
          y: [0, -5, 0],
          scale: [1, 1.1, 1],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 2 },
        },
      },
      general: {
        initial: { scale: 0.9, opacity: 0.8 },
        animate: {
          scale: [1, 1.05, 1],
          opacity: [1, 0.9, 1],
          transition: { repeat: Infinity, repeatType: "mirror", duration: 3 },
        },
      },
    };

    switch (category) {
      case "food":
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.food.initial} animate={iconVariants.food.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M5 8h11v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8V4M8 8V4M16 8V4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
      case "activities":
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.activities.initial} animate={iconVariants.activities.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 22h5a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-5M9 16V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 16h5M16 8h3M16 12h3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
      case "budget":
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.budget.initial} animate={iconVariants.budget.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 6v12M8 10h8M9 14h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
      case "comfort":
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.comfort.initial} animate={iconVariants.comfort.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
      case "transportation":
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.transportation.initial} animate={iconVariants.transportation.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 3H8v13h8V3z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8H8M6 21h12M7 16H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3M17 16h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
      case "sightseeing":
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.sightseeing.initial} animate={iconVariants.sightseeing.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.188 10.9A8.18 8.18 0 0 0 17.77 6.78a8.06 8.06 0 0 0-9.54 0 8.18 8.18 0 0 0-2.4 4.15A8.15 8.15 0 0 0 5.8 11 8.17 8.17 0 0 0 6.82 16a8.07 8.07 0 0 0 2.96 2.96 8.08 8.08 0 0 0 10.45-2.97 8.17 8.17 0 0 0 1-5.10 8.15 8.15 0 0 0-1.03.01z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.5 6.5l.5 .5M6.5 6.5l-.5 .5M6.5 17.5l-.5 -.5M17.5 17.5l.5 -.5M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
      case "adventure":
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.adventure.initial} animate={iconVariants.adventure.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
      case "shopping":
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.shopping.initial} animate={iconVariants.shopping.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
      default:
        return (
          <motion.div className="w-16 h-16 flex items-center justify-center mb-4" initial={iconVariants.general.initial} animate={iconVariants.general.animate}>
            <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        );
    }
  };

  const getQuestionLoader = (question: string) => {
    const category = getQuestionCategory(question);
    switch (category) {
      case "food":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex justify-center items-center">
              <motion.div animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1M5 8h11v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8V4M8 8V4M16 8V4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
            <p className="text-teal-400 mt-2">Loading culinary preferences...</p>
          </div>
        );
      case "activities":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex justify-center items-center">
              <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 22h5a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-5M9 16V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 16h5M16 8h3M16 12h3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
            <p className="text-teal-400 mt-2">Loading activities and fun...</p>
          </div>
        );
      case "budget":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex justify-center items-center">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 6v12M8 10h8M9 14h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
            <p className="text-teal-400 mt-2">Loading budget options...</p>
          </div>
        );
      case "comfort":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex justify-center items-center">
              <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 3, 0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
            <p className="text-teal-400 mt-2">Loading comfort preferences...</p>
          </div>
        );
      case "transportation":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex justify-center items-center">
              <motion.div animate={{ x: [-10, 10, -10], scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3H8v13h8V3z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 8H8M6 21h12M7 16H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3M17 16h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
            <p className="text-teal-400 mt-2">Loading transportation options...</p>
          </div>
        );
      case "sightseeing":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex justify-center items-center">
              <motion.div animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ rotate: { repeat: Infinity, duration: 3 }, scale: { repeat: Infinity, duration: 1.5 } }}>
                <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.188 10.9A8.18 8.18 0 0 0 17.77 6.78a8.06 8.06 0 0 0-9.54 0 8.18 8.18 0 0 0-2.4 4.15A8.15 8.15 0 0 0 5.8 11 8.17 8.17 0 0 0 6.82 16a8.07 8.07 0 0 0 2.96 2.96 8.08 8.08 0 0 0 10.45-2.97 8.17 8.17 0 0 0 1-5.10 8.15 8.15 0 0 0-1.03.01z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
            <p className="text-teal-400 mt-2">Loading sightseeing spots...</p>
          </div>
        );
      case "adventure":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex justify-center items-center">
              <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 5, 0, -5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
            <p className="text-teal-400 mt-2">Loading adventure options...</p>
          </div>
        );
      case "shopping":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex justify-center items-center">
              <motion.div animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                <svg className="w-10 h-10 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
            <p className="text-teal-400 mt-2">Loading shopping preferences...</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-teal-400 mt-2">Loading your questions...</p>
          </div>
        );
    }
  };

  const getOptionVariants = (question: string) => {
    const category = getQuestionCategory(question);
    switch (category) {
      case "food":
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          whileHover: { scale: 1.05, backgroundColor: "rgba(20, 184, 166, 0.2)" },
          whileTap: { scale: 0.98 },
          transition: { type: "spring", stiffness: 400, damping: 20 },
          exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
        };
      case "activities":
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          whileHover: { scale: 1.03, x: 5, backgroundColor: "rgba(20, 184, 166, 0.2)" },
          whileTap: { scale: 0.97 },
          transition: { type: "spring", stiffness: 300, damping: 25 },
          exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
        };
      case "budget":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          whileHover: { scale: 1.04, backgroundColor: "rgba(20, 184, 166, 0.15)" },
          whileTap: { scale: 0.96 },
          transition: { type: "spring", stiffness: 500, damping: 15 },
          exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
        };
      case "comfort":
        return {
          initial: { opacity: 0, y: 15, rotateX: 15 },
          animate: { opacity: 1, y: 0, rotateX: 0 },
          whileHover: { y: -5, backgroundColor: "rgba(17, 192, 172, 0.2)" },
          whileTap: { y: 0 },
          transition: { type: "spring", stiffness: 350, damping: 25 },
          exit: { opacity: 0, y: -15, rotateX: -15, transition: { duration: 0.2 } },
        };
      case "transportation":
        return {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          whileHover: { x: 5, backgroundColor: "rgba(20, 184, 166, 0.15)" },
          whileTap: { x: 2 },
          transition: { type: "spring", stiffness: 300, damping: 20 },
          exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
        };
      case "sightseeing":
        return {
          initial: { opacity: 0, scale: 0.8, rotate: -1 },
          animate: { opacity: 1, scale: 1, rotate: 0 },
          whileHover: { scale: 1.03, rotate: 1, backgroundColor: "rgba(20, 184, 166, 0.2)" },
          whileTap: { scale: 0.97, rotate: 0 },
          transition: { type: "spring", stiffness: 400, damping: 15 },
          exit: { opacity: 0, scale: 0.8, rotate: 1, transition: { duration: 0.2 } },
        };
      case "adventure":
        return {
          initial: { opacity: 0, y: 25, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          whileHover: { scale: 1.06, y: -3, backgroundColor: "rgba(20, 184, 166, 0.25)" },
          whileTap: { scale: 0.97, y: 0 },
          transition: { type: "spring", stiffness: 450, damping: 15 },
          exit: { opacity: 0, y: -25, scale: 0.95, transition: { duration: 0.2 } },
        };
      case "shopping":
        return {
          initial: { opacity: 0, y: 15, x: 10 },
          animate: { opacity: 1, y: 0, x: 0 },
          whileHover: { y: -3, x: 3, backgroundColor: "rgba(20, 184, 166, 0.15)" },
          whileTap: { y: 0, x: 0 },
          transition: { type: "spring", stiffness: 350, damping: 20 },
          exit: { opacity: 0, y: -15, x: -10, transition: { duration: 0.2 } },
        };
      default:
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          whileHover: { scale: 1.02, backgroundColor: "rgba(20, 184, 166, 0.1)" },
          whileTap: { scale: 0.98 },
          transition: { type: "spring", stiffness: 300, damping: 25 },
          exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
        };
    }
  };

  const SVGLoader = () => (
    <motion.div
      className="fixed inset-0 bg-gray-900/95 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <svg className="svg-calLoader" xmlns="http://www.w3.org/2000/svg" width="230" height="230">
          <path
            className="cal-loaderpath"
            d="M86.429 40c63.616-20.04 101.511 25.08 107.265 61.93 6.487 41.54-18.593 76.99-50.6 87.643-59.46 19.791-101.262-23.577-107.142-62.616C29.398 83.441 59.945 48.343 86.43 40z"
            fill="none"
            stroke="#0099cc"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 10 10 10 10 10 10 432"
            strokeDashoffset="77"
          />
          <path
            className="cal-loaderplane"
            d="M141.493 37.93c-1.087-.927-2.942-2.002-4.32-2.501-2.259-.824-3.252-.955-9.293-1.172-4.017-.146-5.197-.23-5.47-.37-.766-.407-1.526-1.448-7.114-9.773-4.8-7.145-5.344-7.914-6.327-8.976-1.214-1.306-1.396-1.378-3.79-1.473-1.036-.04-2-.043-2.153-.002-.353.1-.87.586-1 .952-.139.399-.076.71.431 2.22.241.72 1.029 3.386 1.742 5.918 1.644 5.844 2.378 8.343 2.863 9.705.206.601.33 1.1.275 1.125-.24.097-10.56 1.066-11.014 1.032a3.532 3.532 0 0 1-1.002-.276l-.487-.246-2.044-2.613c-2.234-2.87-2.228-2.864-3.35-3.309-.717-.287-2.82-.386-3.276-.163-.457.237-.727.644-.737 1.152-.018.39.167.805 1.916 4.373 1.06 2.166 1.964 4.083 1.998 4.27.04.179.004.521-.076.75-.093.228-1.109 2.064-2.269 4.088-1.921 3.34-2.11 3.711-2.123 4.107-.008.25.061.557.168.725.328.512.72.644 1.966.676 1.32.029 2.352-.236 3.05-.762.222-.171 1.275-1.313 2.412-2.611 1.918-2.185 2.048-2.32 2.45-2.505.241-.111.601-.232.82-.271.267-.058 2.213.201 5.912.8 3.036.48 5.525.894 5.518.914 0 .026-.121.306-.27.638-.54 1.198-1.515 3.842-3.35 9.021-1.029 2.913-2.107 5.897-2.4 6.62-.703 1.748-.725 1.833-.594 2.286.137.46.45.833.872 1.012.41.177 3.823.24 4.37.085.852-.25 1.44-.688 2.312-1.724 1.166-1.39 3.169-3.948 6.771-8.661 5.8-7.583 6.561-8.49 7.387-8.702.233-.065 2.828-.056 5.784.011 5.827.138 6.64.09 8.62-.5 2.24-.67 4.035-1.65 5.517-3.016 1.136-1.054 1.135-1.014.207-1.962-.357-.38-.767-.777-.902-.893z"
            fill="#000033"
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-teal-400 text-xl font-medium mt-4"
        >
          Loading your travel survey...
        </motion.div>
      </div>
    </motion.div>
  );

  const renderCurrentQuestion = () => {
    if (loading || questions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          {loading && questions.length > 0 && currentQuestionIndex < questions.length ? getQuestionLoader(questions[currentQuestionIndex].question) : (
            <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const optionAnimationVariants = getOptionVariants(currentQuestion.question);

    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          {getQuestionIcon(currentQuestion.question)}
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-200">{currentQuestion.question}</h2>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={option}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAnswers[currentQuestion.question] === option ? "bg-teal-100 border-teal-400" : "bg-gray-800 border-gray-200 hover:border-teal-300"}`}
                onClick={() => handleOptionSelect(currentQuestion.question, option)}
                initial={optionAnimationVariants.initial}
                animate={optionAnimationVariants.animate}
                whileHover={optionAnimationVariants.whileHover}
                whileTap={optionAnimationVariants.whileTap}
                exit={optionAnimationVariants.exit}
                transition={{ ...optionAnimationVariants.transition, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${selectedAnswers[currentQuestion.question] === option ? "bg-teal-400 border-teal-400" : "border-gray-300"} mr-3`}>
                    {selectedAnswers[currentQuestion.question] === option && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                    )}
                  </div>
                  <span className="text-gray-300">{option}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <AnimatePresence>
        {loading && <SVGLoader />}
      </AnimatePresence>
      {!loading && (
        <div className="relative z-10 w-full max-w-4xl mx-auto bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-teal-300">Travel Survey for {cityName}</h1>
            <p className="text-gray-400 mt-2">Help us customize your perfect itinerary</p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
            <motion.div className="bg-teal-400 h-2.5 rounded-full" initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}></motion.div>
          </div>
          <div className="flex justify-between mb-6 text-sm text-gray-500">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-teal-300">{Math.round(progress)}% Complete</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="mb-8">
              {renderCurrentQuestion()}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigateQuestion("prev")}
              disabled={currentQuestionIndex === 0}
              className={`px-5 py-2.5 rounded-lg transition-colors ${currentQuestionIndex === 0 ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-700 border border-teal-400 text-teal-300 hover:bg-teal-600"}`}
            >
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => navigateQuestion("next")}
                disabled={!isQuestionAnswered(currentQuestionIndex)}
                className={`px-5 py-2.5 rounded-lg transition-colors ${!isQuestionAnswered(currentQuestionIndex) ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-teal-400 text-white hover:bg-teal-500"}`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isQuestionAnswered(currentQuestionIndex) || submitLoading}
                className={`px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center ${!isQuestionAnswered(currentQuestionIndex) || submitLoading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-teal-400 text-white hover:bg-teal-500"}`}
              >
                {submitLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></motion.div>
                ) : (
                  "Generate travel plan"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}