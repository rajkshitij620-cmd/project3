import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Store, Plus, Trash2, Save, Scissors, Sparkles,
  MapPin, Phone, Mail, Image, Clock, Users, AlertCircle, CheckCircle2,
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

const inputCls =
  'w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500';

const Section = ({ icon: Icon, title, children }) => (
  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      <Icon className="w-3.5 h-3.5" />
      {title}
    </h3>
    {children}
  </div>
);

const UpdateSalon = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [salon, setSalon] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fields
  const [gender, setGender] = useState('men');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [priceRange, setPriceRange] = useState('$$');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [photoUrls, setPhotoUrls] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [openingHours, setOpeningHours] = useState(DEFAULT_HOURS);
  const [capacity, setCapacity] = useState(3);
  const [availableSeats, setAvailableSeats] = useState(3);
  const [services, setServices] = useState([]);
  const [svcName, setSvcName] = useState('');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcDuration, setSvcDuration] = useState('30 mins');

  // Load salon data
  useEffect(() => {
    const load = async () => {
      setFetchLoading(true);
      try {
        const res = await api.get('/salons/owner/my-salon');
        if (res.data?.success && res.data.data) {
          const s = res.data.data;
          setSalon(s);
          setGender(s.gender || 'men');
          setName(s.name || '');
          setTagline(s.tagline || '');
          setPhone(s.phone || '');
          setEmail(s.email || '');
          setPriceRange(s.priceRange || '$$');
          // Location
          const loc = s.location || {};
          setAddress(loc.address || s.address || '');
          setCity(loc.city || s.city || '');
          setStateName(loc.state || '');
          setPincode(loc.pincode || '');
          setCountry(loc.country || 'India');
          // Photos
          setPhotoUrls(s.photos || (s.image ? [s.image] : []));
          // Hours
          setOpeningHours(s.openingHours || DEFAULT_HOURS);
          // Capacity
          setCapacity(s.capacity || s.totalSeats || 3);
          setAvailableSeats(s.availableSeats !== undefined ? s.availableSeats : (s.capacity || s.totalSeats || 3));
          // Services
          setServices(s.services || []);
        }
      } catch (err) {
        console.error('Failed to load salon:', err);
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, []);

  const handleHourChange = (day, field, value) => {
    setOpeningHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const addPhoto = () => {
    const trimmed = newPhotoUrl.trim();
    if (!trimmed) return;
    if (photoUrls.includes(trimmed)) { addToast('Already added', 'error'); return; }
    setPhotoUrls((prev) => [...prev, trimmed]);
    setNewPhotoUrl('');
  };

  const removePhoto = (idx) => setPhotoUrls((prev) => prev.filter((_, i) => i !== idx));

  const addService = () => {
    if (!svcName.trim() || !svcPrice) { addToast('Enter name and price', 'error'); return; }
    setServices((prev) => [...prev, { name: svcName.trim(), price: Number(svcPrice), duration: svcDuration || '30 mins' }]);
    setSvcName(''); setSvcPrice(''); setSvcDuration('30 mins');
  };

  const removeService = (idx) => setServices((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!name.trim()) { addToast('Salon name is required', 'error'); return; }
    if (Number(availableSeats) > Number(capacity)) { addToast('Available seats cannot exceed capacity', 'error'); return; }

    setSaveLoading(true);
    try {
      const res = await api.put(`/salons/${salon._id}`, {
        name,
        tagline,
        gender,
        phone,
        email,
        priceRange,
        location: { address, city, state: stateName, pincode, country },
        photos: photoUrls,
        openingHours,
        capacity: Number(capacity),
        availableSeats: Number(availableSeats),
        services,
      });
      if (res.data?.success) {
        setSalon(res.data.data);
        setSaved(true);
        addToast('✅ Salon updated successfully!', 'success');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.customMessage || 'Failed to update salon';
      addToast(msg, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // ── States ──────────────────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading your salon...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">No Salon Found</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You haven't added a salon yet. Register your salon first to start getting customers.
          </p>
          <Link
            to="/add-salon"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shadow-sm"
          >
            <Store className="w-4 h-4" /> Add Your Salon
          </Link>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold mb-2">
              <Store className="w-3.5 h-3.5 text-amber-500" />
              <span>Salon Owner Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Update Salon</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Edit any detail and click Save to apply changes.</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveLoading}
            className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50 ${
              saved
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100'
            }`}
          >
            {saveLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>

        {/* 1. Category */}
        <Section icon={Scissors} title="1. Salon Category">
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: 'men', label: "Men's Salon", icon: <Scissors className="w-4 h-4 -rotate-45" /> },
              { val: 'women', label: "Women's Salon", icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
            ].map(({ val, label, icon }) => (
              <button
                key={val}
                type="button"
                onClick={() => setGender(val)}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm font-bold transition-all ${
                  gender === val
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                    : 'bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </Section>

        {/* 2. Salon Information */}
        <Section icon={Store} title="2. Salon Information">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Salon Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Apex Gentlemen Studio" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Tagline / Specialty</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Precision fades & beard sculpts" className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                <Phone className="inline w-3.5 h-3.5 mr-1" /> Phone
              </label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                <Mail className="inline w-3.5 h-3.5 mr-1" /> Email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="salon@example.com" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Price Range</label>
            <div className="flex gap-2">
              {['$', '$$', '$$$', '$$$$'].map((p) => (
                <button key={p} type="button" onClick={() => setPriceRange(p)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                    priceRange === p
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>
        </Section>

        {/* 3. Location */}
        <Section icon={MapPin} title="3. Salon Location">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Street Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 123 MG Road" className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">State</label>
              <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="e.g. Maharashtra" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">PIN / ZIP Code</label>
              <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="400001" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" className={inputCls} />
            </div>
          </div>
        </Section>

        {/* 4. Photos */}
        <Section icon={Image} title="4. Salon Photos">
          <div className="space-y-2">
            {photoUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
                <img
                  src={url}
                  alt={`Photo ${idx + 1}`}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=Err'; }}
                  className="w-14 h-14 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                    Photo {idx + 1} {idx === 0 && <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">COVER</span>}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">{url}</p>
                </div>
                <button type="button" onClick={() => removePhoto(idx)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {photoUrls.length === 0 && (
              <div className="py-4 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl">
                No photos added yet.
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
              placeholder="https://images.unsplash.com/..."
              className={`${inputCls} flex-1`}
            />
            <button type="button" onClick={addPhoto}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </Section>

        {/* 5. Opening Hours */}
        <Section icon={Clock} title="5. Opening Hours">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Check the box to mark a day as closed.</p>
          {DAYS.map((day) => {
            const h = openingHours[day] || { open: '09:00', close: '20:00', closed: false };
            return (
              <div
                key={day}
                className={`grid grid-cols-[90px_1fr] items-center gap-3 p-3 rounded-xl border transition-colors ${
                  h.closed
                    ? 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-60'
                    : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`upd-closed-${day}`}
                    checked={h.closed}
                    onChange={(e) => handleHourChange(day, 'closed', e.target.checked)}
                    className="w-4 h-4 accent-zinc-900 dark:accent-white cursor-pointer"
                  />
                  <label htmlFor={`upd-closed-${day}`} className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer capitalize select-none">
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
                      className="flex-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2 py-1.5 text-zinc-900 dark:text-white focus:outline-none"
                    />
                    <span className="text-xs text-zinc-400">to</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                      className="flex-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2 py-1.5 text-zinc-900 dark:text-white focus:outline-none"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </Section>

        {/* 6. Capacity */}
        <Section icon={Users} title="6. Capacity & Seat Availability">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Total Capacity</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setCapacity((c) => Math.max(1, Number(c) - 1))}
                  className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">−</button>
                <input type="number" min="1" max="50" value={capacity}
                  onChange={(e) => setCapacity(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-center text-xl font-black rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 py-2 text-zinc-900 dark:text-white focus:outline-none" />
                <button type="button" onClick={() => setCapacity((c) => Number(c) + 1)}
                  className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">+</button>
              </div>
              <p className="text-xs text-zinc-400 mt-1.5">Total seats in salon</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Available Now</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setAvailableSeats((s) => Math.max(0, Number(s) - 1))}
                  className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">−</button>
                <input type="number" min="0" max={capacity} value={availableSeats}
                  onChange={(e) => setAvailableSeats(Math.min(Number(capacity), Math.max(0, Number(e.target.value))))}
                  className="w-16 text-center text-xl font-black rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 py-2 text-zinc-900 dark:text-white focus:outline-none" />
                <button type="button" onClick={() => setAvailableSeats((s) => Math.min(Number(capacity), Number(s) + 1))}
                  className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">+</button>
              </div>
              <p className={`text-xs font-semibold mt-1.5 ${Number(availableSeats) === 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {Number(availableSeats) === 0 ? '❌ Fully booked' : `✅ ${availableSeats} open`}
              </p>
            </div>
          </div>
          {/* Visual seat grid */}
          <div className="flex flex-wrap gap-2 pt-2">
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
        </Section>

        {/* 7. Services */}
        <Section icon={CheckCircle2} title="7. Services & Pricing">
          <div className="space-y-2">
            {services.map((srv, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="font-bold text-zinc-900 dark:text-white">{srv.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400">{srv.duration}</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">₹{srv.price}</span>
                  <button type="button" onClick={() => removeService(idx)}
                    className="p-1 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="py-4 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl">
                No services added.
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px_90px_auto] gap-2">
            <input type="text" value={svcName} onChange={(e) => setSvcName(e.target.value)} placeholder="Service name" className={inputCls} />
            <input type="number" value={svcPrice} onChange={(e) => setSvcPrice(e.target.value)} placeholder="Price (₹)" className={inputCls} />
            <input type="text" value={svcDuration} onChange={(e) => setSvcDuration(e.target.value)} placeholder="30 mins" className={inputCls} />
            <button type="button" onClick={addService}
              className="flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </Section>

        {/* Bottom Save */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saveLoading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-colors shadow-lg disabled:opacity-50 ${
            saved
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100'
          }`}
        >
          {saveLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4" /> Changes Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save All Changes</>
          )}
        </button>
      </div>
    </div>
  );
};

export default UpdateSalon;
