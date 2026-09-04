import { LAUNCH_CITIES, LaunchCity } from '../data/launchCities';

export interface PincodeValidationResult {
  isValidFormat: boolean;
  isLaunchCity: boolean;
  city?: LaunchCity;
  cityName?: string;
  state?: string;
  message: string;
  suggestedCities?: string[];
}

// Prefix mappings for the 12 official launch cities
// Note: India PIN codes are 6 digits.
export function validatePincode(pincode: string): PincodeValidationResult {
  const cleaned = pincode.trim().replace(/\D/g, '');

  if (cleaned.length !== 6) {
    return {
      isValidFormat: false,
      isLaunchCity: false,
      message: 'Please enter a valid 6-digit Indian PIN code.',
    };
  }

  // 1. Delhi NCR (Delhi: 11xxxx)
  if (cleaned.startsWith('11')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'delhi');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Delhi',
      state: 'Delhi NCR',
      message: `Live in Delhi NCR (${cleaned})! 120+ verified companions available within 15 minutes.`,
    };
  }

  // 2. Gurgaon / Gurugram (122xxx)
  if (cleaned.startsWith('122')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'gurgaon');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Gurgaon',
      state: 'Haryana (NCR)',
      message: `Live in Gurgaon (${cleaned})! 85+ verified companions available near Cyber Hub & Golf Course Road.`,
    };
  }

  // 3. Noida / Greater Noida (2013xx)
  if (cleaned.startsWith('2013')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'noida');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Noida',
      state: 'Uttar Pradesh (NCR)',
      message: `Live in Noida (${cleaned})! 70+ verified companions ready across Sector 18, 62 & expressways.`,
    };
  }

  // 4. Ghaziabad (2010xx)
  if (cleaned.startsWith('2010')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'ghaziabad');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Ghaziabad',
      state: 'Uttar Pradesh (NCR)',
      message: `Live in Ghaziabad (${cleaned})! 35+ verified companions active in Indirapuram & Raj Nagar.`,
    };
  }

  // 5. Chandigarh (160xxx)
  if (cleaned.startsWith('160')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'chandigarh');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Chandigarh',
      state: 'Punjab / Haryana',
      message: `Live in Chandigarh (${cleaned})! 50+ verified companions ready near Sector 17 & Sukhna Lake.`,
    };
  }

  // 6. Dehradun (248xxx)
  if (cleaned.startsWith('248')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'dehradun');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Dehradun',
      state: 'Uttarakhand',
      message: `Live in Dehradun (${cleaned})! 30+ verified companions active across Rajpur Rd & Foothills.`,
    };
  }

  // 7. Meerut (250xxx)
  if (cleaned.startsWith('250')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'meerut');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Meerut',
      state: 'Uttar Pradesh',
      message: `Live in Meerut (${cleaned})! 25+ verified companions active across Abu Lane & University Road.`,
    };
  }

  // 8. Lucknow (226xxx)
  if (cleaned.startsWith('226')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'lucknow');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Lucknow',
      state: 'Uttar Pradesh',
      message: `Live in Lucknow (${cleaned})! 50+ verified companions active across Hazratganj & Gomti Nagar.`,
    };
  }

  // 9. Jaipur (302xxx, 303xxx)
  if (cleaned.startsWith('302') || cleaned.startsWith('303')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'jaipur');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Jaipur',
      state: 'Rajasthan',
      message: `Live in Jaipur (${cleaned})! 60+ verified companions active across C-Scheme & Malviya Nagar.`,
    };
  }

  // 10. Mumbai (400xxx)
  if (cleaned.startsWith('400')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'mumbai');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Mumbai',
      state: 'Maharashtra',
      message: `Live in Mumbai (${cleaned})! 150+ verified companions active in Bandra, Juhu, Colaba & suburbs.`,
    };
  }

  // 11. Indore (452xxx, 453xxx)
  if (cleaned.startsWith('452') || cleaned.startsWith('453')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'indore');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Indore',
      state: 'Madhya Pradesh',
      message: `Live in Indore (${cleaned})! 45+ verified companions active in Vijay Nagar & Chappan Dukan.`,
    };
  }

  // 12. Bangalore / Bengaluru (560xxx, 562xxx)
  if (cleaned.startsWith('560') || cleaned.startsWith('562')) {
    const city = LAUNCH_CITIES.find(c => c.id === 'bangalore');
    return {
      isValidFormat: true,
      isLaunchCity: true,
      city,
      cityName: 'Bangalore',
      state: 'Karnataka',
      message: `Live in Bangalore (${cleaned})! 140+ verified companions active in Indiranagar, Koramangala & Whitefield.`,
    };
  }

  // Detected non-launch areas (e.g. Kolkata, Chennai, Hyderabad, Pune, Ahmedabad, Patna, etc.)
  let nonLaunchRegion = 'your area';
  if (cleaned.startsWith('700') || cleaned.startsWith('71')) nonLaunchRegion = 'Kolkata / West Bengal';
  else if (cleaned.startsWith('600')) nonLaunchRegion = 'Chennai / Tamil Nadu';
  else if (cleaned.startsWith('500')) nonLaunchRegion = 'Hyderabad / Telangana';
  else if (cleaned.startsWith('411')) nonLaunchRegion = 'Pune / Maharashtra';
  else if (cleaned.startsWith('380')) nonLaunchRegion = 'Ahmedabad / Gujarat';
  else if (cleaned.startsWith('800')) nonLaunchRegion = 'Patna / Bihar';
  else if (cleaned.startsWith('141')) nonLaunchRegion = 'Ludhiana / Punjab';
  else if (cleaned.startsWith('208')) nonLaunchRegion = 'Kanpur / UP';
  else if (cleaned.startsWith('682')) nonLaunchRegion = 'Kochi / Kerala';

  return {
    isValidFormat: true,
    isLaunchCity: false,
    cityName: nonLaunchRegion,
    message: `Coverage expanding soon to ${nonLaunchRegion} (${cleaned}). Browse companions in our active cities below:`,
    suggestedCities: LAUNCH_CITIES.map(c => c.name),
  };
}
