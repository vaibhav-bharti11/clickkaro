import { CompanionProfile, BookingRequest, SeekerProfile } from '../types';

export const TEST_SEEKER: SeekerProfile = {
  id: 'seeker-vaibhav',
  name: 'Vaibhav Bharti',
  phone: '+91 98765 43210',
  city: 'Delhi',
  pinCode: '110001',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80',
  membershipPlan: '3 Months Subscription (₹999)',
  subscriptionActive: true,
  bookingsCount: 2,
};

export const TEST_COMPANION: CompanionProfile = {
  "id": "comp-indore-10",
  "name": "Rohit Raghuvanshi",
  "age": 26,
  "city": "Indore",
  "pinCode": "452016",
  "rating": 4.98,
  "reviewCount": 312,
  "hourlyRate": 1499,
  "avatarUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
  "bio": "Fitness coach and movie buff. Great buddy for active sports, gym accompany, and relaxed weekend meetups.",
  "badges": [
    "Aadhaar KYC",
    "Elite Host",
    "Conversationalist"
  ],
  "services": [
    "travel-partner",
    "coffee-partner",
    "hangout"
  ],
  "verifiedKYC": true,
  "online": true,
  "distanceKm": 4.8,
  "languages": [
    "Hindi",
    "English"
  ]
};

