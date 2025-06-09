"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Globe, Star, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  searchCities,
  getPopularCities,
  formatCityDisplay,
  type CityData,
} from "@/lib/cities";

interface CitySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Search for a city...",
  className,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [filteredCities, setFilteredCities] = useState<CityData[]>(
    getPopularCities()
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync value prop with internal state
  useEffect(() => {
    if (value) {
      const city = searchCities(value)[0];
      if (city) {
        setSelectedCity(city);
        setSearchQuery("");
      }
    }
  }, [value]);

  // Update filtered cities when search query changes
  useEffect(() => {
    const cities = searchCities(searchQuery);
    setFilteredCities(cities.slice(0, 80)); // Limit results for performance
  }, [searchQuery]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
    setSearchQuery("");
    setIsOpen(false);
    onValueChange(formatCityDisplay(city));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!isOpen && query.length > 0) {
      setIsOpen(true);
    }

    // If user clears the input, clear the selection
    if (query === "") {
      setSelectedCity(null);
      onValueChange("");
    }
  };

  const handleClear = () => {
    setSelectedCity(null);
    setSearchQuery("");
    onValueChange("");
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const displayValue = selectedCity
    ? formatCityDisplay(selectedCity)
    : searchQuery;

  return (
    <div className={cn("relative", className)}>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 transition-colors group-focus-within:text-blue-500">
          <Search className="h-5 w-5" />
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={cn(
            "pl-12 pr-14 text-base py-4 h-14 bg-white border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300 shadow-sm",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            selectedCity && "border-green-500 bg-green-50 text-green-800 focus:border-green-600 focus:ring-green-100"
          )}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10">
          {selectedCity && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 w-7 p-0 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
            </Button>
          )}
          <div className="h-6 w-px bg-gray-300" />
          <ChevronDown
            className={cn(
              "h-5 w-5 text-gray-400 transition-all duration-200",
              isOpen && "transform rotate-180 text-blue-500"
            )}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-2 ml-1">{error}</p>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-3 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[600px] overflow-hidden backdrop-blur-sm"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Popular Destinations"}
                </span>
                <Badge variant="secondary" className="text-xs bg-white/80 text-gray-600 border border-gray-200">
                  {filteredCities.length} cities
                </Badge>
              </div>
            </div>

            {/* Cities List */}
            <div className="max-h-[520px] overflow-y-auto scrollbar-hide">
              {filteredCities.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No cities found</p>
                  <p className="text-xs text-gray-400">
                    Try a different search term
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredCities.map((city, index) => (
                    <motion.button
                      key={city.id}
                      type="button"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.2 }}
                      onClick={() => handleCitySelect(city)}
                      className="w-full px-5 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 focus:outline-none transition-all duration-200 group border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 truncate">
                                {city.name}
                              </span>
                              {city.popular && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {city.country} • {city.region}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!searchQuery && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  Popular destinations are marked with a star
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitySelector;
