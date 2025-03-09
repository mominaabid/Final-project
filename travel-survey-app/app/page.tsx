"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { useRouter } from 'next/navigation';


const Calendar = ({ onSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    return Array.from({ length: 42 }, (_, i) => {
      const day = i - firstDay + 1;
      if (day <= 0 || day > daysInMonth) return null;
      return new Date(year, month, day);
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleDateClick = (date) => {
    if (!date) return;
  
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      // Reset and start a new selection
      setSelectedRange({ start: date, end: null });
    } else {
      if (date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
      }
    }
  };
  
  const isDateInRange = (date) => {
    if (!date || !selectedRange.start || !selectedRange.end) return false;
    return date >= selectedRange.start && date <= selectedRange.end;
  };
  
  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => onClose()}
    >
      <div 
        className="bg-gray-800/90 backdrop-blur-lg rounded-xl p-6 max-w-3xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl text-white font-semibold">Select Dates</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[0, 1].map((offset) => {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset);
            const days = getDaysInMonth(monthDate);

            return (
              <div key={offset}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-medium">
                    {months[monthDate.getMonth()]} {monthDate.getFullYear()}
                  </h4>
                  {offset === 0 && (
                    <button onClick={prevMonth} className="text-white hover:text-gray-300">
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  {offset === 1 && (
                    <button onClick={nextMonth} className="text-white hover:text-gray-300">
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-center text-gray-400 text-sm py-2">
                      {day}
                    </div>
                  ))}
                  {days.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => handleDateClick(date)}
                      disabled={!date || date < new Date()} // Disable past dates
                      className={`
                        relative p-2 text-center text-sm rounded-lg transition-colors
                        ${!date ? 'invisible' : ''}
                        ${date < new Date() ? 'text-gray-600' : 'text-white'}
                        ${date?.getTime() === selectedRange.start?.getTime() ? 'bg-teal-500' : ''}
                        ${date?.getTime() === selectedRange.end?.getTime() ? 'bg-teal-700' : ''}
                        ${isDateInRange(date) ? 'bg-teal-300' : 'hover:bg-gray-700'}
                      `}
                    >
                      {date?.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-white">
            {selectedRange.start && selectedRange.end ? (
              <span>
                {formatDate(selectedRange.start)} - {formatDate(selectedRange.end)}
              </span>
            ) : (
              <span className="text-red-500">Select Dates</span> // Placeholder message
            )}
            {selectedRange.start && selectedRange.end && selectedRange.start.getTime() === selectedRange.end.getTime() && (
              <span className="text-red-500"> Invalid: Please select at least 1 day</span> // Invalid message
            )}
          </div>
          <div className="space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedRange.start && selectedRange.end && selectedRange.start.getTime() !== selectedRange.end.getTime()) {
                  onSelect(selectedRange);
                  onClose();
                } else {
                  alert("Please select a valid date range.");
                }
              }}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


export default function Home() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date()
  });
  const [travellers, setTravellers] = useState(1);
  const [country, setCountry] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('/mountains.jpg');
  const [isLoading, setIsLoading] = useState(false);
  const [countryChanged, setCountryChanged] = useState(false);
  
  const router = useRouter();
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 300]);
  const taglineY = useTransform(scrollY, [0, 500], [0, 200]);
  const formOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Unsplash API key
  const UNSPLASH_ACCESS_KEY = "6a8szXkr7McWwDJU0DBZQducZovKXOZApejKAk3qzLs"; // Replace with your actual Unsplash API key

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effect to fetch image when country changes and input is blurred
  useEffect(() => {
    if (country && countryChanged) {
      fetchCityImage(country);
      setCountryChanged(false);
    }
  }, [countryChanged]);

  const fetchCityImage = async (cityName) => {
    if (!cityName || cityName.trim() === "") return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`
      );
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Create a new image to preload
        const img = new Image();
        img.src = data.results[0].urls.regular;
        
        img.onload = () => {
          // Once image is loaded, update the background with animation
          setBackgroundImage(data.results[0].urls.regular);
          setIsLoading(false);
        };
        
        img.onerror = () => {
          console.error("Failed to load image");
          setIsLoading(false);
        };
      } else {
        console.log("No images found for this location");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching image from Unsplash:", error);
      setIsLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleCountryBlur = () => {
    if (country) {
      setCountryChanged(true);
    }
  };

  const handlePlanNow = async () => {
    if (!country) {
      alert("Please enter a country name");
      return;
    }
  
    const startDate = dateRange.start.toISOString().split("T")[0];
    const endDate = dateRange.end.toISOString().split("T")[0];
    
    console.log("Sending Data:", {
      city: country,
      start_date: startDate,
      end_date: endDate,
      travelers: travellers
    });
  
    try {
      const response = await fetch("http://127.0.0.1:5000/get_city_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: country,
          start_date: startDate,
          end_date: endDate,
          travelers: travellers
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.description && data.activities?.length > 0) {
        // Store city info and user input for the next screen
        localStorage.setItem("cityInfo", JSON.stringify({
          ...data,
          start_date: startDate,
          end_date: endDate,
          travelers: travellers
        }));
  
        // Store individual items in local storage too
        localStorage.setItem("city", country);
        localStorage.setItem("start_date", startDate);
        localStorage.setItem("end_date", endDate);
        localStorage.setItem("travelers", travellers.toString());
  
        // Navigate to the next page
        router.push(`/city/${country}`);
      } else {
        alert("No activities found for this city.");
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
      alert("Failed to fetch activities. Check the API or console for errors.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Hero Section with dynamic background */}
      <div 
        className="relative h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed transition-all duration-1000"
        style={{ 
          backgroundImage: `url('${backgroundImage}')`,
        }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="w-16 h-16 border-4 border-t-teal-500 border-teal-100/30 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

       {/* Navbar */}
       <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-1xl font-bold text-white tracking-widest"
              >
                Honest Travel
              </motion.h1>
              <div className="hidden md:flex space-x-8">
                {["Home", "About", "Packages"].map((item, index) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white hover:text-teal-400 transition"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white"
              >
                ☰
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 right-4 bg-black/90 backdrop-blur-md rounded-lg py-2 px-4 z-50 md:hidden"
            >
              {["Home", "About", "Packages"].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ x: 10 }}
                  className="py-2 text-white hover:text-teal-400 cursor-pointer"
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="relative z-10 px-4 text-center">
          <motion.div
            style={{ y: titleY }}
            className="mb-24"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold text-white tracking-wider mb-4"
            >
              DISCOVER
            </motion.h1>
            <motion.p
              style={{ y: taglineY }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white"
            >
              Travel Smarter, Not Harder
            </motion.p>
          </motion.div>

          {/* Search Form */}
          <motion.div 
            style={{ opacity: formOpacity }}
            className="w-full max-w-5xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-2xl mx-4"
            >
              <h2 className="text-xl font-bold text-white text-center mb-6">
                Plan Your Tour
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Country Input with onBlur handler for Unsplash API */}
                <input
                  type="text"
                  placeholder="Type a country..."
                  value={country}
                  onChange={handleCountryChange}
                  onBlur={handleCountryBlur}
                  className="h-14 w-full px-4 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                />

                <button
                  onClick={() => setShowDatePicker(true)}
                  className="h-14 px-4 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-left truncate hover:bg-gray-600/50 transition-colors"
                >
                  {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                </button>
                <select
                  value={travellers}
                  onChange={(e) => setTravellers(Number(e.target.value))}
                  className="h-14 px-4 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Traveler{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlanNow}
                  className="h-14 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Plan Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Render Calendar */}
      {showDatePicker && (
        <Calendar 
          onSelect={(range) => {
            console.log("Selected Date Range:", range);
            setDateRange(range);
          }} 
          onClose={() => setShowDatePicker(false)} 
        />
      )}

      {/* Experience Section */}
      <div 
        className="relative min-h-screen py-13 px-4 md:px-8 bg-fixed bg-cover bg-center"
        style={{ 
          backgroundImage: `url('/section-bg.jpg')`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto min-h-screen flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
          <motion.img 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            src="/travel-experience.jpg" 
            alt="Travel Experience" 
            className="w-full md:w-1/2 rounded-lg shadow-2xl object-cover h-[400px]"
          />
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Experience the World</h2>
            <p className="text-lg leading-relaxed text-gray-100">
              Discover amazing destinations around the globe with our expertly curated travel packages. 
              Whether you're seeking adventure in the mountains, relaxation on pristine beaches, 
              or cultural experiences in historic cities, we have the perfect journey waiting for you.
              Our experienced team ensures that every detail of your trip is carefully planned,
              allowing you to focus on creating unforgettable memories.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors duration-300 shadow-xl"
            >
              Explore More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}