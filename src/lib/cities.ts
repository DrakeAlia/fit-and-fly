export interface CityData {
  id: string
  name: string
  country: string
  region: string
  popular?: boolean
  lat?: number
  lng?: number
}

export const CITIES_DATABASE: CityData[] = [
  // Popular European Cities
  { id: 'paris-fr', name: 'Paris', country: 'France', region: 'Europe', popular: true, lat: 48.8566, lng: 2.3522 },
  { id: 'london-uk', name: 'London', country: 'United Kingdom', region: 'Europe', popular: true, lat: 51.5074, lng: -0.1278 },
  { id: 'rome-it', name: 'Rome', country: 'Italy', region: 'Europe', popular: true, lat: 41.9028, lng: 12.4964 },
  { id: 'barcelona-es', name: 'Barcelona', country: 'Spain', region: 'Europe', popular: true, lat: 41.3851, lng: 2.1734 },
  { id: 'amsterdam-nl', name: 'Amsterdam', country: 'Netherlands', region: 'Europe', popular: true, lat: 52.3676, lng: 4.9041 },
  { id: 'berlin-de', name: 'Berlin', country: 'Germany', region: 'Europe', popular: true, lat: 52.5200, lng: 13.4050 },
  { id: 'prague-cz', name: 'Prague', country: 'Czech Republic', region: 'Europe', popular: true, lat: 50.0755, lng: 14.4378 },
  { id: 'vienna-at', name: 'Vienna', country: 'Austria', region: 'Europe', popular: true, lat: 48.2082, lng: 16.3738 },
  { id: 'lisbon-pt', name: 'Lisbon', country: 'Portugal', region: 'Europe', popular: true, lat: 38.7223, lng: -9.1393 },
  { id: 'madrid-es', name: 'Madrid', country: 'Spain', region: 'Europe', popular: true, lat: 40.4168, lng: -3.7038 },
  { id: 'budapest-hu', name: 'Budapest', country: 'Hungary', region: 'Europe', popular: true, lat: 47.4979, lng: 19.0402 },
  { id: 'copenhagen-dk', name: 'Copenhagen', country: 'Denmark', region: 'Europe', popular: true, lat: 55.6761, lng: 12.5683 },
  { id: 'stockholm-se', name: 'Stockholm', country: 'Sweden', region: 'Europe', popular: true, lat: 59.3293, lng: 18.0686 },
  { id: 'zurich-ch', name: 'Zurich', country: 'Switzerland', region: 'Europe', popular: true, lat: 47.3769, lng: 8.5417 },
  { id: 'dublin-ie', name: 'Dublin', country: 'Ireland', region: 'Europe', popular: true, lat: 53.3498, lng: -6.2603 },
  
  // Popular North American Cities
  { id: 'new-york-us', name: 'New York', country: 'United States', region: 'North America', popular: true, lat: 40.7128, lng: -74.0060 },
  { id: 'los-angeles-us', name: 'Los Angeles', country: 'United States', region: 'North America', popular: true, lat: 34.0522, lng: -118.2437 },
  { id: 'chicago-us', name: 'Chicago', country: 'United States', region: 'North America', popular: true, lat: 41.8781, lng: -87.6298 },
  { id: 'san-francisco-us', name: 'San Francisco', country: 'United States', region: 'North America', popular: true, lat: 37.7749, lng: -122.4194 },
  { id: 'miami-us', name: 'Miami', country: 'United States', region: 'North America', popular: true, lat: 25.7617, lng: -80.1918 },
  { id: 'las-vegas-us', name: 'Las Vegas', country: 'United States', region: 'North America', popular: true, lat: 36.1699, lng: -115.1398 },
  { id: 'washington-us', name: 'Washington D.C.', country: 'United States', region: 'North America', popular: true, lat: 38.9072, lng: -77.0369 },
  { id: 'boston-us', name: 'Boston', country: 'United States', region: 'North America', popular: true, lat: 42.3601, lng: -71.0589 },
  { id: 'seattle-us', name: 'Seattle', country: 'United States', region: 'North America', popular: true, lat: 47.6062, lng: -122.3321 },
  { id: 'toronto-ca', name: 'Toronto', country: 'Canada', region: 'North America', popular: true, lat: 43.6532, lng: -79.3832 },
  { id: 'vancouver-ca', name: 'Vancouver', country: 'Canada', region: 'North America', popular: true, lat: 49.2827, lng: -123.1207 },
  { id: 'montreal-ca', name: 'Montreal', country: 'Canada', region: 'North America', popular: true, lat: 45.5017, lng: -73.5673 },
  { id: 'austin-us', name: 'Austin', country: 'United States', region: 'North America', popular: true, lat: 30.2672, lng: -97.7431 },
  { id: 'denver-us', name: 'Denver', country: 'United States', region: 'North America', popular: true, lat: 39.7392, lng: -104.9903 },
  { id: 'portland-us', name: 'Portland', country: 'United States', region: 'North America', popular: true, lat: 45.5152, lng: -122.6784 },
  
  // Popular Asian Cities
  { id: 'tokyo-jp', name: 'Tokyo', country: 'Japan', region: 'Asia', popular: true, lat: 35.6762, lng: 139.6503 },
  { id: 'singapore-sg', name: 'Singapore', country: 'Singapore', region: 'Asia', popular: true, lat: 1.3521, lng: 103.8198 },
  { id: 'bangkok-th', name: 'Bangkok', country: 'Thailand', region: 'Asia', popular: true, lat: 13.7563, lng: 100.5018 },
  { id: 'seoul-kr', name: 'Seoul', country: 'South Korea', region: 'Asia', popular: true, lat: 37.5665, lng: 126.9780 },
  { id: 'hong-kong-hk', name: 'Hong Kong', country: 'Hong Kong', region: 'Asia', popular: true, lat: 22.3193, lng: 114.1694 },
  { id: 'dubai-ae', name: 'Dubai', country: 'United Arab Emirates', region: 'Asia', popular: true, lat: 25.2048, lng: 55.2708 },
  { id: 'kuala-lumpur-my', name: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', popular: true, lat: 3.1390, lng: 101.6869 },
  { id: 'manila-ph', name: 'Manila', country: 'Philippines', region: 'Asia', popular: true, lat: 14.5995, lng: 120.9842 },
  { id: 'jakarta-id', name: 'Jakarta', country: 'Indonesia', region: 'Asia', popular: true, lat: -6.2088, lng: 106.8456 },
  { id: 'mumbai-in', name: 'Mumbai', country: 'India', region: 'Asia', popular: true, lat: 19.0760, lng: 72.8777 },
  { id: 'delhi-in', name: 'Delhi', country: 'India', region: 'Asia', popular: true, lat: 28.7041, lng: 77.1025 },
  { id: 'bangalore-in', name: 'Bangalore', country: 'India', region: 'Asia', popular: true, lat: 12.9716, lng: 77.5946 },
  { id: 'beijing-cn', name: 'Beijing', country: 'China', region: 'Asia', popular: true, lat: 39.9042, lng: 116.4074 },
  { id: 'shanghai-cn', name: 'Shanghai', country: 'China', region: 'Asia', popular: true, lat: 31.2304, lng: 121.4737 },
  { id: 'taipei-tw', name: 'Taipei', country: 'Taiwan', region: 'Asia', popular: true, lat: 25.0330, lng: 121.5654 },
  
  // Popular Oceania Cities
  { id: 'sydney-au', name: 'Sydney', country: 'Australia', region: 'Oceania', popular: true, lat: -33.8688, lng: 151.2093 },
  { id: 'melbourne-au', name: 'Melbourne', country: 'Australia', region: 'Oceania', popular: true, lat: -37.8136, lng: 144.9631 },
  { id: 'brisbane-au', name: 'Brisbane', country: 'Australia', region: 'Oceania', popular: true, lat: -27.4698, lng: 153.0251 },
  { id: 'perth-au', name: 'Perth', country: 'Australia', region: 'Oceania', popular: true, lat: -31.9505, lng: 115.8605 },
  { id: 'auckland-nz', name: 'Auckland', country: 'New Zealand', region: 'Oceania', popular: true, lat: -36.8485, lng: 174.7633 },
  { id: 'wellington-nz', name: 'Wellington', country: 'New Zealand', region: 'Oceania', popular: true, lat: -41.2865, lng: 174.7762 },
  
  // Popular South American Cities
  { id: 'sao-paulo-br', name: 'São Paulo', country: 'Brazil', region: 'South America', popular: true, lat: -23.5505, lng: -46.6333 },
  { id: 'rio-de-janeiro-br', name: 'Rio de Janeiro', country: 'Brazil', region: 'South America', popular: true, lat: -22.9068, lng: -43.1729 },
  { id: 'buenos-aires-ar', name: 'Buenos Aires', country: 'Argentina', region: 'South America', popular: true, lat: -34.6118, lng: -58.3960 },
  { id: 'lima-pe', name: 'Lima', country: 'Peru', region: 'South America', popular: true, lat: -12.0464, lng: -77.0428 },
  { id: 'santiago-cl', name: 'Santiago', country: 'Chile', region: 'South America', popular: true, lat: -33.4489, lng: -70.6693 },
  { id: 'bogota-co', name: 'Bogotá', country: 'Colombia', region: 'South America', popular: true, lat: 4.7110, lng: -74.0721 },
  { id: 'mexico-city-mx', name: 'Mexico City', country: 'Mexico', region: 'North America', popular: true, lat: 19.4326, lng: -99.1332 },
  { id: 'cancun-mx', name: 'Cancún', country: 'Mexico', region: 'North America', popular: true, lat: 21.1619, lng: -86.8515 },
  
  // Popular African Cities
  { id: 'cairo-eg', name: 'Cairo', country: 'Egypt', region: 'Africa', popular: true, lat: 30.0444, lng: 31.2357 },
  { id: 'cape-town-za', name: 'Cape Town', country: 'South Africa', region: 'Africa', popular: true, lat: -33.9249, lng: 18.4241 },
  { id: 'johannesburg-za', name: 'Johannesburg', country: 'South Africa', region: 'Africa', popular: true, lat: -26.2041, lng: 28.0473 },
  { id: 'marrakech-ma', name: 'Marrakech', country: 'Morocco', region: 'Africa', popular: true, lat: 31.6295, lng: -7.9811 },
  { id: 'nairobi-ke', name: 'Nairobi', country: 'Kenya', region: 'Africa', popular: true, lat: -1.2921, lng: 36.8219 },
  { id: 'casablanca-ma', name: 'Casablanca', country: 'Morocco', region: 'Africa', popular: true, lat: 33.5731, lng: -7.5898 },
  
  // Additional Popular Cities
  { id: 'istanbul-tr', name: 'Istanbul', country: 'Turkey', region: 'Europe', popular: true, lat: 41.0082, lng: 28.9784 },
  { id: 'reykjavik-is', name: 'Reykjavik', country: 'Iceland', region: 'Europe', popular: true, lat: 64.1466, lng: -21.9426 },
  { id: 'oslo-no', name: 'Oslo', country: 'Norway', region: 'Europe', popular: true, lat: 59.9139, lng: 10.7522 },
  { id: 'helsinki-fi', name: 'Helsinki', country: 'Finland', region: 'Europe', popular: true, lat: 60.1699, lng: 24.9384 },
  { id: 'tel-aviv-il', name: 'Tel Aviv', country: 'Israel', region: 'Asia', popular: true, lat: 32.0853, lng: 34.7818 },
  
  // More US Cities
  { id: 'atlanta-us', name: 'Atlanta', country: 'United States', region: 'North America', lat: 33.7490, lng: -84.3880 },
  { id: 'dallas-us', name: 'Dallas', country: 'United States', region: 'North America', lat: 32.7767, lng: -96.7970 },
  { id: 'houston-us', name: 'Houston', country: 'United States', region: 'North America', lat: 29.7604, lng: -95.3698 },
  { id: 'phoenix-us', name: 'Phoenix', country: 'United States', region: 'North America', lat: 33.4484, lng: -112.0740 },
  { id: 'philadelphia-us', name: 'Philadelphia', country: 'United States', region: 'North America', lat: 39.9526, lng: -75.1652 },
  { id: 'san-diego-us', name: 'San Diego', country: 'United States', region: 'North America', lat: 32.7157, lng: -117.1611 },
  { id: 'nashville-us', name: 'Nashville', country: 'United States', region: 'North America', lat: 36.1627, lng: -86.7816 },
  { id: 'new-orleans-us', name: 'New Orleans', country: 'United States', region: 'North America', lat: 29.9511, lng: -90.0715 },
  { id: 'orlando-us', name: 'Orlando', country: 'United States', region: 'North America', lat: 28.5383, lng: -81.3792 },
  { id: 'minneapolis-us', name: 'Minneapolis', country: 'United States', region: 'North America', lat: 44.9778, lng: -93.2650 },
  
  // More European Cities
  { id: 'florence-it', name: 'Florence', country: 'Italy', region: 'Europe', lat: 43.7696, lng: 11.2558 },
  { id: 'venice-it', name: 'Venice', country: 'Italy', region: 'Europe', lat: 45.4408, lng: 12.3155 },
  { id: 'milan-it', name: 'Milan', country: 'Italy', region: 'Europe', lat: 45.4642, lng: 9.1900 },
  { id: 'nice-fr', name: 'Nice', country: 'France', region: 'Europe', lat: 43.7102, lng: 7.2620 },
  { id: 'lyon-fr', name: 'Lyon', country: 'France', region: 'Europe', lat: 45.7640, lng: 4.8357 },
  { id: 'marseille-fr', name: 'Marseille', country: 'France', region: 'Europe', lat: 43.2965, lng: 5.3698 },
  { id: 'munich-de', name: 'Munich', country: 'Germany', region: 'Europe', lat: 48.1351, lng: 11.5820 },
  { id: 'hamburg-de', name: 'Hamburg', country: 'Germany', region: 'Europe', lat: 53.5511, lng: 9.9937 },
  { id: 'cologne-de', name: 'Cologne', country: 'Germany', region: 'Europe', lat: 50.9375, lng: 6.9603 },
  { id: 'bruges-be', name: 'Bruges', country: 'Belgium', region: 'Europe', lat: 51.2093, lng: 3.2247 },
  { id: 'brussels-be', name: 'Brussels', country: 'Belgium', region: 'Europe', lat: 50.8503, lng: 4.3517 },
  
  // More Asian Cities
  { id: 'kyoto-jp', name: 'Kyoto', country: 'Japan', region: 'Asia', lat: 35.0116, lng: 135.7681 },
  { id: 'osaka-jp', name: 'Osaka', country: 'Japan', region: 'Asia', lat: 34.6937, lng: 135.5023 },
  { id: 'phuket-th', name: 'Phuket', country: 'Thailand', region: 'Asia', lat: 7.8804, lng: 98.3923 },
  { id: 'chiang-mai-th', name: 'Chiang Mai', country: 'Thailand', region: 'Asia', lat: 18.7883, lng: 98.9853 },
  { id: 'bali-id', name: 'Bali', country: 'Indonesia', region: 'Asia', lat: -8.3405, lng: 115.0920 },
  { id: 'hanoi-vn', name: 'Hanoi', country: 'Vietnam', region: 'Asia', lat: 21.0285, lng: 105.8542 },
  { id: 'ho-chi-minh-vn', name: 'Ho Chi Minh City', country: 'Vietnam', region: 'Asia', lat: 10.8231, lng: 106.6297 },
]

// Helper functions
export const getPopularCities = (): CityData[] => {
  return CITIES_DATABASE.filter(city => city.popular)
}

export const searchCities = (query: string): CityData[] => {
  if (!query || query.length < 2) return getPopularCities()
  
  const lowercaseQuery = query.toLowerCase()
  return CITIES_DATABASE.filter(city => 
    city.name.toLowerCase().includes(lowercaseQuery) ||
    city.country.toLowerCase().includes(lowercaseQuery)
  ).sort((a, b) => {
    // Prioritize exact matches and popular cities
    const aStartsWithQuery = a.name.toLowerCase().startsWith(lowercaseQuery)
    const bStartsWithQuery = b.name.toLowerCase().startsWith(lowercaseQuery)
    
    if (aStartsWithQuery && !bStartsWithQuery) return -1
    if (!aStartsWithQuery && bStartsWithQuery) return 1
    
    if (a.popular && !b.popular) return -1
    if (!a.popular && b.popular) return 1
    
    return a.name.localeCompare(b.name)
  })
}

export const getCityById = (id: string): CityData | undefined => {
  return CITIES_DATABASE.find(city => city.id === id)
}

export const formatCityDisplay = (city: CityData): string => {
  return `${city.name}, ${city.country}`
}