const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qabtetckvhwqbflvkejq.supabase.co';
const supabaseKey = 'sb_publishable_vxy4ihrEt3us-VaRbd1ewg_vPp_bVCZ';
const sb = createClient(supabaseUrl, supabaseKey);

// 10 Launch Districts with exact details and PIN codes
const DISTRICTS = [
  {
    city: 'Dehradun',
    pins: ['248001', '248009', '248003', '248008', '248006'],
    names: [
      { name: 'Priya Rawat', age: 23, gender: 'female', bio: 'Architecture student at UPES & certified cafe conversationalist in Rajpur Road. Loving Mussoorie day trips and peaceful sunset coffee dates.' },
      { name: 'Aarav Negi', age: 26, gender: 'male', bio: 'Outdoor trek guide and guitarist. Perfect company for scenic mountain drives, live acoustic evenings, and heritage walk around Paltan Bazaar.' },
      { name: 'Ananya Sharma', age: 22, gender: 'female', bio: 'Fashion styling intern & literature enthusiast. Great companion for indie book cafes, fine dining, and local shopping in Astley Hall.' },
      { name: 'Kabir Thapa', age: 25, gender: 'male', bio: 'Fitness trainer & fitness meetup buddy. Friendly, polite, and respectful for gym sessions, cycling trails, and weekend getaways.' },
      { name: 'Ishita Bhatt', age: 24, gender: 'female', bio: 'Digital marketer & foodie explorer. Known for top restaurant recommendations, weekend brunch dates, and Elante/Pacific mall visits.' },
      { name: 'Rhea Joshi', age: 23, gender: 'female', bio: 'Psychology graduate with high EQ. A patient listener and upbeat friend for deep conversations, museum visits, and quiet tea sessions.' },
      { name: 'Siddharth Chauhan', age: 27, gender: 'male', bio: 'Tech consultant working remotely. Available for evening dinner companionships, social networking, and weekend movie nights.' },
      { name: 'Tanvi Semwal', age: 24, gender: 'female', bio: 'Art curator & photography lover. Enjoy capturing aesthetic moments, heritage walks, and visiting botanical gardens.' },
      { name: 'Mehak Kashyap', age: 23, gender: 'female', bio: 'Hospitality graduate who loves luxury stays and scenic mountain viewpoint road trips. Eloquent, polite, and verified.' },
      { name: 'Devendra Panwar', age: 28, gender: 'male', bio: 'Civil engineer and travel enthusiast. Great conversationalist for highway road trips, fine dining, and cultural events.' }
    ]
  },
  {
    city: 'Delhi',
    pins: ['110001', '110016', '110017', '110024', '110003'],
    names: [
      { name: 'Kavya Singhania', age: 24, gender: 'female', bio: 'DU South Campus alumna & PR consultant. Perfect companion for Connaught Place cafes, Hauz Khas jazz bars, and Select Citywalk movies.' },
      { name: 'Rohan Mehra', age: 27, gender: 'male', bio: 'Brand strategist & golf enthusiast. Ideal partner for corporate dinners, weekend social events, and upscale lounges in Chanakyapuri.' },
      { name: 'Simran Malhotra', age: 23, gender: 'female', bio: 'Fashion design graduate & lifestyle blogger. Vibrant energy for Khan Market shopping, art exhibitions at IHC, and high-tea dates.' },
      { name: 'Aditya Oberoi', age: 26, gender: 'male', bio: 'Fintech analyst with keen interest in theater and comedy clubs in Mandi House. Polite, cultured, and polished conversationalist.' },
      { name: 'Alia Varma', age: 25, gender: 'female', bio: 'Content creator in Greater Kailash. Loves chic rooftop dinners, sushi tastings, and weekend road trips to Neemrana.' },
      { name: 'Sneha Kapoor', age: 24, gender: 'female', bio: 'Law researcher in Saket. Respectful, articulate company for gallery openings, heritage monuments, and peaceful evening walks.' },
      { name: 'Vikramaditya Sen', age: 28, gender: 'male', bio: 'Architect & heritage walk organizer in Old Delhi & Mehrauli. Passionate about food history and independent cinema.' },
      { name: 'Natasha Dhingra', age: 23, gender: 'female', bio: 'Classical dancer & literature enthusiast. Great conversationalist for cafe dates in Majnu ka Tilla and theater festivals.' },
      { name: 'Zoya Khan', age: 24, gender: 'female', bio: 'Film & media coordinator in Defence Colony. Sparkling conversationalist for film screenings, live gigs, and lounge dining.' },
      { name: 'Karan Grover', age: 26, gender: 'male', bio: 'Commercial pilot cadet & fitness enthusiast. Calm, respectful company for evening drives and fine dining.' }
    ]
  },
  {
    city: 'Gurgaon',
    pins: ['122002', '122009', '122018', '122001', '122003'],
    names: [
      { name: 'Ayesha Roy', age: 25, gender: 'female', bio: 'Fintech product manager & Cyber Hub regular. Wonderful dinner company for Golf Course Road lounges, craft breweries, and networking.' },
      { name: 'Reyansh Batra', age: 27, gender: 'male', bio: 'VC associate & marathon runner. Polite conversationalist for business events, weekend cycling, and Galleria market coffee talks.' },
      { name: 'Diya Talwar', age: 24, gender: 'female', bio: 'Interior designer & art collector in DLF Phase 5. Upbeat, elegant companion for cocktail lounges, luxury shopping, and weekend dining.' },
      { name: 'Manav Khurana', age: 26, gender: 'male', bio: 'Senior software consultant. Available for movie premieres at Ambience Mall, comedy shows, and relaxed craft beer meetups.' },
      { name: 'Riddhi Mittal', age: 23, gender: 'female', bio: 'MBA graduate & social media consultant. Passionate about cafe hopping, bowling, and attending music concerts.' },
      { name: 'Pooja Sethi', age: 25, gender: 'female', bio: 'Corporate lawyer with a love for sushi and wine tasting. Cultured, engaging conversationalist for formal dinners.' },
      { name: 'Armaan Chadha', age: 28, gender: 'male', bio: 'Automobile enthusiast & clubbing guide in Sector 29. Great company for weekend road trips and lounge parties.' },
      { name: 'Kritika Sood', age: 24, gender: 'female', bio: 'Yoga instructor and nutrition coach in Nirvana Country. Calm, uplifting presence for healthy dining and scenic walks.' },
      { name: 'Tanya Dewan', age: 23, gender: 'female', bio: 'Fashion merchandiser loving Galleria Market evening strolls, aesthetic photography, and luxury dining.' },
      { name: 'Harsh Vardhan', age: 27, gender: 'male', bio: 'Commercial real estate consultant. Eloquent, well-traveled partner for conferences, VIP galas, and fine dining.' }
    ]
  },
  {
    city: 'Noida',
    pins: ['201301', '201307', '201309', '201304', '201305'],
    names: [
      { name: 'Shivani Goel', age: 23, gender: 'female', bio: 'Journalism post-grad & Sector 18 regular. Enthusiastic companion for DLF Mall of India shopping, movies, and coffee talks.' },
      { name: 'Arjun Bhasin', age: 26, gender: 'male', bio: 'Tech startup founder in Sector 62. Thoughtful company for coffee work sprints, weekend squash games, and dinner outings.' },
      { name: 'Palak Chawla', age: 24, gender: 'female', bio: 'UX researcher in Sector 137. Loves visiting Advant Navis nightlife, trying artisan bakeries, and long evening conversations.' },
      { name: 'Nikhil Tyagi', age: 27, gender: 'male', bio: 'Fitness coach and movie buff. Polite, respectful company for IMAX screenings, casual lunches, and gym accompaniment.' },
      { name: 'Garima Saxena', age: 23, gender: 'female', bio: 'Literature teacher & theatre performer. Great listener and warm companion for tea cafes, art fairs, and poetry slams.' },
      { name: 'Aditi Kaushik', age: 25, gender: 'female', bio: 'Digital strategist with high hospitality standard. Passionate about weekend brunch, live music, and scenic sunset drives.' },
      { name: 'Samarth Aggarwal', age: 26, gender: 'male', bio: 'E-commerce manager in Sector 16. Cheerful companion for mall visits, gaming arcades, and street food tours.' },
      { name: 'Bhavna Pandey', age: 24, gender: 'female', bio: 'Botanical artist living near Grand Venice. Enjoys calm cafe afternoons, photography walks, and weekend road trips.' },
      { name: 'Radhika Nair', age: 23, gender: 'female', bio: 'Psychology student in Knowledge Park. High emotional intelligence, warm communicator for thoughtful discussions.' },
      { name: 'Varun Tandon', age: 28, gender: 'male', bio: 'Media producer with vast network in Film City. Engaging companion for red carpet events, concerts, and lounge parties.' }
    ]
  },
  {
    city: 'Chandigarh',
    pins: ['160017', '160022', '160036', '160019', '160047'],
    names: [
      { name: 'Harleen Dhillon', age: 24, gender: 'female', bio: 'Fashion model & Panjab University alumna in Sector 35. Warm, energetic conversationalist for Elante Mall, jazz lounges, and lake walks.' },
      { name: 'Fateh Singh Gill', age: 26, gender: 'male', bio: 'Sports enthusiast & cafe owner. Ideal companion for morning cycling at Sukhna Lake, golf sessions, and rooftop dining.' },
      { name: 'Meera Brar', age: 23, gender: 'female', bio: 'Interior stylist in Sector 17. Loves shopping walks, artisan coffee, and exploring French architecture in the city.' },
      { name: 'Gurkeerat Mann', age: 27, gender: 'male', bio: 'Tech entrepreneur & acoustic singer. Calm, well-mannered partner for road trips to Kasauli, dinners, and comedy shows.' },
      { name: 'Avneet Kaur', age: 24, gender: 'female', bio: 'Lifestyle influencer & foodie in Sector 26. Vibrant companion for weekend nightlife, brunch at Sector 7, and fashion events.' },
      { name: 'Simran Sandhu', age: 25, gender: 'female', bio: 'Dentist and classical music lover. Graceful, respectful companion for peaceful dinners, live concerts, and garden walks.' },
      { name: 'Zorawar Cheema', age: 28, gender: 'male', bio: 'Architect in Sector 8. Deep knowledge of Corbusier heritage, art galleries, and upscale lounge culture.' },
      { name: 'Jasleen Virdi', age: 23, gender: 'female', bio: 'Creative writer & theatre artist. Great listener and charismatic conversationalist for coffee talks and play screenings.' },
      { name: 'Parneet Randhawa', age: 24, gender: 'female', bio: 'Luxury event planner. Eloquent, verified VIP companion for high-profile weddings, gala dinners, and private outings.' },
      { name: 'Angad Bajwa', age: 26, gender: 'male', bio: 'Pilot and fitness trainer. Respectful, polished company for outdoor activities, movies, and mountain getaways.' }
    ]
  },
  {
    city: 'Bangalore',
    pins: ['560038', '560034', '560001', '560025', '560008'],
    names: [
      { name: 'Ananya Hegde', age: 24, gender: 'female', bio: 'Product designer in Indiranagar. Passionate about filter coffee hopping, Church Street bookshops, craft breweries, and indie gigs.' },
      { name: 'Dhruv Rao', age: 27, gender: 'male', bio: 'AI researcher & badminton player. Intelligent conversationalist for tech meetups, board game cafes, and Koramangala dining.' },
      { name: 'Maya Nambiar', age: 23, gender: 'female', bio: 'Contemporary dancer & gallery host in Lavelle Road. Enthusiastic companion for live jazz, wine bars, and art installations.' },
      { name: 'Rohan Deshmukh', age: 26, gender: 'male', bio: 'Product manager & guitarist. Polite and engaging companion for weekend gigs at Fandom, rooftop dining, and road trips to Nandi Hills.' },
      { name: 'Shreya Kamath', age: 25, gender: 'female', bio: 'Food journalist in HSR Layout. Knows every hidden culinary gem, ramen spot, and third-wave roastery in the city.' },
      { name: 'Kavitha Murthy', age: 24, gender: 'female', bio: 'Architect in MG Road. Cultured and thoughtful conversationalist for heritage walks, Cubbon Park strolls, and art galleries.' },
      { name: 'Aditya Swaminathan', age: 28, gender: 'male', bio: 'Fintech executive & coffee connoisseur. Respectful and eloquent companion for corporate dinners and weekend brunches.' },
      { name: 'Tara Shenoy', age: 23, gender: 'female', bio: 'Biotech researcher & yoga lover in Koramangala. Warm, grounded presence for healthy dining and deep conversations.' },
      { name: 'Prerna Varma', age: 25, gender: 'female', bio: 'Event marketer & clubbing guide. Fun, stylish companion for weekend rooftop lounges and VIP celebrations.' },
      { name: 'Vikram Sundaram', age: 27, gender: 'male', bio: 'Marathoner and software architect. Great companion for active sports, movies, and late-night highway drives.' }
    ]
  },
  {
    city: 'Meerut',
    pins: ['250001', '250002', '250110', '250004', '250005'],
    names: [
      { name: 'Sonal Rastogi', age: 23, gender: 'female', bio: 'Fashion boutique owner on Abu Lane. Loving traditional dining, shopping trips, and weekend movie outings with pleasant conversation.' },
      { name: 'Aakash Sirohi', age: 26, gender: 'male', bio: 'Sports gear entrepreneur & fitness lover. Upbeat companion for gym work, sports club matches, and highway cafe road trips.' },
      { name: 'Garima Tyagi', age: 24, gender: 'female', bio: 'Literature graduate living near University Road. Patient listener and warm companion for quiet cafes and garden strolls.' },
      { name: 'Prashant Tomar', age: 27, gender: 'male', bio: 'Real estate developer & avid traveler. Polite and cultured company for fine dining, weddings, and business events.' },
      { name: 'Kritika Som', age: 23, gender: 'female', bio: 'Graphic designer in Modipuram. Enthusiastic companion for local food tours, coffee dates, and cinema outings.' },
      { name: 'Pooja Bhardwaj', age: 25, gender: 'female', bio: 'Educator and cultural enthusiast. Elegant conversationalist for formal dinners and peaceful afternoon tea.' },
      { name: 'Nitin Kaushik', age: 28, gender: 'male', bio: 'Architect and photographer. Great eye for aesthetics and great company for weekend road trips and restaurant visits.' },
      { name: 'Ritika Gupta', age: 23, gender: 'female', bio: 'Interior styling student. Loving cozy cafes, boutique shopping, and aesthetic photo walks in Cantt area.' },
      { name: 'Divya Chauhan', age: 24, gender: 'female', bio: 'Hospitality manager in Meerut Cantt. Verified KYC with high professionalism for dinner parties and family functions.' },
      { name: 'Rishabh Verma', age: 26, gender: 'male', bio: 'E-commerce specialist & music producer. Cheerful, polite company for evening hangs and weekend parties.' }
    ]
  },
  {
    city: 'Jaipur',
    pins: ['302001', '302017', '302015', '302004', '302006'],
    names: [
      { name: 'Gauri Rathore', age: 24, gender: 'female', bio: 'Jewelry designer in C-Scheme. Deep appreciation for royal heritage, rooftop palaces, candlelit dinners, and art exhibitions.' },
      { name: 'Yuvraj Singh Shekhawat', age: 27, gender: 'male', bio: 'Polo club regular and hotelier. Polished companion for luxury heritage properties, desert camping, and formal dinners.' },
      { name: 'Radhika Maheshwari', age: 23, gender: 'female', bio: 'History researcher living near Malviya Nagar. Delightful company for museum walks, traditional Thali dining, and folk music.' },
      { name: 'Ranveer Shekhawat', age: 28, gender: 'male', bio: 'Heritage architect. Warm, articulate guide for Nahargarh sunsets, Amer fort walks, and specialty coffee tasting.' },
      { name: 'Diya Khandelwal', age: 24, gender: 'female', bio: 'Textile curator in Tonk Road. Cheerful conversationalist for flea markets, handloom boutiques, and high-tea afternoons.' },
      { name: 'Bhavna Sharma', age: 23, gender: 'female', bio: 'Journalism student with keen interest in literature festivals and indie cinema. Great listener and vibrant friend.' },
      { name: 'Digvijay Jhala', age: 26, gender: 'male', bio: 'Rider & cafe owner. Perfect companion for highway bike/car road trips, craft cafes, and music festivals.' },
      { name: 'Suhani Pareek', age: 24, gender: 'female', bio: 'Pastry chef loving artisan cafes, weekend brunches, and photography walks along Hawa Mahal circuit.' },
      { name: 'Meenakshi Tanwar', age: 25, gender: 'female', bio: 'Classical singer & cultural host. Dignified, polite presence for royal dining, weddings, and formal evenings.' },
      { name: 'Kushagra Agarwal', age: 27, gender: 'male', bio: 'Startup investor. Intelligent, respectful partner for business conferences, club dining, and networking events.' }
    ]
  },
  {
    city: 'Indore',
    pins: ['452001', '452010', '452003', '452008', '452016'],
    names: [
      { name: 'Tanvi Patidar', age: 23, gender: 'female', bio: 'Food researcher & Vijay Nagar regular. The ultimate foodie companion for Chappan Dukan delicacies and Sarafa night bazaar walks.' },
      { name: 'Akshat Jain', age: 26, gender: 'male', bio: 'Tech consultant and sports enthusiast. Friendly, polite companion for sports clubs, coffee chats, and weekend cinema.' },
      { name: 'Ishani Mandloi', age: 24, gender: 'female', bio: 'Fashion merchandiser loving boutique cafes in Palasia, styling sessions, and weekend highway getaways.' },
      { name: 'Pranay Agrawal', age: 27, gender: 'male', bio: 'Industrialist and guitarist. Polished, respectful companion for formal banquets, live gigs, and lounge parties.' },
      { name: 'Muskan Tiwari', age: 23, gender: 'female', bio: 'Literature post-grad with a cheerful vibe. Wonderful companion for deep conversations, bookstores, and tea lounges.' },
      { name: 'Saloni Kasliwal', age: 25, gender: 'female', bio: 'Event curator in AB Road. Energetic and sophisticated company for luxury dining, private parties, and road trips.' },
      { name: 'Yashwardhan Holkar', age: 28, gender: 'male', bio: 'Heritage enthusiast & marathon runner. Calm, cultured conversationalist for historical monuments and upscale dinners.' },
      { name: 'Kavita Joshi', age: 24, gender: 'female', bio: 'Interior designer loving cafe aesthetics, art walks, and weekend shopping in C21 mall.' },
      { name: 'Aditi Solanki', age: 23, gender: 'female', bio: 'Psychology researcher with great empathy and polite demeanor for peaceful dinner talks and sunset strolls.' },
      { name: 'Rohit Raghuvanshi', age: 26, gender: 'male', bio: 'Fitness coach and movie buff. Great buddy for active sports, gym accompany, and relaxed weekend meetups.' }
    ]
  },
  {
    city: 'Mumbai',
    pins: ['400050', '400001', '400053', '400049', '400058'],
    names: [
      { name: 'Ananya Shroff', age: 25, gender: 'female', bio: 'Fashion stylist & model in Bandra West. Verified companion for chic rooftop lounges in Soho House, beachside coffee, and movie premieres.' },
      { name: 'Kabir Oberoi', age: 28, gender: 'male', bio: 'Investment banker & sailing club member in Colaba. Polished, respectful partner for high-profile business dinners and yacht outings.' },
      { name: 'Shanaya Kapoor', age: 23, gender: 'female', bio: 'Film production assistant in Juhu. Vibrant conversationalist for Prithvi Cafe evenings, art cinema, and weekend nightlife.' },
      { name: 'Aryan Merchant', age: 27, gender: 'male', bio: 'Architect in Marine Drive. Cultured and charming companion for heritage art deco walks, jazz clubs, and sunset dining.' },
      { name: 'Tara Dsouza', age: 24, gender: 'female', bio: 'Musician & voiceover artist in Khar. Warm, creative companion for live concerts, artisan cafes, and vinyl listening bars.' },
      { name: 'Zoya Bilimoria', age: 26, gender: 'female', bio: 'Brand director in Lower Parel. Sophisticated dinner companion for gourmet restaurants in Palladium and networking events.' },
      { name: 'Farhan Contractor', age: 28, gender: 'male', bio: 'Restaurateur and food critic. Incredible company for culinary explorations, private tasting sessions, and weekend clubbing.' },
      { name: 'Alisha Fernandes', age: 24, gender: 'female', bio: 'Theatre actress & literature buff in Versova. Energetic, expressive friend for play screenings, beach walks, and coffee.' },
      { name: 'Natasha Singhal', age: 25, gender: 'female', bio: 'Advertising producer in Andheri West. Fun, sharp, and verified companion for party events, comedy clubs, and dining.' },
      { name: 'Devendra Mehta', age: 27, gender: 'male', bio: 'Commercial pilot & fitness enthusiast. Polite, calm company for weekend getaways to Alibaug and fine dining.' }
    ]
  }
];

