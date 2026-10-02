const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// ─── Static Demo Salons ──────────────────────────────────────────────────────

let MEN_SALONS = [
  {
    _id: 'men-1',
    name: "Apex Gentlemen's Barbershop",
    tagline: 'Modern fades, beard sculpting & hot towel shaves',
    gender: 'men',
    rating: 4.9,
    reviewsCount: 184,
    priceRange: '$$',
    capacity: 4,
    availableSeats: 3,
    photos: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    ],
    location: {
      address: '428 Valencia St',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94103',
      country: 'USA',
    },
    phone: '+1 (415) 555-0192',
    email: 'apex@snip.com',
    openingHours: {
      monday:    { open: '09:00', close: '20:00', closed: false },
      tuesday:   { open: '09:00', close: '20:00', closed: false },
      wednesday: { open: '09:00', close: '20:00', closed: false },
      thursday:  { open: '09:00', close: '20:00', closed: false },
      friday:    { open: '09:00', close: '21:00', closed: false },
      saturday:  { open: '08:00', close: '21:00', closed: false },
      sunday:    { open: '10:00', close: '18:00', closed: false },
    },
    services: [
      { name: 'Signature Skin Fade', price: 45, duration: '35 mins' },
      { name: 'Beard Trim & Sculpt', price: 25, duration: '20 mins' },
      { name: 'Classic Scissor Cut', price: 40, duration: '30 mins' },
      { name: 'Hot Towel Razor Shave', price: 35, duration: '25 mins' },
    ],
    amenities: ['Walk-ins Welcome', 'Beverage Bar', 'Free Wi-Fi', 'Card Accepted'],
  },
  {
    _id: 'men-2',
    name: 'The Fade & Razor Lounge',
    tagline: 'Precision taper fades, scissor work & hair tattoo detailing',
    gender: 'men',
    rating: 4.8,
    reviewsCount: 142,
    priceRange: '$$',
    capacity: 3,
    availableSeats: 1,
    photos: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    ],
    location: {
      address: '762 Mission St',
      city: 'Los Angeles',
      state: 'CA',
      pincode: '90012',
      country: 'USA',
    },
    phone: '+1 (415) 555-0138',
    email: 'fadelounge@snip.com',
    openingHours: {
      monday:    { open: '10:00', close: '21:00', closed: false },
      tuesday:   { open: '10:00', close: '21:00', closed: false },
      wednesday: { open: '10:00', close: '21:00', closed: false },
      thursday:  { open: '10:00', close: '21:00', closed: false },
      friday:    { open: '10:00', close: '22:00', closed: false },
      saturday:  { open: '09:00', close: '22:00', closed: false },
      sunday:    { open: '11:00', close: '19:00', closed: false },
    },
    services: [
      { name: 'Low/Mid/High Taper Fade', price: 50, duration: '40 mins' },
      { name: 'Buzz Cut & Lineup', price: 30, duration: '20 mins' },
      { name: 'Charcoal Face Mask & Steam', price: 35, duration: '25 mins' },
      { name: 'Father & Son Combo', price: 75, duration: '50 mins' },
    ],
    amenities: ['Appointment Only', 'Coffee Lounge', 'Card Accepted'],
  },
  {
    _id: 'men-3',
    name: 'Urban Blade & Beard Co.',
    tagline: 'Artisanal beard care, traditional barbering & scalp therapies',
    gender: 'men',
    rating: 4.9,
    reviewsCount: 215,
    priceRange: '$$$',
    capacity: 5,
    availableSeats: 5,
    photos: [
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    ],
    location: {
      address: '1104 Hayes St',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      country: 'USA',
    },
    phone: '+1 (415) 555-0181',
    email: 'urbanblade@snip.com',
    openingHours: {
      monday:    { open: '08:30', close: '19:30', closed: false },
      tuesday:   { open: '08:30', close: '19:30', closed: false },
      wednesday: { open: '08:30', close: '19:30', closed: false },
      thursday:  { open: '08:30', close: '19:30', closed: false },
      friday:    { open: '08:30', close: '20:00', closed: false },
      saturday:  { open: '08:00', close: '20:00', closed: false },
      sunday:    { open: '00:00', close: '00:00', closed: true },
    },
    services: [
      { name: 'Executive Grooming Package', price: 85, duration: '60 mins' },
      { name: 'Beard Shapeup & Organic Oil', price: 30, duration: '25 mins' },
      { name: 'Men Anti-Dandruff Scalp Spa', price: 55, duration: '40 mins' },
      { name: 'Grey Blending & Hair Color', price: 45, duration: '30 mins' },
    ],
    amenities: ['VIP Lounge', 'Free Drinks', 'Valet Parking'],
  },
  {
    _id: 'men-4',
    name: 'Heritage Cuts Barber Shop',
    tagline: 'Timeless vintage haircuts with master licensed barbers',
    gender: 'men',
    rating: 4.7,
    reviewsCount: 98,
    priceRange: '$',
    capacity: 3,
    availableSeats: 2,
    photos: [
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    ],
    location: {
      address: '320 Castro St',
      city: 'Chicago',
      state: 'IL',
      pincode: '60601',
      country: 'USA',
    },
    phone: '+1 (415) 555-0127',
    email: 'heritage@snip.com',
    openingHours: {
      monday:    { open: '09:00', close: '19:00', closed: false },
      tuesday:   { open: '09:00', close: '19:00', closed: false },
      wednesday: { open: '09:00', close: '19:00', closed: false },
      thursday:  { open: '09:00', close: '19:00', closed: false },
      friday:    { open: '09:00', close: '20:00', closed: false },
      saturday:  { open: '09:00', close: '20:00', closed: false },
      sunday:    { open: '00:00', close: '00:00', closed: true },
    },
    services: [
      { name: 'Traditional Crew Cut', price: 30, duration: '25 mins' },
      { name: 'Mustache & Beard Styling', price: 20, duration: '15 mins' },
      { name: 'Kids Haircut (Under 12)', price: 25, duration: '20 mins' },
      { name: 'Full Head Razor Shave', price: 40, duration: '30 mins' },
    ],
    amenities: ['Walk-ins Welcome', 'Cash & UPI/Card'],
  },
];

