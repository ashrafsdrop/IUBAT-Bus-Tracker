export type Stop = {
  name: string;
  time: string;
};

export type RouteData = {
  id: string;
  name: string;
  busNo: string;
  stops: Stop[];
};

export const ROUTES: RouteData[] = [
  {
    "id": "azimpur",
    "name": "Azimpur, New Market, City College",
    "busNo": "26",
    "stops": [
      { "name": "Gonoshasthya", "time": "6:40 AM" },
      { "name": "Science Lab", "time": "6:42 AM" },
      { "name": "New Market", "time": "6:45 AM" },
      { "name": "City College", "time": "6:50 AM" },
      { "name": "Zigatala", "time": "6:55 AM" },
      { "name": "Dhanmondi 15", "time": "6:57 AM" },
      { "name": "Shankar Bus Stand", "time": "6:58 AM" },
      { "name": "Farmgate", "time": "7:05 AM" },
      { "name": "Kakoli/Banani", "time": "7:15 AM" },
      { "name": "MES", "time": "7:20 AM" },
      { "name": "Khilkhet", "time": "7:25 AM" },
      { "name": "Airport", "time": "7:30 AM" },
      { "name": "Campus", "time": "8:10 AM" }
    ]
  },
  {
    "id": "chandura",
    "name": "Chandura",
    "busNo": "20",
    "stops": [
      { "name": "Chandura", "time": "6:30 AM" },
      { "name": "Baripara", "time": "6:32 AM" },
      { "name": "Kabirpur", "time": "6:35 AM" },
      { "name": "Zerane Bazar", "time": "6:38 AM" },
      { "name": "EPZ", "time": "6:45 AM" },
      { "name": "Baypal", "time": "6:50 AM" },
      { "name": "Unique", "time": "7:00 AM" },
      { "name": "Zamgora Bazar", "time": "7:05 AM" },
      { "name": "Sarker Market", "time": "7:08 AM" },
      { "name": "Norsinghpur", "time": "7:10 AM" },
      { "name": "Zirabo", "time": "7:15 AM" },
      { "name": "Ashulia", "time": "7:20 AM" },
      { "name": "Dhour", "time": "7:28 AM" },
      { "name": "Campus", "time": "8:10 AM" }
    ]
  },
  {
    "id": "kaliganj",
    "name": "Kaliganj",
    "busNo": "1",
    "stops": [
      { "name": "Kaliganj", "time": "6:45 AM" },
      { "name": "Mohila College", "time": "6:46 AM" },
      { "name": "Pubail College", "time": "7:00 AM" },
      { "name": "Mirer Bazar Chowrastha", "time": "7:15 AM" },
      { "name": "Maju Khan Bazar", "time": "7:20 AM" },
      { "name": "T & T Gate", "time": "7:30 AM" },
      { "name": "K 2 Factory", "time": "7:33 AM" },
      { "name": "West Side of Flyover", "time": "7:36 AM" },
      { "name": "Station Road", "time": "7:40 AM" },
      { "name": "Campus", "time": "8:05 AM" }
    ]
  },
  {
    "id": "kallyanpur",
    "name": "Kallyanpur",
    "busNo": "24",
    "stops": [
      { "name": "Kallyanpur", "time": "6:20 AM" },
      { "name": "Technical", "time": "6:22 AM" },
      { "name": "Ansar Camp", "time": "6:25 AM" },
      { "name": "Mirpur - 01", "time": "6:27 AM" },
      { "name": "Soni Hall", "time": "6:30 AM" },
      { "name": "Mirpur - 02", "time": "6:33 AM" },
      { "name": "Mirpur - 10", "time": "6:40 AM" },
      { "name": "Kazipara", "time": "6:45 AM" },
      { "name": "Shewrapara", "time": "6:50 AM" },
      { "name": "Taltala", "time": "6:53 AM" },
      { "name": "Agargaon", "time": "6:55 AM" },
      { "name": "Shaheen College", "time": "7:00 AM" },
      { "name": "Mohakhali Rail Gate", "time": "7:02 AM" },
      { "name": "Amtali", "time": "7:05 AM" },
      { "name": "Soinik Club", "time": "7:07 AM" },
      { "name": "Kakali", "time": "7:10 AM" },
      { "name": "Shewra", "time": "7:20 AM" },
      { "name": "Khilkhet", "time": "7:25 AM" },
      { "name": "Campus", "time": "8:10 AM" }
    ]
  },
  {
    "id": "kalshi",
    "name": "Kalshi, Mirpur",
    "busNo": "21",
    "stops": [
      { "name": "Sare Agaro", "time": "7:00 AM" },
      { "name": "Dha Block Mour", "time": "7:05 AM" },
      { "name": "Sangbadik Plot", "time": "7:08 AM" },
      { "name": "Byesh Tala", "time": "7:10 AM" },
      { "name": "Kalshi Mour", "time": "7:12 AM" },
      { "name": "Kalshi Bridge", "time": "7:15 AM" },
      { "name": "ECB Chattar", "time": "7:20 AM" },
      { "name": "Mati Kata Baribadh", "time": "7:22 AM" },
      { "name": "Shewra", "time": "7:25 AM" },
      { "name": "Khilkhet", "time": "7:27 AM" },
      { "name": "Kawla", "time": "7:29 AM" },
      { "name": "Airport", "time": "7:32 AM" },
      { "name": "Jashimuddin", "time": "7:37 AM" },
      { "name": "Azampur", "time": "7:43 AM" },
      { "name": "Abdullahpur", "time": "7:50 AM" },
      { "name": "Campus", "time": "8:10 AM" }
    ]
  },
  {
    "id": "komlapur",
    "name": "Komlapur, Mughda Medical",
    "busNo": "25",
    "stops": [
      { "name": "Mughda Medical", "time": "6:40 AM" },
      { "name": "Buddha Mondir", "time": "6:42 AM" },
      { "name": "Basabo", "time": "6:45 AM" },
      { "name": "Khilgao Pollice Fari", "time": "6:48 AM" },
      { "name": "Malibagh Rail Gate", "time": "6:50 AM" },
      { "name": "Chowdhury Para", "time": "6:52 AM" },
      { "name": "Hazipara", "time": "6:54 AM" },
      { "name": "Rampura Bazar", "time": "6:58 AM" },
      { "name": "Rampura TV Gate", "time": "7:00 AM" },
      { "name": "Maddhya Badda", "time": "7:05 AM" },
      { "name": "Uttar Badda", "time": "7:10 AM" },
      { "name": "Shahjadpur", "time": "7:12 AM" },
      { "name": "Nuton Bazar", "time": "7:15 AM" },
      { "name": "Narda Bazar", "time": "7:17 AM" },
      { "name": "Bashundhara", "time": "7:20 AM" },
      { "name": "Kuril Bishwa Road", "time": "7:25 AM" },
      { "name": "Bishwa Road", "time": "7:27 AM" },
      { "name": "Khilkhet", "time": "7:30 AM" },
      { "name": "Airport", "time": "7:45 AM" },
      { "name": "Campus", "time": "8:05 AM" }
    ]
  },
  {
    "id": "konabari",
    "name": "Konabari, Mouchak",
    "busNo": "13",
    "stops": [
      { "name": "Mouchak", "time": "6:45 AM" },
      { "name": "Konabari", "time": "6:55 AM" },
      { "name": "Palli Biddhut", "time": "7:08 AM" },
      { "name": "Bhawal College", "time": "7:10 AM" },
      { "name": "Chowrastha", "time": "7:20 AM" },
      { "name": "Board Bazar", "time": "7:35 AM" },
      { "name": "Barabari", "time": "7:40 AM" },
      { "name": "Gazipura", "time": "7:45 AM" },
      { "name": "College Gate", "time": "7:50 AM" },
      { "name": "Station Road", "time": "7:55 AM" },
      { "name": "Campus", "time": "8:05 AM" }
    ]
  },
  {
    "id": "mothijheel",
    "name": "Mothijheel",
    "busNo": "9",
    "stops": [
      { "name": "Mothijheel Shapla Chattar", "time": "6:40 AM" },
      { "name": "Rajarbagh", "time": "6:45 AM" },
      { "name": "Malibagh Mour", "time": "6:47 AM" },
      { "name": "Mouchak", "time": "6:48 AM" },
      { "name": "Malibagh Rail Gate", "time": "6:50 AM" },
      { "name": "Chowdhury Para", "time": "6:52 AM" },
      { "name": "Hazipara", "time": "6:54 AM" },
      { "name": "Rampura Bazar", "time": "6:58 AM" },
      { "name": "Rampura TV Gate", "time": "7:00 AM" },
      { "name": "Maddhya Badda", "time": "7:05 AM" },
      { "name": "Uttar Badda", "time": "7:10 AM" },
      { "name": "Shahjadpur", "time": "7:12 AM" },
      { "name": "Nuton Bazar", "time": "7:15 AM" },
      { "name": "Narda Bazar", "time": "7:17 AM" },
      { "name": "Bashundhara", "time": "7:20 AM" },
      { "name": "Kuril Bishwa Road", "time": "7:25 AM" },
      { "name": "Bishwa Road", "time": "7:27 AM" },
      { "name": "Khilkhet", "time": "7:30 AM" },
      { "name": "Airport", "time": "7:45 AM" },
      { "name": "Campus", "time": "8:05 AM" }
    ]
  },
  {
    "id": "physical",
    "name": "Physical, Mohammadpur",
    "busNo": "18",
    "stops": [
      { "name": "Physical", "time": "6:45 AM" },
      { "name": "Noorjahan Road", "time": "6:50 AM" },
      { "name": "Shia Masjid", "time": "6:55 AM" },
      { "name": "Japan Garden City", "time": "6:56 AM" },
      { "name": "Shymoli", "time": "7:00 AM" },
      { "name": "Shaheen School", "time": "7:10 AM" },
      { "name": "Mohakhali Flyover", "time": "7:13 AM" },
      { "name": "Kakoli, Banani", "time": "7:15 AM" },
      { "name": "MES", "time": "7:25 AM" },
      { "name": "House Building", "time": "7:45 AM" },
      { "name": "Abdullahpur", "time": "7:57 AM" },
      { "name": "Campus", "time": "8:10 AM" }
    ]
  },
  {
    "id": "rajendrapur",
    "name": "Rajendrapur",
    "busNo": "16",
    "stops": [
      { "name": "Rajendrapur Cantonment", "time": "6:30 AM" },
      { "name": "Rajendrapur Chowrastha", "time": "6:35 AM" },
      { "name": "Masterbari", "time": "6:45 AM" },
      { "name": "Purabari", "time": "6:48 AM" },
      { "name": "University Gate", "time": "6:55 AM" },
      { "name": "Salna Bridge", "time": "6:58 AM" },
      { "name": "Nagpara", "time": "7:05 AM" },
      { "name": "Telipara", "time": "7:06 AM" },
      { "name": "Truck Stand", "time": "7:08 AM" },
      { "name": "Campus", "time": "8:00 AM" }
    ]
  },
  {
    "id": "rampura",
    "name": "Rampura Bridge & Notun Bazar",
    "busNo": "2",
    "stops": [
      { "name": "Rampura Bridge", "time": "7:00 AM" },
      { "name": "Maddhya Badda", "time": "7:05 AM" },
      { "name": "Uttar Badda", "time": "7:10 AM" },
      { "name": "Shahjadpur", "time": "7:12 AM" },
      { "name": "Nuton Bazar", "time": "7:15 AM" },
      { "name": "Narda Bazar", "time": "7:17 AM" },
      { "name": "Bashundhara", "time": "7:20 AM" },
      { "name": "Kuril Bishwa Road", "time": "7:25 AM" },
      { "name": "Bishwa Road", "time": "7:27 AM" },
      { "name": "Khilkhet", "time": "7:30 AM" },
      { "name": "Airport", "time": "7:45 AM" },
      { "name": "Campus", "time": "8:05 AM" }
    ]
  },
  {
    "id": "razbari",
    "name": "Razbari, Gazipur",
    "busNo": "17",
    "stops": [
      { "name": "Razbari", "time": "6:50 AM" },
      { "name": "Kendrio Jame Mosque", "time": "7:02 AM" },
      { "name": "Krishi Gabeshana", "time": "7:08 AM" },
      { "name": "Rice Research", "time": "7:11 AM" },
      { "name": "T & T", "time": "7:15 AM" },
      { "name": "Chowrastha", "time": "7:19 AM" },
      { "name": "Board Bazar", "time": "7:30 AM" },
      { "name": "Barabari", "time": "7:36 AM" },
      { "name": "Gazipura", "time": "7:42 AM" },
      { "name": "College Gate", "time": "7:43 AM" },
      { "name": "Station Road", "time": "7:51 AM" },
      { "name": "Campus", "time": "8:00 AM" }
    ]
  },
  {
    "id": "savar",
    "name": "Savar",
    "busNo": "14",
    "stops": [
      { "name": "Savar", "time": "6:20 AM" },
      { "name": "CRP Gate", "time": "6:22 AM" },
      { "name": "Radio Colony", "time": "6:25 AM" },
      { "name": "J Nagar Dairy Gate", "time": "6:28 AM" },
      { "name": "Bismail", "time": "6:30 AM" },
      { "name": "RAB Gate", "time": "6:32 AM" },
      { "name": "Nabinagar", "time": "6:35 AM" },
      { "name": "Cantonment Board", "time": "6:37 AM" },
      { "name": "Palli Biddut", "time": "6:40 AM" },
      { "name": "Palash Bari", "time": "6:43 AM" },
      { "name": "Baipail Bridge", "time": "6:45 AM" },
      { "name": "Unique", "time": "6:50 AM" },
      { "name": "Jamghara Bazar", "time": "6:55 AM" },
      { "name": "Sarkar Market", "time": "7:00 AM" },
      { "name": "Nasinghapur", "time": "7:10 AM" },
      { "name": "Nischintapur", "time": "7:12 AM" },
      { "name": "Goshbagh", "time": "7:15 AM" },
      { "name": "Zirabo", "time": "7:20 AM" },
      { "name": "Ashulia", "time": "7:25 AM" },
      { "name": "Dhour", "time": "7:28 AM" },
      { "name": "Campus", "time": "7:50 AM" }
    ]
  },
  {
    "id": "shimultali",
    "name": "Shimultali, Gazipur",
    "busNo": "11",
    "stops": [
      { "name": "Shimultali", "time": "6:45 AM" },
      { "name": "Salna Road", "time": "6:49 AM" },
      { "name": "Salim Vila", "time": "6:50 AM" },
      { "name": "BADC", "time": "6:55 AM" },
      { "name": "Duet Gate", "time": "6:59 AM" },
      { "name": "Joydebpur Bus Stand", "time": "7:03 AM" },
      { "name": "Shibbari", "time": "7:05 AM" },
      { "name": "Krishi Gabeshana", "time": "7:08 AM" },
      { "name": "Rice Research", "time": "7:12 AM" },
      { "name": "T & T", "time": "7:14 AM" },
      { "name": "Chowrastha", "time": "7:18 AM" },
      { "name": "Board Bazar", "time": "7:28 AM" },
      { "name": "Barabari", "time": "7:34 AM" },
      { "name": "Gazipura", "time": "7:40 AM" },
      { "name": "College Gate", "time": "7:45 AM" },
      { "name": "Station Road", "time": "7:52 AM" },
      { "name": "Campus", "time": "8:05 AM" }
    ]
  },
  {
    "id": "signboard",
    "name": "Signboard",
    "busNo": "23",
    "stops": [
      { "name": "Signboard", "time": "6:30 AM" },
      { "name": "Matuaile Medical", "time": "6:32 AM" },
      { "name": "Shonir Akra", "time": "6:36 AM" },
      { "name": "Mayor Hanif Flyover", "time": "6:40 AM" },
      { "name": "Jatrabari", "time": "6:42 AM" },
      { "name": "Gulistan", "time": "6:45 AM" },
      { "name": "National Stadium", "time": "6:48 AM" },
      { "name": "Shahbagh", "time": "6:52 AM" },
      { "name": "Banglamotor", "time": "6:55 AM" },
      { "name": "Sonargown Hotel", "time": "6:56 AM" },
      { "name": "Farmgate Pollice Box", "time": "7:00 AM" },
      { "name": "Shahin Hall", "time": "7:05 AM" },
      { "name": "Banani", "time": "7:12 AM" },
      { "name": "MES", "time": "7:15 AM" },
      { "name": "Kowla", "time": "7:25 AM" },
      { "name": "Airport", "time": "7:28 AM" },
      { "name": "Campus", "time": "8:10 AM" }
    ]
  },
  {
    "id": "soni_hall",
    "name": "Soni Hall, Mirpur, Kalshi",
    "busNo": "22",
    "stops": [
      { "name": "Soni Hall", "time": "6:50 AM" },
      { "name": "Mirpur - 02", "time": "6:55 AM" },
      { "name": "Original - 10", "time": "7:00 AM" },
      { "name": "Mirpur - 11", "time": "7:05 AM" },
      { "name": "Purobi Hall", "time": "7:07 AM" },
      { "name": "Palashi", "time": "7:10 AM" },
      { "name": "Kabarsthan", "time": "7:12 AM" },
      { "name": "Kalshi", "time": "7:15 AM" },
      { "name": "ECB Chattar", "time": "7:20 AM" },
      { "name": "MES", "time": "7:25 AM" },
      { "name": "Khilkhet", "time": "7:30 AM" },
      { "name": "Airport", "time": "7:35 AM" },
      { "name": "Campus", "time": "8:10 AM" }
    ]
  }
];
