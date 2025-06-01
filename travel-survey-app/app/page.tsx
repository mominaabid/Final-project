"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Github, Twitter, Instagram, Facebook, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import cities from "./cities.json";

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
  const [city, setCity] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("/mountains.jpg");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const cityInputRef = useRef(null);
  const router = useRouter();
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 300]);
  const taglineY = useTransform(scrollY, [0, 500], [0, 200]);
  const formOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail") || "";
    if (loggedIn) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isCitySelected) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = () => {
      if (city.length < 2) {
        setCitySuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const suggestions = [];
        Object.entries(cities).forEach(([country, cityList]) => {
          if (!Array.isArray(cityList)) {
            console.warn(`Invalid city list for country: ${country}`, cityList);
            return;
          }
          cityList.forEach((cityName) => {
            if (typeof cityName === 'string' && cityName.toLowerCase().startsWith(city.toLowerCase())) {
              suggestions.push({
                cityName,
                displayName: `${cityName}, ${country}`,
              });
            } else if (typeof cityName !== 'string') {
              console.warn(`Invalid city name in ${country}:`, cityName);
            }
          });
        });
        const sortedSuggestions = suggestions
          .sort((a, b) => a.cityName.localeCompare(b.cityName))
          .slice(0, 5);
        setCitySuggestions(sortedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error filtering city suggestions:", error);
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [city, isCitySelected]);

  const fetchCityImage = async (city) => {
    if (!city) {
      console.error("No city provided for image fetch");
      setBackgroundImage("/mountains.jpg");
      localStorage.setItem("backgroundImage", "/mountains.jpg");
      return;
    }

    try {
      const response = await fetch(`/api/getCityImage?city=${encodeURIComponent(city)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Response is not JSON. Content-Type: ${contentType}`);
      }
      const data = await response.json();
      setBackgroundImage(data.imageUrl);
      localStorage.setItem("backgroundImage", data.imageUrl);
      console.log("Background image set to:", data.imageUrl);
    } catch (error) {
      console.error("Error fetching city image:", error);
      setBackgroundImage("/mountains.jpg");
      localStorage.setItem("backgroundImage", "/mountains.jpg");
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setIsCitySelected(false);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity.cityName);
    setShowSuggestions(false);
    setIsCitySelected(true);
    if (cityInputRef.current) {
      cityInputRef.current.blur();
    }
    fetchCityImage(selectedCity.cityName);
  };

  const handleCityConfirm = () => {
    if (city.trim()) {
      fetchCityImage(city);
      setShowSuggestions(false);
      setIsCitySelected(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && city.trim()) {
      handleCityConfirm();
    }
  };

  const handlePlanNow = async () => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    // Validate date range
    if (!dateRange.start || !dateRange.end || dateRange.start.getTime() === dateRange.end.getTime()) {
      alert("Please select a valid date range.");
      return;
    }

    // Store basic data in localStorage for CityDetails
    const startDate = dateRange.start.toISOString().split("T")[0];
    const endDate = dateRange.end.toISOString().split("T")[0];
    localStorage.setItem("city", city);
    localStorage.setItem("start_date", startDate);
    localStorage.setItem("end_date", endDate);
    localStorage.setItem("travelers", travellers.toString());

    // Navigate immediately to CityDetails page
    router.push(`/city/${encodeURIComponent(city)}`);

    // Fetch city image and city info concurrently
    try {
      // Trigger image fetch without awaiting
      fetchCityImage(city);

      // Fetch city info from backend
      console.log("Sending Data:", { city, start_date: startDate, end_date: endDate, travelers: travellers });
      const response = await fetch("http://127.0.0.1:5000/get_city_info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, start_date: startDate, end_date: endDate, travelers: travellers }),
      });

      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
      const data = await response.json();
      console.log("API Response:", data);

      if (data.description && data.activities?.length > 0) {
        localStorage.setItem("cityInfo", JSON.stringify({ ...data, start_date: startDate, end_date: endDate, travelers: travellers }));
      } else {
        console.warn("No activities found for this city.");
        localStorage.setItem("cityInfo", JSON.stringify({ error: "No activities found" }));
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
      localStorage.setItem("cityInfo", JSON.stringify({ error: "Failed to fetch activities" }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("selectedPackage");
    setIsLoggedIn(false);
    setUserEmail("");
    setShowUserMenu(false);
  };

  const getInitial = (email) => email.charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div
        className="relative h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed transition-all duration-500"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
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
              <div className="hidden md:flex space-x-8 items-center">
                {["Home", "About", "Packages"].map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white hover:text-teal-400 transition"
                    onClick={() => {
                      if (item === "Packages") router.push(`/travel-packages/${city || "default-city"}`);
                    }}
                  >
                    {item}
                  </motion.button>
                ))}
                {isLoggedIn ? (
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition text-lg font-semibold"
                    >
                      {getInitial(userEmail)}
                    </motion.button>
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 bg-black/90 backdrop-blur-md rounded-lg py-2 px-4 z-50"
                        >
                          <p className="text-white text-sm mb-2">{userEmail}</p>
                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={handleLogout}
                            className="flex items-center text-white hover:text-teal-400 cursor-pointer"
                          >
                            <LogOut size={16} className="mr-2" />
                            Logout
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => router.push(`/travel-packages/${city || "default-city"}`)}
                    className="text-white hover:text-teal-400 transition"
                  >
                    Login
                  </motion.button>
                )}
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
                <motion.div
                  key={item}
                  whileHover={{ x: 10 }}
                  className="py-2 text-white hover:text-teal-400 cursor-pointer"
                  onClick={() => {
                    if (item === "Packages") router.push(`/travel-packages/${city || "default-city"}`);
                  }}
                >
                  {item}
                </motion.div>
              ))}
              {isLoggedIn ? (
                <div className="relative">
                  <motion.div
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    whileHover={{ x: 10 }}
                    className="py-2 text-white hover:text-teal-400 cursor-pointer flex items-center"
                  >
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-semibold">
                      {getInitial(userEmail)}
                    </div>
                    Profile
                  </motion.div>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 bg-black/90 backdrop-blur-md rounded-lg py-2 px-4 z-50"
                      >
                        <p className="text-white text-sm mb-2">{userEmail}</p>
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={handleLogout}
                          className="flex items-center text-white hover:text-teal-400 cursor-pointer"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  whileHover={{ x: 10 }}
                  onClick={() => router.push(`/travel-packages/${city || "default-city"}`)}
                  className="py-2 text-white hover:text-teal-400 cursor-pointer"
                >
                  Login
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 px-4 text-center">
          <motion.div style={{ y: titleY }} className="mb-20">
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
              className="bg-gray-800/90 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-2xl mx-4"
            >
              <h2 className="text-xl font-bold text-white text-center mb-6">Plan Your Tour</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                <div className="relative">
                  <input
                    id="city"
                    type="text"
                    placeholder="Type a city..."
                    value={city}
                    onChange={handleCityChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => city.length >= 2 && !isCitySelected && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    ref={cityInputRef}
                    autoComplete="off" // Added to disable browser autocomplete history
                    className="h-14 w-full px-4 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 transition"
                  />
                  {showSuggestions && citySuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 w-full bg-gray-800/90 backdrop-blur-md rounded-lg bottom-full mb-1 max-h-60 overflow-y-auto"
                    >
                      {citySuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => handleCitySelect(suggestion)}
                          className="px-4 py-2 text-white hover:bg-teal-500 cursor-pointer transition"
                        >
                          {suggestion.displayName}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="h-14 px-4 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-left truncate hover:bg-gray-600/50 transition"
                >
                  {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                </button>
                <select
                  value={travellers}
                  onChange={(e) => setTravellers(Number(e.target.value))}
                  className="h-14 px-4 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>{`${num} Traveler${num !== 1 ? "s" : ""}`}</option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlanNow}
                  className="h-14 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
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
        className="relative min-h-screen py-16 px-4 md:px-8 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url('/section-bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-6xl mx-auto min-h-screen flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
          <motion.img
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            src="/travel-experience.jpg"
            alt="Travel Experience"
            className="w-full md:w-1/2 rounded-lg shadow-2xl object-cover h-96"
          />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Experience the World</h2>
            <p className="text-lg leading-relaxed text-gray-200">
              Discover amazing destinations around the globe with our expertly curated travel packages. Whether you're
              seeking adventure in the mountains, relaxation on pristine beaches, or cultural experiences in historic
              cities, we have the perfect journey waiting for you. Our experienced team ensures that every detail of
              your trip is carefully planned, allowing you to focus on creating unforgettable memories.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition shadow-lg"
            >
              Explore More
            </motion.button>
          </motion.div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Honest Travel</h3>
              <p className="text-gray-400">
                Your journey begins with us. Experience the world in a way that's authentic, sustainable, and unforgettable.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2">
                {["Europe", "Asia", "North America", "South America", "Africa", "Australia"].map((continent) => (
                  <li key={continent}>
                    <a href="#" className="text-gray-400 hover:text-teal-400 transition">{continent}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Travel Types</h4>
              <ul className="space-y-2">
                {["Adventure", "Cultural", "Beach", "City Break", "Wildlife", "Food & Wine"].map((type) => (
                  <li key={type}>
                    <a href="#" className="text-gray-400 hover:text-teal-400 transition">{type}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <address className="not-italic text-gray-400 mb-4">
                1234 Travel Lane<br />
                Adventure City, TC 54321<br />
                contact@honesttravel.com<br />
                +1 (555) 123-4567
              </address>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition">
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Honest Travel. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}