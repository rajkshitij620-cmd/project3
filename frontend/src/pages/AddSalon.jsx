import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store, Plus, Trash2, ArrowRight, ArrowLeft, Scissors, Sparkles,
  MapPin, Phone, Mail, Image, Clock, Users, CheckCircle2, ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/common/Toast';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

const DEFAULT_HOURS = {
  monday:    { open: '09:00', close: '20:00', closed: false },
  tuesday:   { open: '09:00', close: '20:00', closed: false },
  wednesday: { open: '09:00', close: '20:00', closed: false },
  thursday:  { open: '09:00', close: '20:00', closed: false },
  friday:    { open: '09:00', close: '21:00', closed: false },
  saturday:  { open: '09:00', close: '21:00', closed: false },
  sunday:    { open: '00:00', close: '00:00', closed: true },
};

const STEPS = [
  { id: 1, label: 'Category',    icon: Scissors },
  { id: 2, label: 'Information', icon: Store },
  { id: 3, label: 'Location',    icon: MapPin },
  { id: 4, label: 'Photos',      icon: Image },
  { id: 5, label: 'Hours',       icon: Clock },
  { id: 6, label: 'Capacity',    icon: Users },
  { id: 7, label: 'Services',    icon: CheckCircle2 },
];

const inputCls =
  'w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500';

