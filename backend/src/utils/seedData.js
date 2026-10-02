const User = require('../models/User');
const Salon = require('../models/Salon');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('📦 Database already populated. Skipping seed.');
      return;
    }

    console.log('🌱 Seeding database with realistic salon data...');

    // 1. Create Barber Owners
    const barber1 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@snip.app',
      password: 'password123',
      phone: '+1 (415) 555-0142',
      role: 'barber',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const barber2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@snip.app',
      password: 'password123',
      phone: '+1 (415) 555-0188',
      role: 'barber',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    });

    const barber3 = await User.create({
      name: 'Darius Cole',
      email: 'darius@snip.app',
      password: 'password123',
      phone: '+1 (415) 555-0199',
      role: 'barber',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    // 2. Create Customers
    const customer1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@customer.com',
      password: 'password123',
      phone: '+1 (415) 555-0101',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    });

    const customer2 = await User.create({
      name: 'Sophia Chen',
      email: 'sophia@customer.com',
      password: 'password123',
      phone: '+1 (415) 555-0102',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    const customer3 = await User.create({
      name: 'Liam Patel',
      email: 'liam@customer.com',
      password: 'password123',
      phone: '+1 (415) 555-0103',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    });

    // 3. Create Salons
    const salon1 = await Salon.create({
      owner: barber1._id,
      name: 'Apothecary Grooming Lounge',
      tagline: 'Modern Barbershop & Classic Razor Shaves',
      description:
        'A refined sanctuary dedicated to the craft of traditional barbering and contemporary hair artistry. Handcrafted pomades, single-origin espresso, and bespoke styling.',
      address: {
        street: '428 Valencia St',
        city: 'San Francisco',
        state: 'CA',
        pincode: '94103',
        formattedAddress: '428 Valencia St, Mission District, San Francisco, CA 94103',
      },
      location: {
        type: 'Point',
        coordinates: [-122.4218, 37.7648], // Mission District
      },
      coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
      photos: [
        'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
      ],
      totalSeats: 3,
      priceRange: '$$',
      phone: '+1 (415) 555-0142',
      amenities: ['Complimentary Beverages', 'Hot Towel Treatment', 'Free High-Speed Wi-Fi', 'Air Conditioned', 'Card & Apple Pay'],
      services: [
        { name: 'Signature Skin Fade & Style', price: 45, durationMinutes: 30, category: 'Hair', description: 'Precision fade tailored to head shape with straight razor neck line cleanup.' },
        { name: 'Traditional Hot Towel Straight Razor Shave', price: 35, durationMinutes: 30, category: 'Beard', description: 'Pre-shave essential oils, double hot towel wrap, and cooling aftershave balm.' },
        { name: 'Executive Grooming Package', price: 75, durationMinutes: 60, category: 'Hair & Beard', description: 'Full haircut, beard sculpt, hot towel facial massage, and styling.' },
        { name: 'Beard Sculpt & Lineup', price: 25, durationMinutes: 20, category: 'Beard', description: 'Beard shaping with clippers and foil shaver edge definition.' },
      ],
      staff: [
        { name: 'Marcus Vance', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', specialty: 'Skin Fades & Textured Crops', isActive: true },
        { name: 'Leo Sterling', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', specialty: 'Hot Towel Shaves & Beard Artistry', isActive: true },
        { name: 'Nico Santos', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', specialty: 'Classic Pompadours & Tapers', isActive: true },
      ],
      hairstyleGallery: [
        {
          image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
          styleName: 'Mid Taper Fade with Textured Top',
          category: 'men',
        },
        {
          image: 'https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&w=600&q=80',
          styleName: 'Crisp Beard Sculpt & Sharp Edge',
          category: 'beard',
        },
        {
          image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
          styleName: 'Low Drop Fade Crop',
          category: 'men',
        },
        {
          image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80',
          styleName: 'Clean Lineup & Tapered Beard',
          category: 'beard',
        },
      ],
      avgRating: 4.9,
      numReviews: 2,
    });

    const salon2 = await Salon.create({
      owner: barber2._id,
      name: 'Atelier Luminance Hair Studio',
      tagline: 'Contemporary Balayage & Precision Hair Architecture',
      description:
        'A sun-drenched Scandinavian minimalist studio focused on organic hair treatments, bespoke dimensional color, precision bobs, and effortless lived-in texture.',
      address: {
        street: '1840 Union St',
        city: 'San Francisco',
        state: 'CA',
        pincode: '94123',
        formattedAddress: '1840 Union St, Marina District, San Francisco, CA 94123',
      },
      location: {
        type: 'Point',
        coordinates: [-122.4312, 37.7981], // Marina District
      },
      coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      photos: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
      ],
      totalSeats: 4,
      priceRange: '$$$',
      phone: '+1 (415) 555-0188',
      amenities: ['Specialty Coffee & Matcha Bar', 'Cruelty-Free Products', 'Private Wash Suites', 'Silent Appointment Option'],
      services: [
        { name: 'Custom Balayage & Gloss Finish', price: 195, durationMinutes: 90, category: 'Color', description: 'Hand-painted dimensional highlights paired with nourishing peptide glaze.' },
        { name: 'Designer Cut & Blowdry Sculpt', price: 85, durationMinutes: 45, category: 'Hair', description: 'Bespoke consultation, clarifying botanical wash, custom layering, and blowout.' },
        { name: 'Botanical Keratin Infusion', price: 140, durationMinutes: 60, category: 'Treatment', description: 'Zero-formaldehyde smoothing treatment to eliminate frizz and boost gloss.' },
        { name: 'Fringe & Face-Framing Refresh', price: 35, durationMinutes: 20, category: 'Hair', description: 'Precision curtain bang reshape and front layer trimming.' },
      ],
      staff: [
        { name: 'Elena Rostova', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', specialty: 'Balayage & Color Correction', isActive: true },
        { name: 'Camilla Thorne', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', specialty: 'Precision French Bobs & Waves', isActive: true },
        { name: 'Yuki Tanaka', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', specialty: 'Japanese Silk Hair Straightening', isActive: true },
      ],
      hairstyleGallery: [
        {
          image: 'https://images.unsplash.com/photo-1560869713-da86a9ec4623?auto=format&fit=crop&w=600&q=80',
          styleName: 'Sun-Kissed Caramel Balayage',
          category: 'women',
        },
        {
          image: 'https://images.unsplash.com/photo-1584297091622-af8e5fdcf9ff?auto=format&fit=crop&w=600&q=80',
          styleName: 'Blunt French Bob with Soft Fringe',
          category: 'women',
        },
        {
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
          styleName: 'Lived-In Dimensional Blonde Waves',
          category: 'women',
        },
      ],
      avgRating: 4.8,
      numReviews: 2,
    });

    const salon3 = await Salon.create({
      owner: barber3._id,
      name: 'Crown & Razor Heritage Parlour',
      tagline: 'Modern Craftsmanship for All Hair Types',
      description:
        'Specializing in high fades, taper textures, razor detailing, and kids styling in a relaxed, friendly environment.',
      address: {
        street: '715 Montgomery St',
        city: 'San Francisco',
        state: 'CA',
        pincode: '94111',
        formattedAddress: '715 Montgomery St, Financial District, San Francisco, CA 94111',
      },
      location: {
        type: 'Point',
        coordinates: [-122.4034, 37.7952], // Financial District
      },
      coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
      photos: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      ],
      totalSeats: 3,
      priceRange: '$$',
      phone: '+1 (415) 555-0199',
      amenities: ['Walk-ins Welcome', 'Kid Friendly Waiting Lounge', 'Card Payments'],
      services: [
        { name: 'Classic Gentlemen Haircut', price: 40, durationMinutes: 30, category: 'Hair', description: 'Shear and clipper cut with neck shave and hot lather.' },
        { name: 'Junior Grooming (Under 12)', price: 28, durationMinutes: 25, category: 'Kids', description: 'Patient, gentle haircut with styling product of choice.' },
        { name: 'Beard Trim & Hydration Mask', price: 22, durationMinutes: 20, category: 'Beard', description: 'Beard detangling, conditioning balm, and crisp outline.' },
      ],
      staff: [
        { name: 'Darius Cole', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', specialty: 'Burst Fades & Line Work', isActive: true },
        { name: 'Amir Bradley', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', specialty: 'Kids Haircuts & Tapers', isActive: true },
      ],
      hairstyleGallery: [
        {
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          styleName: 'High Top Fade Clean Finish',
          category: 'men',
        },
        {
          image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
          styleName: 'Little Champ Taper Cut',
          category: 'kids',
        },
      ],
      avgRating: 4.7,
      numReviews: 1,
    });

    // 4. Create Sample Completed Bookings
    const today = new Date();
    const pastDate1 = new Date(today);
    pastDate1.setDate(today.getDate() - 3);

    const pastDate2 = new Date(today);
    pastDate2.setDate(today.getDate() - 5);

    const booking1 = await Booking.create({
      customer: customer1._id,
      salon: salon1._id,
      services: [{ name: 'Signature Skin Fade & Style', price: 45, durationMinutes: 30 }],
      date: pastDate1,
      startTime: '11:00',
      endTime: '11:30',
      totalDurationMinutes: 30,
      totalPrice: 45,
      seatNumber: 1,
      preferredStaff: 'Marcus Vance',
      status: 'completed',
      hasReviewed: true,
    });

    const booking2 = await Booking.create({
      customer: customer2._id,
      salon: salon1._id,
      services: [{ name: 'Executive Grooming Package', price: 75, durationMinutes: 60 }],
      date: pastDate2,
      startTime: '14:00',
      endTime: '15:00',
      totalDurationMinutes: 60,
      totalPrice: 75,
      seatNumber: 2,
      preferredStaff: 'Leo Sterling',
      status: 'completed',
      hasReviewed: true,
    });

    const booking3 = await Booking.create({
      customer: customer2._id,
      salon: salon2._id,
      services: [{ name: 'Custom Balayage & Gloss Finish', price: 195, durationMinutes: 90 }],
      date: pastDate1,
      startTime: '10:00',
      endTime: '11:30',
      totalDurationMinutes: 90,
      totalPrice: 195,
      seatNumber: 1,
      preferredStaff: 'Elena Rostova',
      status: 'completed',
      hasReviewed: true,
    });

    // 5. Create Verified Reviews
    await Review.create({
      customer: customer1._id,
      salon: salon1._id,
      booking: booking1._id,
      rating: 5,
      comment: 'Hands down the cleanest fade in SF. Marcus took time to match my hairline shape and the hot towel finish was superb.',
      serviceNames: ['Signature Skin Fade & Style'],
      createdAt: pastDate1,
    });

    await Review.create({
      customer: customer2._id,
      salon: salon1._id,
      booking: booking2._id,
      rating: 5,
      comment: 'Brought my partner here for the executive package before our anniversary dinner. World-class service and calm atmosphere.',
      serviceNames: ['Executive Grooming Package'],
      createdAt: pastDate2,
    });

    await Review.create({
      customer: customer2._id,
      salon: salon2._id,
      booking: booking3._id,
      rating: 5,
      comment: 'Elena is a color genius! My balayage looks natural, dimensional, and the salon feels like a tranquil art gallery.',
      serviceNames: ['Custom Balayage & Gloss Finish'],
      createdAt: pastDate1,
    });

    // 6. Create an Upcoming Booking for Customer 1
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 2);

    await Booking.create({
      customer: customer1._id,
      salon: salon1._id,
      services: [{ name: 'Signature Skin Fade & Style', price: 45, durationMinutes: 30 }],
      date: futureDate,
      startTime: '15:00',
      endTime: '15:30',
      totalDurationMinutes: 30,
      totalPrice: 45,
      seatNumber: 1,
      preferredStaff: 'Marcus Vance',
      status: 'confirmed',
      hasReviewed: false,
    });

    console.log('✅ Seed data successfully created!');
    console.log('👤 Demo Customer: alex@customer.com / password123');
    console.log('✂️ Demo Barber (Owner): marcus@snip.app / password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedDatabase;
