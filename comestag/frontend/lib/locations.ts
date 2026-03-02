import { logger } from "@/lib/logger";
import { isDevMode } from "@/lib/dev-auth";

// Country and city data utilities

export interface Country {
  name: string;
  code: string;
}

export interface State {
  name: string;
}

export interface City {
  name: string;
  country: string;
}

export interface Industry {
  id: number;
  name: string;
}

export interface Hashtag {
  id: number;
  name: string;
}

export interface DynamicData {
  industries: Industry[];
  hashtags: Hashtag[];
  sizes: string[];
}

interface RestCountryResponse {
  name: { common: string };
  cca2: string;
}

// Fetch countries from REST Countries API
export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2"
    );
    const data: RestCountryResponse[] = await response.json();

    const countries: Country[] = data
      .map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }))
      .filter((country) => {
        // Filter out problematic country names or very small territories
        const name = country.name;
        // Skip countries with special characters that might cause API issues
        if (name.includes('Å') || name.includes('Æ') || name.includes('Ø')) {
          return false;
        }
        // Skip very small or disputed territories
        const excludeList = [
          'Bouvet Island',
          'Christmas Island',
          'Cocos',
          'Heard Island',
          'Norfolk Island',
          'Svalbard',
          'Jan Mayen',
        ];
        return !excludeList.some(excluded => name.includes(excluded));
      })
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

    return countries;
  } catch (error) {
    logger.error("Failed to fetch countries", error);
    return getDefaultCountries();
  }
}

// Fallback list of major countries
function getDefaultCountries(): Country[] {
  return [
    { name: "United States", code: "US" },
    { name: "United Kingdom", code: "GB" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
    { name: "India", code: "IN" },
    { name: "China", code: "CN" },
    { name: "Japan", code: "JP" },
    { name: "Brazil", code: "BR" },
    { name: "Mexico", code: "MX" },
    { name: "Italy", code: "IT" },
    { name: "Spain", code: "ES" },
    { name: "South Korea", code: "KR" },
    { name: "Netherlands", code: "NL" },
    { name: "Switzerland", code: "CH" },
    { name: "Sweden", code: "SE" },
    { name: "Norway", code: "NO" },
    { name: "Denmark", code: "DK" },
    { name: "Belgium", code: "BE" },
    { name: "Austria", code: "AT" },
    { name: "Poland", code: "PL" },
    { name: "Turkey", code: "TR" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "Singapore", code: "SG" },
    { name: "New Zealand", code: "NZ" },
    { name: "Ireland", code: "IE" },
    { name: "Portugal", code: "PT" },
    { name: "Greece", code: "GR" },
  ].sort((a, b) => a.name.localeCompare(b.name));
}

// Fetch states/provinces by country
export async function fetchStatesByCountry(
  countryName: string
): Promise<string[]> {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: countryName }),
      }
    );

    const data = await response.json();

    if (data.error === false && data.data?.states && Array.isArray(data.data.states)) {
      return data.data.states.map((state: State) => state.name).sort();
    }

    return [];
  } catch (error) {
    logger.error("Failed to fetch states", error, { countryName });
    return [];
  }
}

// Fetch cities by state within a country
export async function fetchCitiesByState(
  countryName: string,
  stateName: string
): Promise<string[]> {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          country: countryName,
          state: stateName 
        }),
      }
    );

    const data = await response.json();

    if (data.error === false && data.data && Array.isArray(data.data)) {
      return data.data.sort();
    }

    return [];
  } catch (error) {
    logger.error("Failed to fetch cities by state", error, { countryName, stateName });
    return [];
  }
}

// Major cities by country - this is a curated list
// For a full cities API, you could use https://countriesnow.space/api/v0.1/countries
export async function fetchCitiesByCountry(
  countryName: string
): Promise<string[]> {
  // If country name has special characters, use fallback immediately
  if (!countryName || countryName.includes('Å') || countryName.includes('Æ') || countryName.includes('Ø')) {
    return getDefaultCitiesByName(countryName);
  }
  
  try {
    // Using Countries Now API for cities
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/cities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: countryName }),
      }
    );

    const data = await response.json();

    if (data.error === false && data.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.sort();
    }

    return getDefaultCitiesByName(countryName);
  } catch (error) {
    logger.error("Failed to fetch cities", error, { countryName });
    return getDefaultCitiesByName(countryName);
  }
}

