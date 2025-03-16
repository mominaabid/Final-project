"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

const Calendar = ({ onSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return Array.from({ length: 42 }, (_, i) => {
      const day = i - firstDay + 1;
      return day <= 0 || day > daysInMonth ? null : new Date(year, month, day);
    });
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const handleDateClick = (date) => {
    if (!date) return;
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
    } else {
      setSelectedRange({
        start: date < selectedRange.start ? date : selectedRange.start,
        end: date < selectedRange.start ? selectedRange.start : date,
      });
    }
  };

  const isDateInRange = (date) =>
    date && selectedRange.start && selectedRange.end && date >= selectedRange.start && date <= selectedRange.end;

  const formatDate = (date) => (date ? `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}` : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => onClose()}
    >
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl p-6 max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
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
                  <h4 className="text-white font-medium">{`${months[monthDate.getMonth()]} ${monthDate.getFullYear()}`}</h4>
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
                  {days.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => handleDateClick(day)}
                      disabled={!day || day < new Date()}
                      className={`relative p-2 text-center text-sm rounded-lg transition-colors ${
                        !day ? "invisible" : ""
                      } ${day < new Date() ? "text-gray-600" : "text-white"} ${
                        day?.getTime() === selectedRange.start?.getTime() ? "bg-teal-500" : ""
                      } ${day?.getTime() === selectedRange.end?.getTime() ? "bg-teal-700" : ""} ${
                        isDateInRange(day) ? "bg-teal-300" : "hover:bg-gray-700"
                      }`}
                    >
                      {day?.getDate()}
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
              <span>{`${formatDate(selectedRange.start)} - ${formatDate(selectedRange.end)}`}</span>
            ) : (
              <span className="text-red-500">Select Dates</span>
            )}
            {selectedRange.start && selectedRange.end && selectedRange.start.getTime() === selectedRange.end.getTime() && (
              <span className="text-red-500"> Invalid: Please select at least 1 day</span>
            )}
          </div>
          <div className="space-x-4">
            <button onClick={onClose} className="px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={() => {
                if (
                  selectedRange.start &&
                  selectedRange.end &&
                  selectedRange.start.getTime() !== selectedRange.end.getTime()
                ) {
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
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
  const [travellers, setTravellers] = useState(1);
  const [country, setCountry] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("/mountains.jpg");
  const router = useRouter();
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 300]);
  const taglineY = useTransform(scrollY, [0, 500], [0, 200]);
  const formOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  const cityInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initializeAutocomplete = () => {
    if (!window.google || !window.google.maps || !cityInputRef.current) {
      console.error("Google Maps API not loaded or input ref not found");
      return;
    }
    console.log("Initializing Google Places Autocomplete...");
    const autocomplete = new window.google.maps.places.Autocomplete(cityInputRef.current, {
      types: ["(cities)"],
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log("Place selected:", place);
      if (place && place.name) {
        setCountry(place.name);
        fetchCityImage(place.name); // Fetch image when city is selected
      }
    });
  };

  const fetchCityImage = async (city) => {
    if (!city) {
      console.error("No city provided for image fetch");
      setBackgroundImage("/mountains.jpg");
      return;
    }

    try {
      const response = await fetch(`/api/getCityImage?city=${encodeURIComponent(city)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Response is not JSON. Content-Type: ${contentType}`);
          }
          return response.json();
        })
        .then(data => {
          setBackgroundImage(data.imageUrl);
          console.log("Background image set to:", data.imageUrl);
          return data;
        })
        .catch(error => {
          console.error("Error fetching city image:", error);
          setBackgroundImage("/mountains.jpg");
          throw error;
        });
    } catch (error) {
      console.error("Outer catch - Error fetching city image:", error);
      setBackgroundImage("/mountains.jpg");
    }
  };

  const handleScriptLoad = () => {
    console.log("Google Maps script loaded successfully");
    setIsGoogleLoaded(true);
    initializeAutocomplete();
  };

  useEffect(() => {
    if (isGoogleLoaded) initializeAutocomplete();
  }, [isGoogleLoaded]);

  const handlePlanNow = async () => {
    if (!country) {
      alert("Please enter a city name");
      return;
    }
    const startDate = dateRange.start.toISOString().split("T")[0];
    const endDate = dateRange.end.toISOString().split("T")[0];
    console.log("Sending Data:", { city: country, start_date: startDate, end_date: endDate, travelers: travellers });
    try {
      const response = await fetch("http://127.0.0.1:5000/get_city_info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: country, start_date: startDate, end_date: endDate, travelers: travellers }),
      });
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
      const data = await response.json();
      console.log("API Response:", data);
      if (data.description && data.activities?.length > 0) {
        localStorage.setItem("cityInfo", JSON.stringify({ ...data, start_date: startDate, end_date: endDate, travelers: travellers }));
        localStorage.setItem("city", country);
        localStorage.setItem("start_date", startDate);
        localStorage.setItem("end_date", endDate);
        localStorage.setItem("travelers", travellers.toString());
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
    <>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBTzdaWNQ_OcoyA5KuoKpEHckRmuKiTY9A&libraries=places"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={(e) => console.error("Error loading Google Maps script:", e)}
      />

      <div className="relative min-h-screen w-full overflow-x-hidden">
        <div
          className="relative h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed transition-all duration-500"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-bold text-white tracking-widest">
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
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
                  ☰
                </button>
              </div>
            </div>
          </nav>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-16 right-4 bg-black/90 backdrop-blur-md rounded-lg py-2 px-4 z-50 md:hidden"
              >
                {["Home", "About", "Packages"].map((item) => (
                  <motion.div key={item} whileHover={{ x: 10 }} className="py-2 text-white hover:text-teal-400 cursor-pointer">
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 px-4 text-center">
            <motion.div style={{ y: titleY }} className="mb-24">
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

            <motion.div style={{ opacity: formOpacity }} className="w-full max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-2xl mx-4"
              >
                <h2 className="text-xl font-bold text-white text-center mb-6">Plan Your Tour</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  <input
                    ref={cityInputRef}
                    type="text"
                    placeholder="Type a city..."
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      if (!e.target.value) setBackgroundImage("/mountains.jpg");
                    }}
                    className="h-14 w-full px-4 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                  />
                  <style jsx>{`
                    .pac-container {
                      bottom: calc(100% + 5px) !important;
                      top: auto !important;
                      transform: translateY(-100%) translateY(-5px);
                      z-index: 9999 !important;
                      position: absolute !important;
                    }
                    .pac-container:after {
                      display: none !important;
                    }
                  `}</style>
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
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>{`${num} Traveler${num !== 1 ? "s" : ""}`}</option>
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

        {showDatePicker && (
          <Calendar
            onSelect={(range) => {
              console.log("Selected Date Range:", range);
              setDateRange(range);
            }}
            onClose={() => setShowDatePicker(false)}
          />
        )}

        <div
          className="relative min-h-screen py-13 px-4 md:px-8 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url('/section-bg.jpg')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
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
                Discover amazing destinations around the globe with our expertly curated travel packages. Whether you're
                seeking adventure in the mountains, relaxation on pristine beaches, or cultural experiences in historic
                cities, we have the perfect journey waiting for you. Our experienced team ensures that every detail of
                your trip is carefully planned, allowing you to focus on creating unforgettable memories.
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
    </>
  );
}