const Salon = require('../models/Salon');
const Review = require('../models/Review');

// Helper to calculate distance in KM between two lat/lng pairs
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// @desc    Get Home Feed of nearby salons with gallery highlights and blended score
// @route   GET /api/salons/home-feed
// @access  Public
exports.getHomeFeed = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || 37.7749; // Default SF
    const lng = parseFloat(req.query.lng) || -122.4194;

    const salons = await Salon.find().populate('owner', 'name email phone avatar');

    // Enrich with distance and blended score
    const enriched = salons.map((salon) => {
      const salonObj = salon.toObject();
      const salonLng = salon.location.coordinates[0];
      const salonLat = salon.location.coordinates[1];
      const distanceKm = calculateHaversineDistance(lat, lng, salonLat, salonLng);

      // Blended score = avgRating * 0.7 - (distanceKm * 0.05)
      const score = (salon.avgRating || 0) * 0.7 - distanceKm * 0.05;

      // Active barbers working now
      const activeBarbersCount = salon.staff ? salon.staff.filter((s) => s.isActive).length : 0;

      // Top 3-4 gallery highlights
      const galleryHighlights = (salon.hairstyleGallery || []).slice(0, 4);

      return {
        ...salonObj,
        distanceKm,
        score,
        activeBarbersCount,
        galleryHighlights,
      };
    });

    // Sort by blended score descending
    enriched.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      count: enriched.length,
      userLocation: { lat, lng },
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all salons / Search with filters
// @route   GET /api/salons
// @access  Public
exports.getSalons = async (req, res, next) => {
  try {
    const {
      search,
      category,
      sort,
      priceRange,
      lat = 37.7749,
      lng = -122.4194,
      maxDistance = 50, // in km
    } = req.query;

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { 'address.city': searchRegex },
        { 'address.street': searchRegex },
        { 'services.name': searchRegex },
        { 'services.category': searchRegex },
      ];
    }

    if (priceRange) {
      query.priceRange = priceRange;
    }

    let salons = await Salon.find(query).populate('owner', 'name email phone avatar');

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    let enriched = salons.map((salon) => {
      const salonObj = salon.toObject();
      const salonLng = salon.location.coordinates[0];
      const salonLat = salon.location.coordinates[1];
      const distanceKm = calculateHaversineDistance(userLat, userLng, salonLat, salonLng);
      const activeBarbersCount = salon.staff ? salon.staff.filter((s) => s.isActive).length : 0;

      return {
        ...salonObj,
        distanceKm,
        activeBarbersCount,
      };
    });

    // Filter by max distance if provided
    if (maxDistance) {
      enriched = enriched.filter((s) => s.distanceKm <= parseFloat(maxDistance));
    }

    // Filter by service category if requested
    if (category && category !== 'all') {
      const catRegex = new RegExp(category, 'i');
      enriched = enriched.filter(
        (s) =>
          (s.services && s.services.some((srv) => catRegex.test(srv.category) || catRegex.test(srv.name))) ||
          (s.hairstyleGallery && s.hairstyleGallery.some((g) => catRegex.test(g.category) || catRegex.test(g.styleName)))
      );
    }

    // Sorting
    if (sort === 'distance') {
      enriched.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sort === 'rating') {
      enriched.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    } else if (sort === 'reviews') {
      enriched.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
    } else {
      // Default: best blend
      enriched.sort((a, b) => (b.avgRating || 0) * 0.7 - a.distanceKm * 0.05 - ((a.avgRating || 0) * 0.7 - b.distanceKm * 0.05));
    }

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single salon with staff, gallery, and reviews
// @route   GET /api/salons/:id
// @access  Public
exports.getSalonById = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id).populate('owner', 'name email phone avatar');

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found',
      });
    }

    const reviews = await Review.find({ salon: salon._id })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    const activeBarbersCount = salon.staff ? salon.staff.filter((s) => s.isActive).length : 0;

    res.status(200).json({
      success: true,
      data: {
        ...salon.toObject(),
        activeBarbersCount,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current barber's salon
// @route   GET /api/salons/barber/my-salon
// @access  Private (Barber only)
exports.getMySalon = async (req, res, next) => {
  try {
    let salon = await Salon.findOne({ owner: req.user.id });

    if (!salon) {
      return res.status(200).json({
        success: true,
        hasSalon: false,
        data: null,
      });
    }

    const reviews = await Review.find({ salon: salon._id })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      hasSalon: true,
      data: {
        ...salon.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new salon
// @route   POST /api/salons
// @access  Private (Barber only)
exports.createSalon = async (req, res, next) => {
  try {
    const existingSalon = await Salon.findOne({ owner: req.user.id });
    if (existingSalon) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered a salon. You can manage and edit it in your dashboard.',
      });
    }

    const {
      name,
      tagline,
      description,
      services,
      photos,
      coverImage,
      address,
      coordinates,
      openingHours,
      totalSeats,
      staff,
      phone,
      priceRange,
      amenities,
    } = req.body;

    const salonData = {
      owner: req.user.id,
      name,
      tagline: tagline || 'Premium Grooming Studio',
      description: description || '',
      services: services || [],
      photos: photos || [],
      coverImage: coverImage || (photos && photos[0]) || '',
      address: address || {},
      location: {
        type: 'Point',
        coordinates: coordinates || [-122.4194, 37.7749],
      },
      totalSeats: totalSeats ? parseInt(totalSeats, 10) : 2,
      staff: staff || [{ name: req.user.name, specialty: 'Master Stylist', isActive: true }],
      phone: phone || req.user.phone || '',
      priceRange: priceRange || '$$',
      amenities: amenities || ['Air Conditioned', 'Card Payments'],
    };

    if (openingHours) {
      salonData.openingHours = openingHours;
    }

    const salon = await Salon.create(salonData);

    res.status(201).json({
      success: true,
      message: 'Salon registered successfully!',
      data: salon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update salon profile
// @route   PUT /api/salons/:id
// @access  Private (Barber only - owner check)
exports.updateSalon = async (req, res, next) => {
  try {
    let salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found' });
    }

    // Owner check
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this salon' });
    }

    const updateFields = { ...req.body };
    if (req.body.coordinates) {
      updateFields.location = {
        type: 'Point',
        coordinates: req.body.coordinates,
      };
      delete updateFields.coordinates;
    }

    salon = await Salon.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Salon updated successfully',
      data: salon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a service to salon
// @route   POST /api/salons/:id/services
// @access  Private (Barber only)
exports.addService = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, price, durationMinutes, category, description } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide service name and price' });
    }

    salon.services.push({
      name,
      price: Number(price),
      durationMinutes: durationMinutes ? Number(durationMinutes) : 30,
      category: category || 'General',
      description: description || '',
    });

    await salon.save();

    res.status(201).json({
      success: true,
      message: 'Service added',
      data: salon.services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/salons/:id/services/:serviceId
// @access  Private (Barber only)
exports.deleteService = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    salon.services = salon.services.filter((s) => s._id.toString() !== req.params.serviceId);
    await salon.save();

    res.status(200).json({
      success: true,
      message: 'Service removed',
      data: salon.services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a staff member
// @route   POST /api/salons/:id/staff
// @access  Private (Barber only)
exports.addStaff = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, photo, specialty, isActive } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Staff name is required' });

    salon.staff.push({
      name,
      photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      specialty: specialty || 'Stylist',
      isActive: isActive !== undefined ? isActive : true,
    });

    await salon.save();

    res.status(201).json({
      success: true,
      message: 'Staff member added',
      data: salon.staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update staff member (e.g. toggle active/working status)
// @route   PUT /api/salons/:id/staff/:staffId
// @access  Private (Barber only)
exports.updateStaff = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const staffMember = salon.staff.id(req.params.staffId);
    if (!staffMember) return res.status(404).json({ success: false, message: 'Staff member not found' });

    if (req.body.name !== undefined) staffMember.name = req.body.name;
    if (req.body.photo !== undefined) staffMember.photo = req.body.photo;
    if (req.body.specialty !== undefined) staffMember.specialty = req.body.specialty;
    if (req.body.isActive !== undefined) staffMember.isActive = req.body.isActive;

    await salon.save();

    res.status(200).json({
      success: true,
      message: 'Staff updated',
      data: salon.staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/salons/:id/staff/:staffId
// @access  Private (Barber only)
exports.deleteStaff = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    salon.staff = salon.staff.filter((s) => s._id.toString() !== req.params.staffId);
    await salon.save();

    res.status(200).json({
      success: true,
      message: 'Staff removed',
      data: salon.staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add hairstyle gallery photo
// @route   POST /api/salons/:id/gallery
// @access  Private (Barber only - owner check)
exports.addGalleryItem = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized. You can only upload styles to your own salon.' });
    }

    const { image, styleName, category } = req.body;
    if (!image || !styleName) {
      return res.status(400).json({ success: false, message: 'Image URL and style name are required' });
    }

    salon.hairstyleGallery.unshift({
      image,
      styleName,
      category: category || 'other',
      uploadedAt: new Date(),
    });

    await salon.save();

    res.status(201).json({
      success: true,
      message: 'Hairstyle added to gallery',
      data: salon.hairstyleGallery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hairstyle gallery photo
// @route   DELETE /api/salons/:id/gallery/:imageId
// @access  Private (Barber only - owner check)
exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    salon.hairstyleGallery = salon.hairstyleGallery.filter((item) => item._id.toString() !== req.params.imageId);
    await salon.save();

    res.status(200).json({
      success: true,
      message: 'Hairstyle removed from gallery',
      data: salon.hairstyleGallery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hairstyle styles feed across salons
// @route   GET /api/salons/gallery/all
// @access  Public
exports.getAllHairstyles = async (req, res, next) => {
  try {
    const { category } = req.query;
    const salons = await Salon.find({}, 'name coverImage address hairstyleGallery avgRating').populate('owner', 'name avatar');

    let allStyles = [];
    salons.forEach((salon) => {
      if (salon.hairstyleGallery && salon.hairstyleGallery.length > 0) {
        salon.hairstyleGallery.forEach((item) => {
          if (!category || category === 'all' || item.category === category) {
            allStyles.push({
              _id: item._id,
              image: item.image,
              styleName: item.styleName,
              category: item.category,
              uploadedAt: item.uploadedAt,
              salon: {
                _id: salon._id,
                name: salon.name,
                city: salon.address?.city,
                avgRating: salon.avgRating,
              },
            });
          }
        });
      }
    });

    // Sort newest first
    allStyles.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.status(200).json({
      success: true,
      count: allStyles.length,
      data: allStyles,
    });
  } catch (error) {
    next(error);
  }
};
