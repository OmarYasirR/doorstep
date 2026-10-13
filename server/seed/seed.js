// Run with: npm run seed   (wipes users, properties and inquiries, then inserts demo data)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

// Deterministic PRNG so every seed run produces the same data
let s = 42;
const rand = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (a, b) => a + Math.floor(rand() * (b - a + 1));
const jitter = (n, spread) => n + (rand() - 0.5) * spread;
const daysAgo = (d) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);
const daysAhead = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

const PHOTOS = [
  'photo-1570129477492-45c003edd2be', 'photo-1568605114967-8130f3a36994', 'photo-1600596542815-ffad4c1539a9',
  'photo-1600585154340-be6161a56a0c', 'photo-1600607687939-ce8a6c25118c', 'photo-1600566753190-17f0baa2a6c3',
  'photo-1613490493576-7fde63acd811', 'photo-1605276374104-dee2a0ed3ce6', 'photo-1564013799919-ab600027ffc6',
  'photo-1512917774080-9991f1c4c750', 'photo-1502672260266-1c1ef2d93688', 'photo-1560448204-e02f11c3d0e2',
  'photo-1522708323590-d24dbb6b0267', 'photo-1545324418-cc1a3fa10c00',
];
const gallery = (n = 4) => {
  const start = between(0, PHOTOS.length - 1);
  return Array.from({ length: n }, (_, i) => ({
    url: `https://images.unsplash.com/${PHOTOS[(start + i) % PHOTOS.length]}?w=1400&q=80`,
    isPrimary: i === 0,
  }));
};

const CITIES = [
  { city: 'Austin', state: 'TX', zip: '787', lat: 30.2672, lng: -97.7431, streets: ['Barton Springs Rd', 'Lamar Blvd', 'Congress Ave', 'Oak Hill Dr', 'Zilker Park Ln'] },
  { city: 'Dallas', state: 'TX', zip: '752', lat: 32.7767, lng: -96.797, streets: ['Elm St', 'McKinney Ave', 'Greenville Ave', 'Turtle Creek Blvd', 'Lakewood Dr'] },
  { city: 'Houston', state: 'TX', zip: '770', lat: 29.7604, lng: -95.3698, streets: ['Montrose Blvd', 'Heights Blvd', 'Kirby Dr', 'Westheimer Rd', 'Bayou Bend Ln'] },
  { city: 'Denver', state: 'CO', zip: '802', lat: 39.7392, lng: -104.9903, streets: ['Colfax Ave', 'Larimer St', 'Wash Park Ln', 'Cherry Creek Dr', 'Highlands Way'] },
  { city: 'Seattle', state: 'WA', zip: '981', lat: 47.6062, lng: -122.3321, streets: ['Pike St', 'Capitol Hill Ave', 'Ballard Way', 'Lake Union Dr', 'Queen Anne Ave'] },
];

const STYLES = ['Modern', 'Craftsman', 'Mid-Century', 'Colonial', 'Contemporary', 'Farmhouse', 'Mediterranean', 'Cozy'];
const AMENITIES = ['pool', 'garage', 'gym', 'garden', 'fireplace', 'balcony', 'smart-home', 'hardwood-floors', 'patio', 'rooftop-deck', 'in-unit-laundry', 'ev-charger', 'parking'];
const TOURS = ['https://my.matterport.com/show/?m=SxQL3iGyoDo', 'https://my.matterport.com/show/?m=Z7Qpoxcn6WJ', ''];