export const MOCK_COMPANIONS: CompanionProfile[] = [
  {
    "id": "comp-indore-10",
    "name": "Rohit Raghuvanshi",
    "age": 26,
    "city": "Indore",
    "pinCode": "452016",
    "rating": 4.98,
    "reviewCount": 312,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    "bio": "Fitness coach and movie buff. Great buddy for active sports, gym accompany, and relaxed weekend meetups.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-dehradun-10",
    "name": "Devendra Panwar",
    "age": 28,
    "city": "Dehradun",
    "pinCode": "248006",
    "rating": 4.98,
    "reviewCount": 216,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    "bio": "Civil engineer and travel enthusiast. Great conversationalist for highway road trips, fine dining, and cultural events.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-mumbai-10",
    "name": "Devendra Mehta",
    "age": 27,
    "city": "Mumbai",
    "pinCode": "400058",
    "rating": 4.98,
    "reviewCount": 324,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=600&auto=format&fit=crop&q=80",
    "bio": "Commercial pilot & fitness enthusiast. Polite, calm company for weekend getaways to Alibaug and fine dining.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-delhi-10",
    "name": "Karan Grover",
    "age": 26,
    "city": "Delhi",
    "pinCode": "110003",
    "rating": 4.98,
    "reviewCount": 228,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=600&auto=format&fit=crop&q=80",
    "bio": "Commercial pilot cadet & fitness enthusiast. Calm, respectful company for evening drives and fine dining.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-meerut-10",
    "name": "Rishabh Verma",
    "age": 26,
    "city": "Meerut",
    "pinCode": "250005",
    "rating": 4.98,
    "reviewCount": 288,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    "bio": "E-commerce specialist & music producer. Cheerful, polite company for evening hangs and weekend parties.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-bangalore-10",
    "name": "Vikram Sundaram",
    "age": 27,
    "city": "Bangalore",
    "pinCode": "560008",
    "rating": 4.98,
    "reviewCount": 276,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=600&auto=format&fit=crop&q=80",
    "bio": "Marathoner and software architect. Great companion for active sports, movies, and late-night highway drives.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-gurgaon-10",
    "name": "Harsh Vardhan",
    "age": 27,
    "city": "Gurgaon",
    "pinCode": "122003",
    "rating": 4.98,
    "reviewCount": 240,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    "bio": "Commercial real estate consultant. Eloquent, well-traveled partner for conferences, VIP galas, and fine dining.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-chandigarh-10",
    "name": "Angad Bajwa",
    "age": 26,
    "city": "Chandigarh",
    "pinCode": "160047",
    "rating": 4.98,
    "reviewCount": 264,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    "bio": "Pilot and fitness trainer. Respectful, polished company for outdoor activities, movies, and mountain getaways.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-jaipur-10",
    "name": "Kushagra Agarwal",
    "age": 27,
    "city": "Jaipur",
    "pinCode": "302006",
    "rating": 4.98,
    "reviewCount": 300,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=600&auto=format&fit=crop&q=80",
    "bio": "Startup investor. Intelligent, respectful partner for business conferences, club dining, and networking events.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-noida-10",
    "name": "Varun Tandon",
    "age": 28,
    "city": "Noida",
    "pinCode": "201305",
    "rating": 4.98,
    "reviewCount": 252,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=600&auto=format&fit=crop&q=80",
    "bio": "Media producer with vast network in Film City. Engaging companion for red carpet events, concerts, and lounge parties.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-mumbai-9",
    "name": "Natasha Singhal",
    "age": 25,
    "city": "Mumbai",
    "pinCode": "400049",
    "rating": 4.97,
    "reviewCount": 305,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    "bio": "Advertising producer in Andheri West. Fun, sharp, and verified companion for party events, comedy clubs, and dining.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-delhi-9",
    "name": "Zoya Khan",
    "age": 24,
    "city": "Delhi",
    "pinCode": "110024",
    "rating": 4.97,
    "reviewCount": 209,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    "bio": "Film & media coordinator in Defence Colony. Sparkling conversationalist for film screenings, live gigs, and lounge dining.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-noida-9",
    "name": "Radhika Nair",
    "age": 23,
    "city": "Noida",
    "pinCode": "201304",
    "rating": 4.97,
    "reviewCount": 233,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&auto=format&fit=crop&q=80",
    "bio": "Psychology student in Knowledge Park. High emotional intelligence, warm communicator for thoughtful discussions.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-bangalore-9",
    "name": "Prerna Varma",
    "age": 25,
    "city": "Bangalore",
    "pinCode": "560025",
    "rating": 4.97,
    "reviewCount": 257,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    "bio": "Event marketer & clubbing guide. Fun, stylish companion for weekend rooftop lounges and VIP celebrations.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-meerut-9",
    "name": "Divya Chauhan",
    "age": 24,
    "city": "Meerut",
    "pinCode": "250004",
    "rating": 4.97,
    "reviewCount": 269,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&auto=format&fit=crop&q=80",
    "bio": "Hospitality manager in Meerut Cantt. Verified KYC with high professionalism for dinner parties and family functions.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-gurgaon-9",
    "name": "Tanya Dewan",
    "age": 23,
    "city": "Gurgaon",
    "pinCode": "122001",
    "rating": 4.97,
    "reviewCount": 221,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&auto=format&fit=crop&q=80",
    "bio": "Fashion merchandiser loving Galleria Market evening strolls, aesthetic photography, and luxury dining.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-indore-9",
    "name": "Aditi Solanki",
    "age": 23,
    "city": "Indore",
    "pinCode": "452008",
    "rating": 4.97,
    "reviewCount": 293,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80",
    "bio": "Psychology researcher with great empathy and polite demeanor for peaceful dinner talks and sunset strolls.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-jaipur-9",
    "name": "Meenakshi Tanwar",
    "age": 25,
    "city": "Jaipur",
    "pinCode": "302004",
    "rating": 4.97,
    "reviewCount": 281,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&auto=format&fit=crop&q=80",
    "bio": "Classical singer & cultural host. Dignified, polite presence for royal dining, weddings, and formal evenings.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-chandigarh-9",
    "name": "Parneet Randhawa",
    "age": 24,
    "city": "Chandigarh",
    "pinCode": "160019",
    "rating": 4.97,
    "reviewCount": 245,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80",
    "bio": "Luxury event planner. Eloquent, verified VIP companion for high-profile weddings, gala dinners, and private outings.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-dehradun-9",
    "name": "Mehak Kashyap",
    "age": 23,
    "city": "Dehradun",
    "pinCode": "248008",
    "rating": 4.97,
    "reviewCount": 197,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80",
    "bio": "Hospitality graduate who loves luxury stays and scenic mountain viewpoint road trips. Eloquent, polite, and verified.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 4.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-chandigarh-8",
    "name": "Jasleen Virdi",
    "age": 23,
    "city": "Chandigarh",
    "pinCode": "160036",
    "rating": 4.96,
    "reviewCount": 226,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    "bio": "Creative writer & theatre artist. Great listener and charismatic conversationalist for coffee talks and play screenings.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-mumbai-8",
    "name": "Alisha Fernandes",
    "age": 24,
    "city": "Mumbai",
    "pinCode": "400053",
    "rating": 4.96,
    "reviewCount": 286,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    "bio": "Theatre actress & literature buff in Versova. Energetic, expressive friend for play screenings, beach walks, and coffee.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-jaipur-8",
    "name": "Suhani Pareek",
    "age": 24,
    "city": "Jaipur",
    "pinCode": "302015",
    "rating": 4.96,
    "reviewCount": 262,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    "bio": "Pastry chef loving artisan cafes, weekend brunches, and photography walks along Hawa Mahal circuit.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-meerut-8",
    "name": "Ritika Gupta",
    "age": 23,
    "city": "Meerut",
    "pinCode": "250110",
    "rating": 4.96,
    "reviewCount": 250,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&auto=format&fit=crop&q=80",
    "bio": "Interior styling student. Loving cozy cafes, boutique shopping, and aesthetic photo walks in Cantt area.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-gurgaon-8",
    "name": "Kritika Sood",
    "age": 24,
    "city": "Gurgaon",
    "pinCode": "122018",
    "rating": 4.96,
    "reviewCount": 202,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&auto=format&fit=crop&q=80",
    "bio": "Yoga instructor and nutrition coach in Nirvana Country. Calm, uplifting presence for healthy dining and scenic walks.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-dehradun-8",
    "name": "Tanvi Semwal",
    "age": 24,
    "city": "Dehradun",
    "pinCode": "248003",
    "rating": 4.96,
    "reviewCount": 178,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    "bio": "Art curator & photography lover. Enjoy capturing aesthetic moments, heritage walks, and visiting botanical gardens.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-noida-8",
    "name": "Bhavna Pandey",
    "age": 24,
    "city": "Noida",
    "pinCode": "201309",
    "rating": 4.96,
    "reviewCount": 214,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    "bio": "Botanical artist living near Grand Venice. Enjoys calm cafe afternoons, photography walks, and weekend road trips.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-delhi-8",
    "name": "Natasha Dhingra",
    "age": 23,
    "city": "Delhi",
    "pinCode": "110017",
    "rating": 4.96,
    "reviewCount": 190,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    "bio": "Classical dancer & literature enthusiast. Great conversationalist for cafe dates in Majnu ka Tilla and theater festivals.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-bangalore-8",
    "name": "Tara Shenoy",
    "age": 23,
    "city": "Bangalore",
    "pinCode": "560001",
    "rating": 4.96,
    "reviewCount": 238,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    "bio": "Biotech researcher & yoga lover in Koramangala. Warm, grounded presence for healthy dining and deep conversations.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-indore-8",
    "name": "Kavita Joshi",
    "age": 24,
    "city": "Indore",
    "pinCode": "452003",
    "rating": 4.96,
    "reviewCount": 274,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    "bio": "Interior designer loving cafe aesthetics, art walks, and weekend shopping in C21 mall.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-bangalore-7",
    "name": "Aditya Swaminathan",
    "age": 28,
    "city": "Bangalore",
    "pinCode": "560034",
    "rating": 4.94,
    "reviewCount": 219,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80",
    "bio": "Fintech executive & coffee connoisseur. Respectful and eloquent companion for corporate dinners and weekend brunches.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-dehradun-7",
    "name": "Siddharth Chauhan",
    "age": 27,
    "city": "Dehradun",
    "pinCode": "248009",
    "rating": 4.94,
    "reviewCount": 159,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    "bio": "Tech consultant working remotely. Available for evening dinner companionships, social networking, and weekend movie nights.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-gurgaon-7",
    "name": "Armaan Chadha",
    "age": 28,
    "city": "Gurgaon",
    "pinCode": "122009",
    "rating": 4.94,
    "reviewCount": 183,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    "bio": "Automobile enthusiast & clubbing guide in Sector 29. Great company for weekend road trips and lounge parties.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-jaipur-7",
    "name": "Digvijay Jhala",
    "age": 26,
    "city": "Jaipur",
    "pinCode": "302017",
    "rating": 4.94,
    "reviewCount": 243,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80",
    "bio": "Rider & cafe owner. Perfect companion for highway bike/car road trips, craft cafes, and music festivals.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-noida-7",
    "name": "Samarth Aggarwal",
    "age": 26,
    "city": "Noida",
    "pinCode": "201307",
    "rating": 4.94,
    "reviewCount": 195,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80",
    "bio": "E-commerce manager in Sector 16. Cheerful companion for mall visits, gaming arcades, and street food tours.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-mumbai-7",
    "name": "Farhan Contractor",
    "age": 28,
    "city": "Mumbai",
    "pinCode": "400001",
    "rating": 4.94,
    "reviewCount": 267,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80",
    "bio": "Restaurateur and food critic. Incredible company for culinary explorations, private tasting sessions, and weekend clubbing.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-indore-7",
    "name": "Yashwardhan Holkar",
    "age": 28,
    "city": "Indore",
    "pinCode": "452010",
    "rating": 4.94,
    "reviewCount": 255,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    "bio": "Heritage enthusiast & marathon runner. Calm, cultured conversationalist for historical monuments and upscale dinners.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-meerut-7",
    "name": "Nitin Kaushik",
    "age": 28,
    "city": "Meerut",
    "pinCode": "250002",
    "rating": 4.94,
    "reviewCount": 231,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    "bio": "Architect and photographer. Great eye for aesthetics and great company for weekend road trips and restaurant visits.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-delhi-7",
    "name": "Vikramaditya Sen",
    "age": 28,
    "city": "Delhi",
    "pinCode": "110016",
    "rating": 4.94,
    "reviewCount": 171,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80",
    "bio": "Architect & heritage walk organizer in Old Delhi & Mehrauli. Passionate about food history and independent cinema.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-chandigarh-7",
    "name": "Zorawar Cheema",
    "age": 28,
    "city": "Chandigarh",
    "pinCode": "160022",
    "rating": 4.94,
    "reviewCount": 207,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    "bio": "Architect in Sector 8. Deep knowledge of Corbusier heritage, art galleries, and upscale lounge culture.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 3.6,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-noida-6",
    "name": "Aditi Kaushik",
    "age": 25,
    "city": "Noida",
    "pinCode": "201301",
    "rating": 4.92,
    "reviewCount": 176,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&auto=format&fit=crop&q=80",
    "bio": "Digital strategist with high hospitality standard. Passionate about weekend brunch, live music, and scenic sunset drives.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-jaipur-6",
    "name": "Bhavna Sharma",
    "age": 23,
    "city": "Jaipur",
    "pinCode": "302001",
    "rating": 4.92,
    "reviewCount": 224,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&auto=format&fit=crop&q=80",
    "bio": "Journalism student with keen interest in literature festivals and indie cinema. Great listener and vibrant friend.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-delhi-6",
    "name": "Sneha Kapoor",
    "age": 24,
    "city": "Delhi",
    "pinCode": "110001",
    "rating": 4.92,
    "reviewCount": 152,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80",
    "bio": "Law researcher in Saket. Respectful, articulate company for gallery openings, heritage monuments, and peaceful evening walks.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-mumbai-6",
    "name": "Zoya Bilimoria",
    "age": 26,
    "city": "Mumbai",
    "pinCode": "400050",
    "rating": 4.92,
    "reviewCount": 248,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80",
    "bio": "Brand director in Lower Parel. Sophisticated dinner companion for gourmet restaurants in Palladium and networking events.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-gurgaon-6",
    "name": "Pooja Sethi",
    "age": 25,
    "city": "Gurgaon",
    "pinCode": "122002",
    "rating": 4.92,
    "reviewCount": 164,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&auto=format&fit=crop&q=80",
    "bio": "Corporate lawyer with a love for sushi and wine tasting. Cultured, engaging conversationalist for formal dinners.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-dehradun-6",
    "name": "Rhea Joshi",
    "age": 23,
    "city": "Dehradun",
    "pinCode": "248001",
    "rating": 4.92,
    "reviewCount": 140,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
    "bio": "Psychology graduate with high EQ. A patient listener and upbeat friend for deep conversations, museum visits, and quiet tea sessions.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-chandigarh-6",
    "name": "Simran Sandhu",
    "age": 25,
    "city": "Chandigarh",
    "pinCode": "160017",
    "rating": 4.92,
    "reviewCount": 188,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
    "bio": "Dentist and classical music lover. Graceful, respectful companion for peaceful dinners, live concerts, and garden walks.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-bangalore-6",
    "name": "Kavitha Murthy",
    "age": 24,
    "city": "Bangalore",
    "pinCode": "560038",
    "rating": 4.92,
    "reviewCount": 200,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80",
    "bio": "Architect in MG Road. Cultured and thoughtful conversationalist for heritage walks, Cubbon Park strolls, and art galleries.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-indore-6",
    "name": "Saloni Kasliwal",
    "age": 25,
    "city": "Indore",
    "pinCode": "452001",
    "rating": 4.92,
    "reviewCount": 236,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
    "bio": "Event curator in AB Road. Energetic and sophisticated company for luxury dining, private parties, and road trips.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-meerut-6",
    "name": "Pooja Bhardwaj",
    "age": 25,
    "city": "Meerut",
    "pinCode": "250001",
    "rating": 4.92,
    "reviewCount": 212,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&auto=format&fit=crop&q=80",
    "bio": "Educator and cultural enthusiast. Elegant conversationalist for formal dinners and peaceful afternoon tea.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 3.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-noida-5",
    "name": "Garima Saxena",
    "age": 23,
    "city": "Noida",
    "pinCode": "201305",
    "rating": 4.91,
    "reviewCount": 157,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&auto=format&fit=crop&q=80",
    "bio": "Literature teacher & theatre performer. Great listener and warm companion for tea cafes, art fairs, and poetry slams.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-dehradun-5",
    "name": "Ishita Bhatt",
    "age": 24,
    "city": "Dehradun",
    "pinCode": "248006",
    "rating": 4.91,
    "reviewCount": 121,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    "bio": "Digital marketer & foodie explorer. Known for top restaurant recommendations, weekend brunch dates, and Elante/Pacific mall visits.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-bangalore-5",
    "name": "Shreya Kamath",
    "age": 25,
    "city": "Bangalore",
    "pinCode": "560008",
    "rating": 4.91,
    "reviewCount": 181,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
    "bio": "Food journalist in HSR Layout. Knows every hidden culinary gem, ramen spot, and third-wave roastery in the city.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-mumbai-5",
    "name": "Tara Dsouza",
    "age": 24,
    "city": "Mumbai",
    "pinCode": "400058",
    "rating": 4.91,
    "reviewCount": 229,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
    "bio": "Musician & voiceover artist in Khar. Warm, creative companion for live concerts, artisan cafes, and vinyl listening bars.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-gurgaon-5",
    "name": "Riddhi Mittal",
    "age": 23,
    "city": "Gurgaon",
    "pinCode": "122003",
    "rating": 4.91,
    "reviewCount": 145,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&auto=format&fit=crop&q=80",
    "bio": "MBA graduate & social media consultant. Passionate about cafe hopping, bowling, and attending music concerts.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-jaipur-5",
    "name": "Diya Khandelwal",
    "age": 24,
    "city": "Jaipur",
    "pinCode": "302006",
    "rating": 4.91,
    "reviewCount": 205,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&auto=format&fit=crop&q=80",
    "bio": "Textile curator in Tonk Road. Cheerful conversationalist for flea markets, handloom boutiques, and high-tea afternoons.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-indore-5",
    "name": "Muskan Tiwari",
    "age": 23,
    "city": "Indore",
    "pinCode": "452016",
    "rating": 4.91,
    "reviewCount": 217,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    "bio": "Literature post-grad with a cheerful vibe. Wonderful companion for deep conversations, bookstores, and tea lounges.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-meerut-5",
    "name": "Kritika Som",
    "age": 23,
    "city": "Meerut",
    "pinCode": "250005",
    "rating": 4.91,
    "reviewCount": 193,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&auto=format&fit=crop&q=80",
    "bio": "Graphic designer in Modipuram. Enthusiastic companion for local food tours, coffee dates, and cinema outings.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-delhi-5",
    "name": "Alia Varma",
    "age": 25,
    "city": "Delhi",
    "pinCode": "110003",
    "rating": 4.91,
    "reviewCount": 133,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
    "bio": "Content creator in Greater Kailash. Loves chic rooftop dinners, sushi tastings, and weekend road trips to Neemrana.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-chandigarh-5",
    "name": "Avneet Kaur",
    "age": 24,
    "city": "Chandigarh",
    "pinCode": "160047",
    "rating": 4.91,
    "reviewCount": 169,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    "bio": "Lifestyle influencer & foodie in Sector 26. Vibrant companion for weekend nightlife, brunch at Sector 7, and fashion events.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.8,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-jaipur-4",
    "name": "Ranveer Shekhawat",
    "age": 28,
    "city": "Jaipur",
    "pinCode": "302004",
    "rating": 4.89,
    "reviewCount": 186,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    "bio": "Heritage architect. Warm, articulate guide for Nahargarh sunsets, Amer fort walks, and specialty coffee tasting.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-chandigarh-4",
    "name": "Gurkeerat Mann",
    "age": 27,
    "city": "Chandigarh",
    "pinCode": "160019",
    "rating": 4.89,
    "reviewCount": 150,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    "bio": "Tech entrepreneur & acoustic singer. Calm, well-mannered partner for road trips to Kasauli, dinners, and comedy shows.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-mumbai-4",
    "name": "Aryan Merchant",
    "age": 27,
    "city": "Mumbai",
    "pinCode": "400049",
    "rating": 4.89,
    "reviewCount": 210,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    "bio": "Architect in Marine Drive. Cultured and charming companion for heritage art deco walks, jazz clubs, and sunset dining.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-bangalore-4",
    "name": "Rohan Deshmukh",
    "age": 26,
    "city": "Bangalore",
    "pinCode": "560025",
    "rating": 4.89,
    "reviewCount": 162,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    "bio": "Product manager & guitarist. Polite and engaging companion for weekend gigs at Fandom, rooftop dining, and road trips to Nandi Hills.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-indore-4",
    "name": "Pranay Agrawal",
    "age": 27,
    "city": "Indore",
    "pinCode": "452008",
    "rating": 4.89,
    "reviewCount": 198,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    "bio": "Industrialist and guitarist. Polished, respectful companion for formal banquets, live gigs, and lounge parties.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-delhi-4",
    "name": "Aditya Oberoi",
    "age": 26,
    "city": "Delhi",
    "pinCode": "110024",
    "rating": 4.89,
    "reviewCount": 114,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    "bio": "Fintech analyst with keen interest in theater and comedy clubs in Mandi House. Polite, cultured, and polished conversationalist.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-meerut-4",
    "name": "Prashant Tomar",
    "age": 27,
    "city": "Meerut",
    "pinCode": "250004",
    "rating": 4.89,
    "reviewCount": 174,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    "bio": "Real estate developer & avid traveler. Polite and cultured company for fine dining, weddings, and business events.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-noida-4",
    "name": "Nikhil Tyagi",
    "age": 27,
    "city": "Noida",
    "pinCode": "201304",
    "rating": 4.89,
    "reviewCount": 138,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    "bio": "Fitness coach and movie buff. Polite, respectful company for IMAX screenings, casual lunches, and gym accompaniment.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-gurgaon-4",
    "name": "Manav Khurana",
    "age": 26,
    "city": "Gurgaon",
    "pinCode": "122001",
    "rating": 4.89,
    "reviewCount": 126,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    "bio": "Senior software consultant. Available for movie premieres at Ambience Mall, comedy shows, and relaxed craft beer meetups.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-dehradun-4",
    "name": "Kabir Thapa",
    "age": 25,
    "city": "Dehradun",
    "pinCode": "248008",
    "rating": 4.89,
    "reviewCount": 102,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    "bio": "Fitness trainer & fitness meetup buddy. Friendly, polite, and respectful for gym sessions, cycling trails, and weekend getaways.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 2.4,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-meerut-3",
    "name": "Garima Tyagi",
    "age": 24,
    "city": "Meerut",
    "pinCode": "250110",
    "rating": 4.88,
    "reviewCount": 155,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80",
    "bio": "Literature graduate living near University Road. Patient listener and warm companion for quiet cafes and garden strolls.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-dehradun-3",
    "name": "Ananya Sharma",
    "age": 22,
    "city": "Dehradun",
    "pinCode": "248003",
    "rating": 4.88,
    "reviewCount": 83,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    "bio": "Fashion styling intern & literature enthusiast. Great companion for indie book cafes, fine dining, and local shopping in Astley Hall.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-delhi-3",
    "name": "Simran Malhotra",
    "age": 23,
    "city": "Delhi",
    "pinCode": "110017",
    "rating": 4.88,
    "reviewCount": 95,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bio": "Fashion design graduate & lifestyle blogger. Vibrant energy for Khan Market shopping, art exhibitions at IHC, and high-tea dates.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-gurgaon-3",
    "name": "Diya Talwar",
    "age": 24,
    "city": "Gurgaon",
    "pinCode": "122018",
    "rating": 4.88,
    "reviewCount": 107,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80",
    "bio": "Interior designer & art collector in DLF Phase 5. Upbeat, elegant companion for cocktail lounges, luxury shopping, and weekend dining.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-noida-3",
    "name": "Palak Chawla",
    "age": 24,
    "city": "Noida",
    "pinCode": "201309",
    "rating": 4.88,
    "reviewCount": 119,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80",
    "bio": "UX researcher in Sector 137. Loves visiting Advant Navis nightlife, trying artisan bakeries, and long evening conversations.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-chandigarh-3",
    "name": "Meera Brar",
    "age": 23,
    "city": "Chandigarh",
    "pinCode": "160036",
    "rating": 4.88,
    "reviewCount": 131,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    "bio": "Interior stylist in Sector 17. Loves shopping walks, artisan coffee, and exploring French architecture in the city.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-bangalore-3",
    "name": "Maya Nambiar",
    "age": 23,
    "city": "Bangalore",
    "pinCode": "560001",
    "rating": 4.88,
    "reviewCount": 143,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bio": "Contemporary dancer & gallery host in Lavelle Road. Enthusiastic companion for live jazz, wine bars, and art installations.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-jaipur-3",
    "name": "Radhika Maheshwari",
    "age": 23,
    "city": "Jaipur",
    "pinCode": "302015",
    "rating": 4.88,
    "reviewCount": 167,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80",
    "bio": "History researcher living near Malviya Nagar. Delightful company for museum walks, traditional Thali dining, and folk music.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-indore-3",
    "name": "Ishani Mandloi",
    "age": 24,
    "city": "Indore",
    "pinCode": "452003",
    "rating": 4.88,
    "reviewCount": 179,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    "bio": "Fashion merchandiser loving boutique cafes in Palasia, styling sessions, and weekend highway getaways.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-mumbai-3",
    "name": "Shanaya Kapoor",
    "age": 23,
    "city": "Mumbai",
    "pinCode": "400053",
    "rating": 4.88,
    "reviewCount": 191,
    "hourlyRate": 2499,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bio": "Film production assistant in Juhu. Vibrant conversationalist for Prithvi Cafe evenings, art cinema, and weekend nightlife.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": false,
    "distanceKm": 2,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-bangalore-2",
    "name": "Dhruv Rao",
    "age": 27,
    "city": "Bangalore",
    "pinCode": "560034",
    "rating": 4.86,
    "reviewCount": 124,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bio": "AI researcher & badminton player. Intelligent conversationalist for tech meetups, board game cafes, and Koramangala dining.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-mumbai-2",
    "name": "Kabir Oberoi",
    "age": 28,
    "city": "Mumbai",
    "pinCode": "400001",
    "rating": 4.86,
    "reviewCount": 172,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bio": "Investment banker & sailing club member in Colaba. Polished, respectful partner for high-profile business dinners and yacht outings.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-dehradun-2",
    "name": "Aarav Negi",
    "age": 26,
    "city": "Dehradun",
    "pinCode": "248009",
    "rating": 4.86,
    "reviewCount": 64,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    "bio": "Outdoor trek guide and guitarist. Perfect company for scenic mountain drives, live acoustic evenings, and heritage walk around Paltan Bazaar.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-noida-2",
    "name": "Arjun Bhasin",
    "age": 26,
    "city": "Noida",
    "pinCode": "201307",
    "rating": 4.86,
    "reviewCount": 100,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bio": "Tech startup founder in Sector 62. Thoughtful company for coffee work sprints, weekend squash games, and dinner outings.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-meerut-2",
    "name": "Aakash Sirohi",
    "age": 26,
    "city": "Meerut",
    "pinCode": "250002",
    "rating": 4.86,
    "reviewCount": 136,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    "bio": "Sports gear entrepreneur & fitness lover. Upbeat companion for gym work, sports club matches, and highway cafe road trips.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-gurgaon-2",
    "name": "Reyansh Batra",
    "age": 27,
    "city": "Gurgaon",
    "pinCode": "122009",
    "rating": 4.86,
    "reviewCount": 88,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    "bio": "VC associate & marathon runner. Polite conversationalist for business events, weekend cycling, and Galleria market coffee talks.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-chandigarh-2",
    "name": "Fateh Singh Gill",
    "age": 26,
    "city": "Chandigarh",
    "pinCode": "160022",
    "rating": 4.86,
    "reviewCount": 112,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    "bio": "Sports enthusiast & cafe owner. Ideal companion for morning cycling at Sukhna Lake, golf sessions, and rooftop dining.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-delhi-2",
    "name": "Rohan Mehra",
    "age": 27,
    "city": "Delhi",
    "pinCode": "110016",
    "rating": 4.86,
    "reviewCount": 76,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bio": "Brand strategist & golf enthusiast. Ideal partner for corporate dinners, weekend social events, and upscale lounges in Chanakyapuri.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-jaipur-2",
    "name": "Yuvraj Singh Shekhawat",
    "age": 27,
    "city": "Jaipur",
    "pinCode": "302017",
    "rating": 4.86,
    "reviewCount": 148,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bio": "Polo club regular and hotelier. Polished companion for luxury heritage properties, desert camping, and formal dinners.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-indore-2",
    "name": "Akshat Jain",
    "age": 26,
    "city": "Indore",
    "pinCode": "452010",
    "rating": 4.86,
    "reviewCount": 160,
    "hourlyRate": 1999,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    "bio": "Tech consultant and sports enthusiast. Friendly, polite companion for sports clubs, coffee chats, and weekend cinema.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.6,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-jaipur-1",
    "name": "Gauri Rathore",
    "age": 24,
    "city": "Jaipur",
    "pinCode": "302001",
    "rating": 4.85,
    "reviewCount": 129,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80",
    "bio": "Jewelry designer in C-Scheme. Deep appreciation for royal heritage, rooftop palaces, candlelit dinners, and art exhibitions.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ]
  },
  {
    "id": "comp-delhi-1",
    "name": "Kavya Singhania",
    "age": 24,
    "city": "Delhi",
    "pinCode": "110001",
    "rating": 4.85,
    "reviewCount": 57,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80",
    "bio": "DU South Campus alumna & PR consultant. Perfect companion for Connaught Place cafes, Hauz Khas jazz bars, and Select Citywalk movies.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-dehradun-1",
    "name": "Priya Rawat",
    "age": 23,
    "city": "Dehradun",
    "pinCode": "248001",
    "rating": 4.85,
    "reviewCount": 45,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    "bio": "Architecture student at UPES & certified cafe conversationalist in Rajpur Road. Loving Mussoorie day trips and peaceful sunset coffee dates.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-meerut-1",
    "name": "Sonal Rastogi",
    "age": 23,
    "city": "Meerut",
    "pinCode": "250001",
    "rating": 4.85,
    "reviewCount": 117,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    "bio": "Fashion boutique owner on Abu Lane. Loving traditional dining, shopping trips, and weekend movie outings with pleasant conversation.",
    "badges": [
      "Face Verified",
      "VIP Member",
      "Top Companion"
    ],
    "services": [
      "movie-partner",
      "lunch-dinner",
      "clubbing"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-bangalore-1",
    "name": "Ananya Hegde",
    "age": 24,
    "city": "Bangalore",
    "pinCode": "560038",
    "rating": 4.85,
    "reviewCount": 105,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80",
    "bio": "Product designer in Indiranagar. Passionate about filter coffee hopping, Church Street bookshops, craft breweries, and indie gigs.",
    "badges": [
      "Official Companion",
      "100% Aadhaar KYC",
      "Top Rated Partner"
    ],
    "services": [
      "hangout",
      "coffee-partner",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English",
      "Kannada"
    ]
  },
  {
    "id": "comp-chandigarh-1",
    "name": "Harleen Dhillon",
    "age": 24,
    "city": "Chandigarh",
    "pinCode": "160017",
    "rating": 4.85,
    "reviewCount": 93,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    "bio": "Fashion model & Panjab University alumna in Sector 35. Warm, energetic conversationalist for Elante Mall, jazz lounges, and lake walks.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ]
  },
  {
    "id": "comp-mumbai-1",
    "name": "Ananya Shroff",
    "age": 25,
    "city": "Mumbai",
    "pinCode": "400050",
    "rating": 4.85,
    "reviewCount": 153,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80",
    "bio": "Fashion stylist & model in Bandra West. Verified companion for chic rooftop lounges in Soho House, beachside coffee, and movie premieres.",
    "badges": [
      "Cultural Guide",
      "Official Partner",
      "Photo Walks"
    ],
    "services": [
      "coffee-partner",
      "clubbing",
      "movie-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ]
  },
  {
    "id": "comp-noida-1",
    "name": "Shivani Goel",
    "age": 23,
    "city": "Noida",
    "pinCode": "201301",
    "rating": 4.85,
    "reviewCount": 81,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80",
    "bio": "Journalism post-grad & Sector 18 regular. Enthusiastic companion for DLF Mall of India shopping, movies, and coffee talks.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-gurgaon-1",
    "name": "Ayesha Roy",
    "age": 25,
    "city": "Gurgaon",
    "pinCode": "122002",
    "rating": 4.85,
    "reviewCount": 69,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    "bio": "Fintech product manager & Cyber Hub regular. Wonderful dinner company for Golf Course Road lounges, craft breweries, and networking.",
    "badges": [
      "Aadhaar KYC",
      "Elite Host",
      "Conversationalist"
    ],
    "services": [
      "travel-partner",
      "coffee-partner",
      "hangout"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English"
    ]
  },
  {
    "id": "comp-indore-1",
    "name": "Tanvi Patidar",
    "age": 23,
    "city": "Indore",
    "pinCode": "452001",
    "rating": 4.85,
    "reviewCount": 141,
    "hourlyRate": 1499,
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    "bio": "Food researcher & Vijay Nagar regular. The ultimate foodie companion for Chappan Dukan delicacies and Sarafa night bazaar walks.",
    "badges": [
      "Top Rated",
      "Verified Companion",
      "Luxury Dining"
    ],
    "services": [
      "hangout",
      "lunch-dinner",
      "travel-partner"
    ],
    "verifiedKYC": true,
    "online": true,
    "distanceKm": 1.2,
    "languages": [
      "Hindi",
      "English"
    ]
  }
];

export const MOCK_REQUESTS: BookingRequest[] = [
  {
    id: 'req-1',
    seekerName: 'Rohan Mehta',
    seekerPhone: '+91 98101 23456',
    seekerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    serviceTitle: 'Coffee & Conversation (2 Hours)',
    date: 'Tomorrow, 5:00 PM',
    time: '5:00 PM - 7:00 PM',
    hours: 2,
    location: 'Cyber Hub, Gurgaon',
    pinCode: '122002',
    totalEarnings: 2999,
    netPayout: 2399,
    status: 'pending',
    createdAt: '10 mins ago',
  }
];
