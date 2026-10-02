import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Clock, Phone, Star, Sparkles, Check,
  Calendar, Heart, X, ChevronDown, ChevronUp, Armchair,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/common/Toast';

const FILTER_TAGS = ['All', 'Balayage', 'Haircut', 'Facial', 'Nails', 'Keratin', 'Highlights'];

const DAYS_SHORT = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_ABBR = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

function formatHours(salon) {
  if (salon.openingHours) {
    const today = DAYS_SHORT[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const h = salon.openingHours[today];
    if (!h || h.closed) return 'Closed Today';
    return `${h.open} – ${h.close}`;
  }
  return salon.hours || 'See details';
}

function getSeatStatus(salon) {
  const available = salon.availableSeats !== undefined ? salon.availableSeats : salon.totalSeats;
  const total = salon.capacity || salon.totalSeats || 0;
  return { available: Number(available), total: Number(total) };
}

const SalonCard = ({ salon, onBook }) => {
  const [showHours, setShowHours] = useState(false);
  const { available, total } = getSeatStatus(salon);
  const coverPhoto = (salon.photos && salon.photos[0]) || salon.image;
  const fullAddr = salon.location
    ? `${salon.location.address}${salon.location.city ? `, ${salon.location.city}` : ''}${salon.location.state ? `, ${salon.location.state}` : ''}`
    : `${salon.address || ''}, ${salon.city || ''}`;

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col">
      <div>
        {/* Photo */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={coverPhoto}
            alt={salon.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-900/80 backdrop-blur-md text-white">
              {salon.priceRange}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md text-white flex items-center gap-1 ${
                available > 0 ? 'bg-rose-500/90' : 'bg-zinc-700/90'
              }`}
            >
              <Armchair className="w-3 h-3" />
              {available > 0 ? `${available}/${total} Open` : 'Full'}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-white flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {salon.rating} ({salon.reviewsCount})
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">{salon.name}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 font-normal">{salon.tagline}</p>
          </div>

          {/* Location & Hours */}
          <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <span>{fullAddr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{formatHours(salon)}</span>
              {salon.openingHours && (
                <button
                  type="button"
                  onClick={() => setShowHours((v) => !v)}
                  className="ml-auto flex items-center gap-0.5 text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                  All hours {showHours ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
            {showHours && salon.openingHours && (
              <div className="ml-5 mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5">
                {DAYS_SHORT.map((d) => {
                  const h = salon.openingHours[d];
                  return (
                    <div key={d} className="flex justify-between text-[10px]">
                      <span className="text-zinc-500 font-semibold w-8">{DAY_ABBR[d]}</span>
                      <span className={h?.closed ? 'text-rose-400' : 'text-zinc-600 dark:text-zinc-400'}>
                        {h?.closed ? 'Closed' : `${h?.open} – ${h?.close}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              Beauty & Styling Services
            </h4>
            <div className="space-y-1.5">
              {(salon.services || []).slice(0, 4).map((srv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800"
                >
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{srv.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400">{srv.duration}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">₹{srv.price}</span>
                    <button
                      type="button"
                      onClick={() => onBook(salon, srv)}
                      className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[11px] font-bold hover:bg-rose-600 transition-colors ml-1"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          {salon.amenities && salon.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {salon.amenities.map((item, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium">
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-auto p-5 sm:p-6 pt-0 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <span className="text-xs text-zinc-400 flex items-center gap-1">
          <Phone className="w-3.5 h-3.5" />
          {salon.phone}
        </span>
        <button
          type="button"
          onClick={() => onBook(salon, null)}
          disabled={available === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Calendar className="w-3.5 h-3.5" />
          {available === 0 ? 'Fully Booked' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
};

const WomenSalons = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationParam = searchParams.get('location') || '';

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationInput, setLocationInput] = useState(locationParam);
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookedSalon, setBookedSalon] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    setLocationInput(searchParams.get('location') || '');
  }, [searchParams]);

  const fetchSalons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (locationParam) params.set('location', locationParam);
      const res = await api.get(`/salons/women?${params.toString()}`);
      if (res.data?.success) setSalons(res.data.data);
    } catch (err) {
      console.error('Failed to fetch women salons:', err);
    } finally {
      setLoading(false);
    }
  }, [search, locationParam]);

  useEffect(() => {
    const t = setTimeout(fetchSalons, 250);
    return () => clearTimeout(t);
  }, [fetchSalons]);

  const filteredSalons = salons.filter((s) => {
    if (activeFilter === 'All') return true;
    const q = activeFilter.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.tagline || '').toLowerCase().includes(q) ||
      (s.services || []).some((srv) => srv.name.toLowerCase().includes(q))
    );
  });

  const handleLocationSearch = (e) => {
    e.preventDefault();
    setSearchParams(locationInput ? { location: locationInput } : {});
  };

  const clearLocation = () => {
    setLocationInput('');
    setSearchParams({});
  };

  const handleBook = (salon, service) => {
    const { available } = getSeatStatus(salon);
    if (available === 0) { addToast('This salon is fully booked right now.', 'error'); return; }
    setBookedSalon({ salon, service });
    addToast(`Appointment booked at ${salon.name}! 💇‍♀️`, 'success');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200">

      {/* Header Banner */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-rose-50/40 dark:bg-zinc-900/50 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Women's Beauty & Salons</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            Top Women's Salons & Beauty Studios
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Premium salons for balayage, keratin, facials, nail art, haircuts & bridal styling.
          </p>

          {/* Search + Location + Filters */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Text search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by salon name, style, or service..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-700 shadow-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* Location search */}
              <form onSubmit={handleLocationSearch} className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-rose-400 dark:focus-within:ring-rose-700">
                <div className="pl-3 shrink-0">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                </div>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="City or area..."
                  className="flex-1 min-w-0 px-2 py-2.5 text-sm bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                />
                {locationInput && (
                  <button type="button" onClick={clearLocation} className="px-2 text-zinc-400 hover:text-zinc-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button type="submit" className="px-3.5 py-2.5 bg-rose-500 text-white hover:bg-rose-600 text-xs font-bold transition-colors shrink-0">
                  Search
                </button>
              </form>
            </div>
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveFilter(tag)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeFilter === tag
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {tag === 'All' ? 'All Services' : tag}
                </button>
              ))}
            </div>
          </div>

          {locationParam && (
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                <MapPin className="w-3 h-3" />
                Showing salons near: <span className="font-bold">{locationParam}</span>
              </span>
              <button onClick={clearLocation} className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline">
                Clear
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Salons Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Women's Beauty Salons ({filteredSalons.length})
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Live availability · Instant booking
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-2">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-zinc-300 dark:border-zinc-700 border-t-rose-500" />
            <span className="text-xs">Finding best salons...</span>
          </div>
        ) : filteredSalons.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
            <Sparkles className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">No salons found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {locationParam
                ? `No salons found in "${locationParam}". Try a different city or area.`
                : 'Try adjusting your search or filter.'}
            </p>
            {locationParam && (
              <button onClick={clearLocation} className="mt-3 text-xs text-zinc-700 dark:text-zinc-300 underline font-semibold">
                Show all salons
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSalons.map((salon) => (
              <SalonCard key={salon._id} salon={salon} onBook={handleBook} />
            ))}
          </div>
        )}
      </main>

      {/* Booking modal */}
      {bookedSalon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 dark:bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">Appointment Booked!</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Your booking at <span className="font-semibold text-zinc-800 dark:text-zinc-200">{bookedSalon.salon.name}</span> is confirmed.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Service:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {bookedSalon.service ? bookedSalon.service.name : 'General Appointment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Location:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-right max-w-[60%]">
                  {bookedSalon.salon.location
                    ? `${bookedSalon.salon.location.address}, ${bookedSalon.salon.location.city}`
                    : bookedSalon.salon.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Phone:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{bookedSalon.salon.phone}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBookedSalon(null)}
              className="w-full py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WomenSalons;