// Fallback major cities by country name
function getDefaultCitiesByName(countryName: string): string[] {
  const citiesMap: Record<string, string[]> = {
    "United States": [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Francisco",
      "Seattle",
      "Boston",
      "Miami",
      "Atlanta",
      "Washington D.C.",
    ],
    "United Kingdom": [
      "London",
      "Manchester",
      "Birmingham",
      "Leeds",
      "Glasgow",
      "Liverpool",
      "Edinburgh",
      "Bristol",
      "Cardiff",
      "Belfast",
    ],
    "Canada": [
      "Toronto",
      "Montreal",
      "Vancouver",
      "Calgary",
      "Edmonton",
      "Ottawa",
      "Winnipeg",
      "Quebec City",
      "Hamilton",
      "Victoria",
    ],
    "Australia": [
      "Sydney",
      "Melbourne",
      "Brisbane",
      "Perth",
      "Adelaide",
      "Gold Coast",
      "Canberra",
      "Newcastle",
      "Hobart",
      "Darwin",
    ],
    "Germany": [
      "Berlin",
      "Hamburg",
      "Munich",
      "Cologne",
      "Frankfurt",
      "Stuttgart",
      "Düsseldorf",
      "Dortmund",
      "Essen",
      "Leipzig",
    ],
    "France": [
      "Paris",
      "Marseille",
      "Lyon",
      "Toulouse",
      "Nice",
      "Nantes",
      "Strasbourg",
      "Montpellier",
      "Bordeaux",
      "Lille",
    ],
    "India": [
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Kolkata",
      "Pune",
      "Ahmedabad",
      "Jaipur",
      "Surat",
    ],
    "China": [
      "Beijing",
      "Shanghai",
      "Guangzhou",
      "Shenzhen",
      "Chengdu",
      "Chongqing",
      "Tianjin",
      "Wuhan",
      "Hangzhou",
      "Xi'an",
    ],
    "Japan": [
      "Tokyo",
      "Osaka",
      "Yokohama",
      "Nagoya",
      "Sapporo",
      "Fukuoka",
      "Kobe",
      "Kyoto",
      "Hiroshima",
      "Sendai",
    ],
    "Brazil": [
      "São Paulo",
      "Rio de Janeiro",
      "Brasília",
      "Salvador",
      "Fortaleza",
      "Belo Horizonte",
      "Manaus",
      "Curitiba",
      "Recife",
      "Porto Alegre",
    ],
    "Mexico": [
      "Mexico City",
      "Guadalajara",
      "Monterrey",
      "Puebla",
      "Tijuana",
      "León",
      "Juárez",
      "Zapopan",
      "Mérida",
      "Cancún",
    ],
    "Italy": [
      "Rome",
      "Milan",
      "Naples",
      "Turin",
      "Palermo",
      "Genoa",
      "Bologna",
      "Florence",
      "Venice",
      "Verona",
    ],
    "Spain": [
      "Madrid",
      "Barcelona",
      "Valencia",
      "Seville",
      "Zaragoza",
      "Málaga",
      "Murcia",
      "Palma",
      "Bilbao",
      "Alicante",
    ],
    "South Korea": [
      "Seoul",
      "Busan",
      "Incheon",
      "Daegu",
      "Daejeon",
      "Gwangju",
      "Suwon",
      "Ulsan",
      "Changwon",
      "Goyang",
    ],
    "Netherlands": [
      "Amsterdam",
      "Rotterdam",
      "The Hague",
      "Utrecht",
      "Eindhoven",
      "Tilburg",
      "Groningen",
      "Almere",
      "Breda",
      "Nijmegen",
    ],
    "United Arab Emirates": [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Al Ain",
      "Ajman",
      "Ras Al Khaimah",
      "Fujairah",
      "Umm Al Quwain",
    ],
    "Singapore": ["Singapore"],
  };

  return citiesMap[countryName] || [];
}

// Fetch dynamic data (industries, hashtags, sizes)
export async function fetchDynamicData(): Promise<DynamicData> {
  // In dev mode, return mock data immediately without API call
  if (isDevMode()) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 [DEV MODE] Returning mock dynamic data");
    }
    return getDefaultDynamicData();
  }

  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (typeof window !== "undefined"
        ? "" // Use relative paths when served from same origin
        : "http://localhost:3000"); // SSR fallback

    const response = await fetch(`${API_BASE_URL}/home/dynamic`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      logger.error("Failed to fetch dynamic data", { status: response.status });
      return getDefaultDynamicData();
    }

    const data = await response.json();
    
    return {
      industries: data.industries || [],
      hashtags: data.hashtags || [],
      sizes: data.sizes || [],
    };
  } catch (error) {
    logger.error("Failed to fetch dynamic data", error);
    return getDefaultDynamicData();
  }
}

// Fallback dynamic data
function getDefaultDynamicData(): DynamicData {
  return {
    industries: [
      { id: 1, name: "Technology" },
      { id: 2, name: "Healthcare" },
      { id: 3, name: "Finance" },
      { id: 4, name: "Education" },
      { id: 5, name: "Manufacturing" },
      { id: 6, name: "Retail" },
      { id: 7, name: "Real Estate" },
      { id: 8, name: "Transportation" },
      { id: 9, name: "Energy" },
      { id: 10, name: "Agriculture" },
    ],
    hashtags: [],
    sizes: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
  };
}
