"use client";

import React, { useState, useEffect } from "react";
import { 
  fetchCountries, 
  fetchStatesByCountry, 
  fetchCitiesByState, 
  fetchCitiesByCountry, 
  Country 
} from "@/lib/locations";

interface CountryCitySelectProps {
  countryName?: string;
  countryValue: string;
  stateName?: string;
  stateValue?: string;
  cityName?: string;
  cityValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

export default function CountryCitySelect({
  countryName = "country",
  countryValue,
  stateName = "state",
  stateValue = "",
  cityName = "city",
  cityValue,
  onChange,
  required = false,
}: CountryCitySelectProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      const countriesList = await fetchCountries();
      setCountries(countriesList);
    };
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (countryValue) {
        setIsLoadingStates(true);
        const statesList = await fetchStatesByCountry(countryValue);
        setStates(statesList);
        setIsLoadingStates(false);
        
        // Clear cities when country changes
        setCities([]);
      } else {
        setStates([]);
        setCities([]);
      }
    };
    loadStates();
  }, [countryValue]);

  // Load cities when state changes (if states exist) or country changes (if no states)
  useEffect(() => {
    const loadCities = async () => {
      if (countryValue) {
        setIsLoadingCities(true);
        
        // If states are available and one is selected, fetch cities by state
        if (states.length > 0 && stateValue) {
          const citiesList = await fetchCitiesByState(countryValue, stateValue);
          setCities(citiesList);
        } 
        // If no states available for this country, fetch all cities
        else if (states.length === 0) {
          const citiesList = await fetchCitiesByCountry(countryValue);
          setCities(citiesList);
        }
        // If states exist but none selected, clear cities
        else {
          setCities([]);
        }
        
        setIsLoadingCities(false);
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [countryValue, stateValue, states.length]);

  const selectStyle = {
    backgroundImage:
      "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22><path fill=%22%23212529%22 d=%22M4.5 5.5l3.5 3.5 3.5-3.5h-7z%22/></svg>')",
  };

  return (
    <div className="flex flex-col gap-[27px]">
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2.5">
          <label className="text-[20px] font-semibold text-text-dark">
            Country {required && <span>*</span>}
          </label>
          <select
            name={countryName}
            value={countryValue}
            onChange={onChange}
            required={required}
            className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark outline-none h-12 appearance-none bg-size-[16px_16px] bg-position-[right_1.25rem_center] bg-no-repeat cursor-pointer"
            style={selectStyle}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {states.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <label className="text-[20px] font-semibold text-text-dark">
              State/Province {required && <span>*</span>}
            </label>
            <select
              name={stateName}
              value={stateValue}
              onChange={onChange}
              disabled={!countryValue || isLoadingStates}
              required={required}
              className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark outline-none h-12 appearance-none bg-size-[16px_16px] bg-position-[right_1.25rem_center] bg-no-repeat cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={selectStyle}
            >
              <option value="">
                {isLoadingStates
                  ? "Loading states..."
                  : "Select state/province"}
              </option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-[20px] font-semibold text-text-dark">
          City {required && <span>*</span>}
        </label>
        <select
          name={cityName}
          value={cityValue}
          onChange={onChange}
          disabled={!countryValue || (states.length > 0 && !stateValue) || isLoadingCities}
          required={required}
          className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark outline-none h-12 appearance-none bg-size-[16px_16px] bg-position-[right_1.25rem_center] bg-no-repeat cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={selectStyle}
        >
          <option value="">
            {isLoadingCities
              ? "Loading cities..."
              : states.length > 0 && !stateValue
              ? "Select state first"
              : countryValue
              ? "Select city"
              : "Select country first"}
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