const AddSalon = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Category
  const [gender, setGender] = useState('men');

  // Step 2: Information
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [priceRange, setPriceRange] = useState('$$');

  // Step 3: Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  // Step 4: Photos
  const [photoUrls, setPhotoUrls] = useState([
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Step 5: Opening Hours
  const [openingHours, setOpeningHours] = useState(DEFAULT_HOURS);

  // Step 6: Capacity & Availability
  const [capacity, setCapacity] = useState(3);
  const [availableSeats, setAvailableSeats] = useState(3);

  // Step 7: Services
  const [services, setServices] = useState([
    { name: 'Classic Haircut', price: 40, duration: '30 mins' },
  ]);
  const [svcName, setSvcName] = useState('');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcDuration, setSvcDuration] = useState('30 mins');

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleGenderChange = (val) => {
    setGender(val);
    if (val === 'men') {
      setPhotoUrls(['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80']);
    } else {
      setPhotoUrls(['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80']);
    }
  };

  const handleHourChange = (day, field, value) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const addPhoto = () => {
    const trimmed = newPhotoUrl.trim();
    if (!trimmed) return;
    if (photoUrls.includes(trimmed)) {
      addToast('Photo URL already added', 'error');
      return;
    }
    setPhotoUrls((prev) => [...prev, trimmed]);
    setNewPhotoUrl('');
  };

  const removePhoto = (idx) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const addService = () => {
    if (!svcName.trim() || !svcPrice) {
      addToast('Enter service name and price', 'error');
      return;
    }
    setServices((prev) => [...prev, { name: svcName.trim(), price: Number(svcPrice), duration: svcDuration || '30 mins' }]);
    setSvcName('');
    setSvcPrice('');
    setSvcDuration('30 mins');
  };

  const removeService = (idx) => setServices((prev) => prev.filter((_, i) => i !== idx));

  // ── Validation per step ────────────────────────────────────────────────────
  const validateStep = () => {
    if (step === 2 && !name.trim()) {
      addToast('Salon name is required', 'error');
      return false;
    }
    if (step === 3 && (!city.trim() || !address.trim())) {
      addToast('Address and city are required', 'error');
      return false;
    }
    if (step === 6 && Number(availableSeats) > Number(capacity)) {
      addToast('Available seats cannot exceed total capacity', 'error');
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (services.length === 0) {
      addToast('Add at least one service', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/salons', {
        name,
        tagline,
        gender,
        phone,
        email,
        priceRange,
        location: { address, city, state, pincode, country },
        photos: photoUrls,
        openingHours,
        capacity: Number(capacity),
        availableSeats: Number(availableSeats),
        services,
      });
      if (res.data?.success) {
        addToast(`🎉 "${name}" is now live on Snip!`, 'success');
        navigate('/update-salon');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.customMessage || 'Failed to add salon';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Render Helpers ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── Step 1: Category ──────────────────────────────────────────────────
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose the type of salon you're registering on Snip.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { val: 'men', label: "Men's Salon / Barbershop", sub: 'Haircuts, Fades, Beard Grooming', icon: <Scissors className="w-6 h-6 -rotate-45" /> },
                { val: 'women', label: "Women's Salon / Beauty Studio", sub: 'Haircare, Skincare, Nail Art', icon: <Sparkles className="w-6 h-6 text-amber-400" /> },
              ].map(({ val, label, sub, icon }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleGenderChange(val)}
                  className={`flex flex-col items-start gap-2 p-5 rounded-2xl border-2 text-left transition-all ${
                    gender === val
                      ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500'
                  }`}
                >
                  <span>{icon}</span>
                  <span className="font-bold text-sm">{label}</span>
                  <span className={`text-xs font-normal ${gender === val ? 'opacity-70' : 'text-zinc-400'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // ── Step 2: Information ───────────────────────────────────────────────
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Salon Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Apex Gentlemen Studio" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Tagline / Specialty</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Precision taper fades & beard sculpts" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  <Phone className="inline w-3.5 h-3.5 mr-1" />Phone Number
                </label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  <Mail className="inline w-3.5 h-3.5 mr-1" />Email
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="salon@example.com" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Price Range</label>
              <div className="flex gap-2">
                {['$', '$$', '$$$', '$$$$'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriceRange(p)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                      priceRange === p
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Step 3: Location ──────────────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Street Address *</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 123 MG Road, Near City Mall" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">City *</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Maharashtra" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">PIN / ZIP Code</label>
                <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="e.g. 400001" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" className={inputCls} />
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Accurate location helps customers find your salon easily via the location search feature.</span>
            </div>
          </div>
        );

      // ── Step 4: Photos ────────────────────────────────────────────────────
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Add photo URLs for your salon. The first photo will be used as the main cover image.
            </p>
            {/* Photo previews */}
            <div className="space-y-2">
              {photoUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
                  <img
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=Error'; }}
                    className="w-14 h-14 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">Photo {idx + 1} {idx === 0 && <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">COVER</span>}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {/* Add photo URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
                placeholder="https://images.unsplash.com/..."
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={addPhoto}
                className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Tip: Use Unsplash, Google Photos, or any direct image URL ending in .jpg / .png / .webp
            </p>
          </div>
        );

      // ── Step 5: Opening Hours ─────────────────────────────────────────────
      case 5:
        return (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              Set your operating hours for each day. Toggle "Closed" for days you don't operate.
            </p>
            {DAYS.map((day) => {
              const h = openingHours[day];
              return (
                <div
                  key={day}
                  className={`grid grid-cols-[80px_1fr] sm:grid-cols-[90px_1fr] items-center gap-3 p-3 rounded-xl border transition-colors ${
                    h.closed
                      ? 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-60'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`closed-${day}`}
                      checked={h.closed}
                      onChange={(e) => handleHourChange(day, 'closed', e.target.checked)}
                      className="w-4 h-4 accent-zinc-900 dark:accent-white cursor-pointer"
                    />
                    <label htmlFor={`closed-${day}`} className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer capitalize select-none">
                      {DAY_LABELS[day]}
                    </label>
                  </div>
                  {h.closed ? (
                    <span className="text-xs text-zinc-400 font-medium">Closed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={h.open}
                        onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                        className="flex-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2 py-1.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      />
                      <span className="text-xs text-zinc-400">to</span>
                      <input
                        type="time"
                        value={h.close}
                        onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                        className="flex-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2 py-1.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      // ── Step 6: Capacity & Seats ──────────────────────────────────────────
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                Total Seating Capacity
              </label>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                Maximum number of clients your salon can serve simultaneously.
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCapacity((c) => Math.max(1, Number(c) - 1))}
                  className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-bold text-lg transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={capacity}
                  onChange={(e) => setCapacity(Math.max(1, Number(e.target.value)))}
                  className="w-20 text-center text-xl font-black rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 py-2 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setCapacity((c) => Number(c) + 1)}
                  className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-bold text-lg transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">seats total</span>
              </div>
            </div>

            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />

            <div>
              <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                Currently Available Seats
              </label>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                How many seats are available right now? (Cannot exceed total capacity: {capacity})
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setAvailableSeats((s) => Math.max(0, Number(s) - 1))}
                  className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-bold text-lg transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  max={capacity}
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(Math.min(Number(capacity), Math.max(0, Number(e.target.value))))}
                  className="w-20 text-center text-xl font-black rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 py-2 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setAvailableSeats((s) => Math.min(Number(capacity), Number(s) + 1))}
                  className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-bold text-lg transition-colors"
                >
                  +
                </button>
                <span className={`text-sm font-semibold ${Number(availableSeats) === 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {Number(availableSeats) === 0 ? 'Full' : `${availableSeats} open`}
                </span>
              </div>

              {/* Visual seat indicator */}
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: Number(capacity) }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${
                      i < Number(availableSeats)
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-500'
                    }`}
                  >
                    {i < Number(availableSeats) ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Step 7: Services ──────────────────────────────────────────────────
      case 7:
        return (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Add the services you offer with pricing. You can always edit them later.
            </p>
            {/* Services list */}
            <div className="space-y-2">
              {services.map((srv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs"
                >
                  <span className="font-bold text-zinc-900 dark:text-white">{srv.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400">{srv.duration}</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">₹{srv.price}</span>
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="p-1 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="py-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl">
                  No services added yet. Add at least one service below.
                </div>
              )}
            </div>
            {/* Add service row */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px_90px_auto] gap-2">
              <input
                type="text"
                value={svcName}
                onChange={(e) => setSvcName(e.target.value)}
                placeholder="Service name (e.g. Skin Fade)"
                className={inputCls}
              />
              <input
                type="number"
                value={svcPrice}
                onChange={(e) => setSvcPrice(e.target.value)}
                placeholder="Price (₹)"
                className={inputCls}
              />
              <input
                type="text"
                value={svcDuration}
                onChange={(e) => setSvcDuration(e.target.value)}
                placeholder="30 mins"
                className={inputCls}
              />
              <button
                type="button"
                onClick={addService}
                className="flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold mb-3">
            <Store className="w-3.5 h-3.5 text-amber-500" />
            <span>Salon Owner Console</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Add Your Salon</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Complete all {STEPS.length} steps to publish your salon on Snip.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 scrollbar-none">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <React.Fragment key={s.id}>
                  <div
                    className={`flex flex-col items-center gap-1 cursor-pointer shrink-0 transition-all ${
                      active ? 'opacity-100' : done ? 'opacity-80' : 'opacity-40'
                    }`}
                    onClick={() => done && setStep(s.id)}
                    title={s.label}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        done
                          ? 'bg-emerald-500 text-white'
                          : active
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 ring-2 ring-zinc-900/30 dark:ring-white/30'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] font-semibold ${active ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded-full mx-1 mt-[-16px] transition-colors ${done ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Step {step} of {STEPS.length} — <span className="font-semibold text-zinc-800 dark:text-zinc-200">{STEPS[step - 1].label}</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-5">
            {step}. {STEPS[step - 1].label}
          </h2>
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shadow-sm"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Store className="w-4 h-4" /><span>Publish Salon</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSalon;