const DESCRIPTIONS = [
  'Bright, open living spaces with large windows and a recently updated kitchen. Close to parks, cafes and transit.',
  'Thoughtfully renovated with quality finishes throughout. A quiet street, a generous yard, and room to grow.',
  'Move-in ready home with an airy floor plan, plenty of storage, and a private outdoor space for entertaining.',
  'A rare find in a sought-after neighborhood: walkable to shops and restaurants, with modern comforts inside.',
  'Warm, character-filled interiors with original details, paired with new systems for peace of mind.',
];

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Property.deleteMany({}), Inquiry.deleteMany({})]);

  // ---- Users ----
  const admin = await User.create({ username: 'admin', email: 'admin@doorstep.dev', password: 'password123', role: 'admin' });

  const agentData = [
    { username: 'sarah.johnson', email: 'sarah@doorstep.dev', agencyName: 'Johnson Realty Group', phone: '+1 512 555 0101', bio: 'Helping families find the right home in Austin for over 10 years.', rating: 4.8, reviewCount: 132 },
    { username: 'marcus.lee', email: 'marcus@doorstep.dev', agencyName: 'Lone Star Homes', phone: '+1 214 555 0142', bio: 'Dallas and Houston specialist focused on first-time buyers and investors.', rating: 4.6, reviewCount: 87 },
    { username: 'elena.garcia', email: 'elena@doorstep.dev', agencyName: 'Summit Properties', phone: '+1 303 555 0177', bio: 'Denver native with deep knowledge of the Front Range rental and sales market.', rating: 4.9, reviewCount: 64 },
    { username: 'david.kim', email: 'david@doorstep.dev', agencyName: 'Emerald City Realty', phone: '+1 206 555 0163', bio: 'Seattle condos, lofts and waterfront homes. Fluent in Korean and English.', rating: 4.5, reviewCount: 41 },
  ];
  const agents = [];
  for (const a of agentData) agents.push(await User.create({ ...a, password: 'password123', role: 'agent', licenseNumber: `LIC-${between(100000, 999999)}` }));

  const buyers = [];
  for (const [username, email] of [['demo.buyer', 'buyer@doorstep.dev'], ['jamie.rivera', 'jamie@doorstep.dev'], ['priya.shah', 'priya@doorstep.dev']]) {
    buyers.push(await User.create({ username, email, password: 'password123', role: 'user', phone: `+1 555 01${between(10, 99)}` }));
  }

  // ---- Properties (~30) ----
  const agentForCity = { Austin: agents[0], Dallas: agents[1], Houston: agents[1], Denver: agents[2], Seattle: agents[3] };
  const docs = [];

  CITIES.forEach((c) => {
    for (let i = 0; i < 6; i++) {
      const rent = i % 3 === 2; // roughly a third are rentals
      const propertyType = rent ? pick(['apartment', 'condo']) : pick(['house', 'house', 'condo', 'villa']);
      const beds = rent ? between(1, 3) : between(2, 5);
      const baths = Math.max(1, Math.min(beds, between(1, 4)));
      const sqft = beds * between(380, 620) + between(250, 600);
      const price = rent ? Math.round((sqft * jitter(2.4, 0.8)) / 50) * 50 : Math.round((sqft * jitter(310, 120)) / 1000) * 1000;
      const style = pick(STYLES);
      const statusRoll = rand();
      const status = statusRoll < 0.72 ? 'available' : statusRoll < 0.86 ? 'pending' : rent ? 'rented' : 'sold';
      const agent = agentForCity[c.city];

      docs.push({
        title: rent ? `${style} ${beds === 1 ? 'Studio-Style' : `${beds}-Bed`} ${propertyType === 'condo' ? 'Condo' : 'Apartment'}` : `${style} ${propertyType === 'villa' ? 'Villa' : propertyType === 'condo' ? 'Condo' : 'Family Home'}`,
        description: pick(DESCRIPTIONS),
        price,
        listingType: rent ? 'rent' : 'sale',
        propertyType,
        status,
        location: {
          address: `${between(10, 2900)} ${pick(c.streets)}`,
          city: c.city,
          state: c.state,
          zip: `${c.zip}${between(10, 99)}`,
          coordinates: { type: 'Point', coordinates: [jitter(c.lng, 0.12), jitter(c.lat, 0.1)] },
        },
        specs: { beds, baths, sqft, yearBuilt: between(1945, 2023), lotSize: propertyType === 'house' ? between(3000, 12000) : undefined },
        amenities: Array.from(new Set(Array.from({ length: between(2, 5) }, () => pick(AMENITIES)))),
        images: gallery(between(3, 5)),
        virtualTourUrl: pick(TOURS),
        agent: agent._id,
        createdBy: agent._id,
        views: between(20, 1800),
        featured: i === 0 || (i === 3 && c.city === 'Austin'),
        // spread over the last 6 months so the admin trend chart has data
        createdAt: daysAgo(between(1, 170)),
      });
    }
  });

  const properties = await Property.insertMany(docs);
  const open = properties.filter((p) => ['available', 'pending'].includes(p.status));

  // ---- Favorites for demo buyer ----
  buyers[0].favorites = open.slice(0, 5).map((p) => p._id);
  buyers[1].favorites = open.slice(5, 8).map((p) => p._id);
  await Promise.all(buyers.map((b) => b.save()));

  // ---- Inquiries / viewing requests ----
  const statuses = ['pending', 'pending', 'pending', 'confirmed', 'confirmed', 'declined', 'completed', 'cancelled'];
  const slots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const inquiryDocs = [];
  const usedSlots = new Set();

  for (let i = 0; i < 24; i++) {
    const property = pick(open);
    const buyer = buyers[i % buyers.length];
    const viewing = i % 3 !== 0;
    const status = pick(statuses);
    const date = status === 'completed' ? daysAgo(between(2, 20)) : daysAhead(between(1, 21));
    const slot = pick(slots);
    const key = `${property._id}-${date.toDateString()}-${slot}`;
    if (viewing && usedSlots.has(key)) continue; // respect the one-request-per-slot rule
    usedSlots.add(key);

    inquiryDocs.push({
      property: property._id,
      agent: property.agent,
      user: buyer._id,
      type: viewing ? 'viewing_request' : 'message',
      message: viewing
        ? pick(['Would love to see it in person. Is parking available nearby?', 'Interested in a quick walkthrough before making an offer.', ''])
        : pick(['Is the price negotiable?', 'Are pets allowed?', 'Could you share the HOA fees and recent utility costs?', 'Is the virtual tour up to date?']),
      requestedDate: viewing ? date : undefined,
      requestedTimeSlot: viewing ? slot : undefined,
      status: viewing ? status : pick(['pending', 'completed']),
      contactInfo: { name: buyer.username.replace('.', ' '), email: buyer.email, phone: buyer.phone },
      createdAt: daysAgo(between(0, 25)),
    });
  }
  await Inquiry.insertMany(inquiryDocs);

  console.log(`Seed complete: ${1 + agents.length + buyers.length} users, ${properties.length} properties, ${inquiryDocs.length} inquiries.`);
  console.log('All demo accounts use password: password123');
  console.log(`  Admin: ${admin.email}`);
  agents.forEach((a) => console.log(`  Agent: ${a.email}`));
  buyers.forEach((b) => console.log(`  User:  ${b.email}`));
  await mongoose.connection.close();
};

run().catch((err) => { console.error(err); process.exit(1); });