let WOMEN_SALONS = [
  {
    _id: 'women-1',
    name: 'Luxe Belle Studio & Spa',
    tagline: 'Premium balayage, keratin treatments & luxury blowouts',
    gender: 'women',
    rating: 4.9,
    reviewsCount: 230,
    priceRange: '$$$',
    capacity: 6,
    availableSeats: 4,
    photos: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    ],
    location: {
      address: '580 Sutter St, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94102',
      country: 'USA',
    },
    phone: '+1 (415) 555-0210',
    email: 'luxebelle@snip.com',
    openingHours: {
      monday:    { open: '09:30', close: '20:00', closed: false },
      tuesday:   { open: '09:30', close: '20:00', closed: false },
      wednesday: { open: '09:30', close: '20:00', closed: false },
      thursday:  { open: '09:30', close: '20:00', closed: false },
      friday:    { open: '09:30', close: '21:00', closed: false },
      saturday:  { open: '09:00', close: '21:00', closed: false },
      sunday:    { open: '11:00', close: '18:00', closed: false },
    },
    services: [
      { name: 'Custom Balayage & Gloss', price: 160, duration: '120 mins' },
      { name: 'Precision Haircut & Styling', price: 75, duration: '45 mins' },
      { name: 'Brazilian Keratin Smoothing', price: 190, duration: '150 mins' },
      { name: 'Hydrating Botanical Hair Spa', price: 65, duration: '40 mins' },
    ],
    amenities: ['Private Styling Pods', 'Herbal Tea Bar', 'WiFi', 'Complimentary Consult'],
  },
  {
    _id: 'women-2',
    name: 'Atelier Luminance Hair & Beauty',
    tagline: 'Artisanal color melt, french bobs & bridal glam',
    gender: 'women',
    rating: 4.8,
    reviewsCount: 178,
    priceRange: '$$',
    capacity: 5,
    availableSeats: 2,
    photos: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    location: {
      address: '925 Fillmore St',
      city: 'Los Angeles',
      state: 'CA',
      pincode: '90028',
      country: 'USA',
    },
    phone: '+1 (415) 555-0222',
    email: 'atelier@snip.com',
    openingHours: {
      monday:    { open: '10:00', close: '19:30', closed: false },
      tuesday:   { open: '10:00', close: '19:30', closed: false },
      wednesday: { open: '10:00', close: '19:30', closed: false },
      thursday:  { open: '10:00', close: '19:30', closed: false },
      friday:    { open: '10:00', close: '20:00', closed: false },
      saturday:  { open: '09:30', close: '20:30', closed: false },
      sunday:    { open: '00:00', close: '00:00', closed: true },
    },
    services: [
      { name: 'French Bob & Texture Cut', price: 70, duration: '45 mins' },
      { name: 'Full Foil Highlights & Toner', price: 140, duration: '100 mins' },
      { name: 'Party Makeup & Hair Updo', price: 110, duration: '75 mins' },
      { name: 'Olaplex Bond Repair Treatment', price: 50, duration: '30 mins' },
    ],
    amenities: ['Celebrity Stylists', 'Complimentary Champagne', 'Card Accepted'],
  },
  {
    _id: 'women-3',
    name: 'Glow & Grace Organic Parlour',
    tagline: 'Holistic skincare, natural hair spa & herbal beauty therapies',
    gender: 'women',
    rating: 4.9,
    reviewsCount: 164,
    priceRange: '$$',
    capacity: 4,
    availableSeats: 4,
    photos: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
    ],
    location: {
      address: '1410 Chestnut St',
      city: 'New York',
      state: 'NY',
      pincode: '10002',
      country: 'USA',
    },
    phone: '+1 (415) 555-0245',
    email: 'glowgrace@snip.com',
    openingHours: {
      monday:    { open: '09:00', close: '20:00', closed: false },
      tuesday:   { open: '09:00', close: '20:00', closed: false },
      wednesday: { open: '09:00', close: '20:00', closed: false },
      thursday:  { open: '09:00', close: '20:00', closed: false },
      friday:    { open: '09:00', close: '21:00', closed: false },
      saturday:  { open: '09:00', close: '21:00', closed: false },
      sunday:    { open: '10:00', close: '17:00', closed: false },
    },
    services: [
      { name: 'Organic Radiance Facial', price: 80, duration: '50 mins' },
      { name: 'Layered Haircut with Blowout', price: 60, duration: '40 mins' },
      { name: 'Gel Nails & Deluxe Pedicure', price: 55, duration: '45 mins' },
      { name: 'Ayurvedic Scalp Massage', price: 45, duration: '30 mins' },
    ],
    amenities: ['100% Organic Products', 'Relaxation Lounge', 'Free Consultation'],
  },
  {
    _id: 'women-4',
    name: 'Velvet Bloom Nail & Hair Lounge',
    tagline: 'Chic nail art, lash extensions & trendy hair styling',
    gender: 'women',
    rating: 4.7,
    reviewsCount: 119,
    priceRange: '$',
    capacity: 4,
    availableSeats: 3,
    photos: [
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    ],
    location: {
      address: '614 Irving St',
      city: 'Chicago',
      state: 'IL',
      pincode: '60602',
      country: 'USA',
    },
    phone: '+1 (415) 555-0278',
    email: 'velvetbloom@snip.com',
    openingHours: {
      monday:    { open: '10:00', close: '20:30', closed: false },
      tuesday:   { open: '10:00', close: '20:30', closed: false },
      wednesday: { open: '10:00', close: '20:30', closed: false },
      thursday:  { open: '10:00', close: '20:30', closed: false },
      friday:    { open: '10:00', close: '21:00', closed: false },
      saturday:  { open: '09:00', close: '21:00', closed: false },
      sunday:    { open: '11:00', close: '18:00', closed: false },
    },
    services: [
      { name: 'Russian Manicure & Nail Art', price: 50, duration: '45 mins' },
      { name: 'Classic Cut & Beach Waves', price: 55, duration: '35 mins' },
      { name: 'Classic Lash Full Set', price: 95, duration: '75 mins' },
      { name: 'Root Touchup & Blowdry', price: 65, duration: '50 mins' },
    ],
    amenities: ['Walk-ins Welcome', 'Student Discount', 'Modern Aesthetic'],
  },
];