// Curated pool of 35 real model portraits with diverse, high-aesthetic studio lighting
const MODEL_PHOTOS_FEMALE = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&auto=format&fit=crop&q=80'
];

const MODEL_PHOTOS_MALE = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=600&auto=format&fit=crop&q=80'
];

const ALL_SERVICES = [
  ['hangout', 'coffee-partner', 'movie-partner'],
  ['movie-partner', 'lunch-dinner', 'clubbing'],
  ['travel-partner', 'coffee-partner', 'hangout'],
  ['hangout', 'lunch-dinner', 'travel-partner'],
  ['coffee-partner', 'clubbing', 'movie-partner']
];

const ALL_BADGES = [
  ['Official Companion', '100% Aadhaar KYC', 'Top Rated Partner'],
  ['Face Verified', 'VIP Member', 'Top Companion'],
  ['Aadhaar KYC', 'Elite Host', 'Conversationalist'],
  ['Top Rated', 'Verified Companion', 'Luxury Dining'],
  ['Cultural Guide', 'Official Partner', 'Photo Walks']
];

let femaleIdx = 0;
let maleIdx = 0;

const companionRecords = [];

DISTRICTS.forEach((dist, dIdx) => {
  dist.names.forEach((person, pIdx) => {
    const id = `comp-${dist.city.toLowerCase().replace(/\s+/g, '')}-${pIdx + 1}`;
    const pin = dist.pins[pIdx % dist.pins.length];
    const isFemale = person.gender === 'female';
    const photo = isFemale 
      ? MODEL_PHOTOS_FEMALE[femaleIdx++ % MODEL_PHOTOS_FEMALE.length]
      : MODEL_PHOTOS_MALE[maleIdx++ % MODEL_PHOTOS_MALE.length];

    const rating = Number((4.85 + (pIdx * 0.015) % 0.15).toFixed(2));
    const reviewCount = 45 + (pIdx * 19) + (dIdx * 12);
    const hourlyRate = 1499 + ((pIdx % 3) * 500);
    const badges = ALL_BADGES[(dIdx + pIdx) % ALL_BADGES.length];
    const services = ALL_SERVICES[(dIdx + pIdx) % ALL_SERVICES.length];
    const languages = ['Hindi', 'English'];
    if (dist.city === 'Chandigarh') languages.push('Punjabi');
    if (dist.city === 'Mumbai') languages.push('Marathi');
    if (dist.city === 'Bangalore') languages.push('Kannada');
    if (dist.city === 'Jaipur') languages.push('Marwari');

    companionRecords.push({
      id,
      name: person.name,
      age: person.age,
      city: dist.city,
      pin_code: pin,
      rating,
      review_count: reviewCount,
      hourly_rate: hourlyRate,
      avatar_url: photo,
      bio: person.bio,
      badges,
      services,
      verified_kyc: true,
      online: pIdx % 3 !== 2,
      distance_km: Number((1.2 + (pIdx * 0.4)).toFixed(1)),
      languages
    });
  });
});

console.log(`Generated ${companionRecords.length} companion profiles across 10 districts.`);

async function seed() {
  console.log('Inserting into Supabase public.companions...');
  // Insert in batches of 20
  for (let i = 0; i < companionRecords.length; i += 20) {
    const batch = companionRecords.slice(i, i + 20);
    const { data, error } = await sb.from('companions').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`Batch ${i / 20 + 1} error:`, error);
    } else {
      console.log(`Batch ${i / 20 + 1} (${batch.length} items) successfully seeded.`);
    }
  }

  const { count, error } = await sb.from('companions').select('*', { count: 'exact', head: true });
  console.log('Total companions in Supabase:', count, 'error:', error);
}

seed();