// In-memory store for owner created/updated salons
let OWNER_SALONS = [];

// ─── Helper: location match ───────────────────────────────────────────────────
function matchesLocation(salon, locationQuery) {
  if (!locationQuery) return true;
  const q = locationQuery.toLowerCase().trim();
  const loc = salon.location || {};
  return (
    (loc.city || '').toLowerCase().includes(q) ||
    (loc.state || '').toLowerCase().includes(q) ||
    (loc.address || '').toLowerCase().includes(q) ||
    (loc.pincode || '').toLowerCase().includes(q) ||
    (loc.country || '').toLowerCase().includes(q) ||
    // legacy fields
    (salon.city || '').toLowerCase().includes(q)
  );
}

// ─── GET /api/salons/men ───────────────────────────────────────────────────────
router.get('/men', (req, res) => {
  const { search, location } = req.query;
  const ownerMen = OWNER_SALONS.filter((s) => s.gender === 'men');
  let results = [...MEN_SALONS, ...ownerMen];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.tagline || '').toLowerCase().includes(q) ||
        ((s.location && s.location.city) || s.city || '').toLowerCase().includes(q) ||
        (s.services || []).some((srv) => srv.name.toLowerCase().includes(q))
    );
  }

  if (location) {
    results = results.filter((s) => matchesLocation(s, location));
  }

  res.json({ success: true, count: results.length, data: results });
});

// ─── GET /api/salons/women ─────────────────────────────────────────────────────
router.get('/women', (req, res) => {
  const { search, location } = req.query;
  const ownerWomen = OWNER_SALONS.filter((s) => s.gender === 'women');
  let results = [...WOMEN_SALONS, ...ownerWomen];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.tagline || '').toLowerCase().includes(q) ||
        ((s.location && s.location.city) || s.city || '').toLowerCase().includes(q) ||
        (s.services || []).some((srv) => srv.name.toLowerCase().includes(q))
    );
  }

  if (location) {
    results = results.filter((s) => matchesLocation(s, location));
  }

  res.json({ success: true, count: results.length, data: results });
});

// ─── GET /api/salons/all ───────────────────────────────────────────────────────
router.get('/all', (req, res) => {
  const { location, search } = req.query;
  let results = [...MEN_SALONS, ...WOMEN_SALONS, ...OWNER_SALONS];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.tagline || '').toLowerCase().includes(q) ||
        ((s.location && s.location.city) || s.city || '').toLowerCase().includes(q) ||
        (s.services || []).some((srv) => srv.name.toLowerCase().includes(q))
    );
  }

  if (location) {
    results = results.filter((s) => matchesLocation(s, location));
  }

  res.json({ success: true, count: results.length, data: results });
});

// ─── GET /api/salons/owner/my-salon ──────────────────────────────────────────
router.get('/owner/my-salon', protect, (req, res) => {
  const userId = req.user._id.toString();
  const found = OWNER_SALONS.find((s) => s.ownerId === userId);
  res.json({ success: true, data: found || null });
});

// ─── POST /api/salons ─────────────────────────────────────────────────────────
router.post('/', protect, (req, res) => {
  try {
    const userId = req.user._id.toString();

    // Check if owner already has a salon
    const existing = OWNER_SALONS.find((s) => s.ownerId === userId);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have a salon registered. Please use Update Salon to make changes.',
      });
    }

    const {
      name,
      tagline,
      gender,
      location,
      phone,
      email,
      openingHours,
      capacity,
      availableSeats,
      photos,
      priceRange,
      services,
      amenities,
    } = req.body;

    if (!name || !gender) {
      return res.status(400).json({ success: false, message: 'Salon name and category are required' });
    }

    const newSalon = {
      _id: `owner-salon-${Date.now()}`,
      ownerId: userId,
      name,
      tagline: tagline || 'Premium grooming and styling studio',
      gender: gender === 'women' ? 'women' : 'men',
      rating: 5.0,
      reviewsCount: 0,
      priceRange: priceRange || '$$',
      capacity: Number(capacity) || 3,
      availableSeats: Number(availableSeats) || Number(capacity) || 3,
      photos:
        photos && photos.length > 0
          ? photos
          : [
              gender === 'women'
                ? 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
                : 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
            ],
      location: location || { address: '', city: '', state: '', pincode: '', country: 'India' },
      phone: phone || '',
      email: email || '',
      openingHours: openingHours || {
        monday:    { open: '09:00', close: '20:00', closed: false },
        tuesday:   { open: '09:00', close: '20:00', closed: false },
        wednesday: { open: '09:00', close: '20:00', closed: false },
        thursday:  { open: '09:00', close: '20:00', closed: false },
        friday:    { open: '09:00', close: '21:00', closed: false },
        saturday:  { open: '09:00', close: '21:00', closed: false },
        sunday:    { open: '00:00', close: '00:00', closed: true },
      },
      services:
        services && services.length > 0
          ? services
          : [{ name: gender === 'women' ? 'Haircut & Styling' : 'Signature Haircut', price: 45, duration: '30 mins' }],
      amenities:
        amenities && amenities.length > 0 ? amenities : ['Card Accepted', 'Free Wi-Fi', 'Appointment Available'],
    };

    OWNER_SALONS.push(newSalon);

    res.status(201).json({ success: true, message: 'Salon added successfully!', data: newSalon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/salons/:id ──────────────────────────────────────────────────────
router.put('/:id', protect, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    let salonIndex = OWNER_SALONS.findIndex((s) => s._id === id && s.ownerId === userId);

    if (salonIndex === -1) {
      // Try by ownerId only (in case id mismatch)
      salonIndex = OWNER_SALONS.findIndex((s) => s.ownerId === userId);
    }

    if (salonIndex === -1) {
      return res.status(404).json({ success: false, message: 'Salon not found. Please add your salon first.' });
    }

    const updated = { ...OWNER_SALONS[salonIndex], ...req.body, ownerId: userId };
    OWNER_SALONS[salonIndex] = updated;

    res.json({ success: true, message: 'Salon updated successfully!', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
