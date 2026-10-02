import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Scissors,
  Sun,
  Moon,
  LogOut,
  User,
  Home as HomeIcon,
  ChevronDown,
  LogIn,
  UserPlus,
  PlusCircle,
  Edit,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to switch navbar from transparent → frosted white on home page
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll(); // run once on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const authDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target)) {
        setAuthDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setAuthDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  const handleLocationSearch = (e) => {
    e.preventDefault();
    const val = locationSearch.trim();
    const isOnMen = location.pathname === '/men';
    const isOnWomen = location.pathname === '/women';

    if (isOnMen || isOnWomen) {
      const target = isOnMen ? '/men' : '/women';
      navigate(`${target}?location=${encodeURIComponent(val)}`);
    } else {
      navigate(`/men?location=${encodeURIComponent(val)}`);
    }
  };

  const isHome        = location.pathname === '/';
  const isMen         = location.pathname === '/men';
  const isWomen       = location.pathname === '/women';
  const isAddSalon    = location.pathname === '/add-salon';
  const isUpdateSalon = location.pathname === '/update-salon';

  const isOwner    = user?.role === 'owner';
  const isCustomer = user && !isOwner;

  // ── Transparent only when at the very top of the home page.
  // Once the user scrolls > 80px, switch to the solid frosted style.
  const onHero = isHome && !scrolled;

  // ── Dynamic class helpers ─────────────────────────────────────────────────

  // Outer <header>
  const headerClass = onHero
    ? 'sticky top-0 z-40 border-b border-transparent transition-all duration-300'
    : 'sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black transition-all duration-300';

  // Home link pill
  const homeLinkClass = onHero
    ? `inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
        isHome
          ? 'bg-white/15 text-white'
          : 'text-white/80 hover:text-white hover:bg-white/10'
      }`
    : `inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
        isHome
          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
          : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`;

  // Generic nav link pill factory
  const navLinkClass = (active) =>
    onHero
      ? `inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
          active ? 'bg-white/15 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
        }`
      : `inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
          active
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-sm'
            : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`;

  // Theme toggle button
  const themeToggleClass = onHero
    ? 'w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors'
    : 'w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors';

  // Logged-in user button
  const userBtnClass = onHero
    ? 'inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs sm:text-sm font-semibold text-white transition-colors focus:outline-none'
    : 'inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 transition-colors focus:outline-none';

  // User avatar dot
  const avatarClass = onHero
    ? 'w-5 h-5 rounded-full bg-white/30 text-white flex items-center justify-center text-[10px] font-black'
    : 'w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black';

  // Guest account button
  const guestBtnClass = onHero
    ? 'inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/15 border border-white/30 text-white text-xs sm:text-sm font-bold hover:bg-white/25 transition-colors shadow-sm'
    : 'inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-xs sm:text-sm font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shadow-sm';

  // Guest feature/about links
  const guestNavLinkClass = onHero
    ? 'hidden md:inline-flex items-center h-9 px-3 rounded-xl text-xs sm:text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0'
    : 'hidden md:inline-flex items-center h-9 px-3 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0';

  // Location search form (customer, navbar center)
  const locationFormClass = onHero
    ? 'hidden sm:flex flex-1 max-w-xs items-center gap-0 rounded-xl border border-white/25 bg-white/10 overflow-hidden focus-within:ring-2 focus-within:ring-white/40 transition-all backdrop-blur-sm'
    : 'hidden sm:flex flex-1 max-w-xs items-center gap-0 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 overflow-hidden focus-within:ring-2 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 transition-all';

  const locationInputClass = onHero
    ? 'flex-1 min-w-0 px-2 py-2 text-xs bg-transparent text-white placeholder:text-white/50 focus:outline-none'
    : 'flex-1 min-w-0 px-2 py-2 text-xs bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none';

  const locationSubmitClass = onHero
    ? 'px-3 py-2 bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0'
    : 'px-3 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors shrink-0';

  return (
    <header className={headerClass} style={onHero ? { background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)' } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main nav row ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left: Brand + nav links */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0 py-1">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm ${
                onHero
                  ? 'bg-white/15 border border-white/25 text-white'
                  : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
              }`}>
                <Scissors className="w-4 h-4 -rotate-45" />
              </div>
              <span className={`font-extrabold text-lg tracking-tight ${onHero ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                Snip
              </span>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">

              {/* Home */}
              <Link to="/" className={homeLinkClass}>
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>

              {/* CUSTOMER: Men & Women */}
              {isCustomer && (
                <>
                  <Link to="/men" className={navLinkClass(isMen)}>
                    <span>✂️ Men</span>
                  </Link>
                  <Link to="/women" className={navLinkClass(isWomen)}>
                    <span>💇‍♀️ Women</span>
                  </Link>
                </>
              )}

              {/* OWNER: Add Salon & Update Salon */}
              {isOwner && (
                <>
                  <Link to="/add-salon" className={navLinkClass(isAddSalon)}>
                    <PlusCircle className={`w-3.5 h-3.5 ${onHero ? 'text-amber-300' : 'text-amber-500'}`} />
                    <span>Add Salon</span>
                  </Link>
                  <Link to="/update-salon" className={navLinkClass(isUpdateSalon)}>
                    <Edit className={`w-3.5 h-3.5 ${onHero ? 'text-amber-300' : 'text-amber-500'}`} />
                    <span>Update Salon</span>
                  </Link>
                </>
              )}

              {/* GUEST: Features & About */}
              {!user && (
                <>
                  <a href="/#features" className={guestNavLinkClass}>Features</a>
                  <a href="/#about" className={`${guestNavLinkClass} hidden lg:inline-flex`}>About</a>
                </>
              )}
            </nav>
          </div>

          {/* Center: Location search (customer only) */}
          {isCustomer && (
            <form onSubmit={handleLocationSearch} className={locationFormClass}>
              <div className="flex items-center pl-3 shrink-0">
                <MapPin className={`w-3.5 h-3.5 ${onHero ? 'text-white/60' : 'text-zinc-400'}`} />
              </div>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search by city or area..."
                className={locationInputClass}
              />
              {locationSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocationSearch('');
                    if (isMen) navigate('/men');
                    if (isWomen) navigate('/women');
                  }}
                  className={`px-2 ${onHero ? 'text-white/60 hover:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button type="submit" className={locationSubmitClass}>
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Right: Theme toggle + auth */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={themeToggleClass}
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Logged-in user dropdown */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className={userBtnClass}
                >
                  <div className={avatarClass}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[80px] truncate leading-tight font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    } ${onHero ? 'text-white/60' : 'text-zinc-400'}`}
                  />
                </button>

                {/* Dropdown card — white in light mode, black in dark mode */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-xl p-1.5 z-50">
                    <div className="px-3.5 py-3 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0">
                          {isOwner ? 'Owner' : 'Customer'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-1">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest account dropdown */
              <div className="relative" ref={authDropdownRef}>
                <button
                  type="button"
                  onClick={() => setAuthDropdownOpen((prev) => !prev)}
                  className={guestBtnClass}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Account</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${authDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown card — white in light mode, black in dark mode */}
                {authDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-xl p-1.5 z-50">
                    <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Welcome to Snip</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Join or access your account</p>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <Link
                        to="/login"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                          <LogIn className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <span className="block font-bold">Log In</span>
                          <span className="text-[10px] text-zinc-400 font-normal">Existing user</span>
                        </div>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <UserPlus className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <span className="block font-bold text-emerald-600 dark:text-emerald-400">Sign Up</span>
                          <span className="text-[10px] text-zinc-400 font-normal">Customer or Salon Owner</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile location search row (customer only) */}
        {isCustomer && (
          <div className="sm:hidden pb-3">
            <form
              onSubmit={handleLocationSearch}
              className={`flex items-center gap-0 rounded-xl overflow-hidden transition-all ${
                onHero
                  ? 'border border-white/25 bg-white/10 focus-within:ring-2 focus-within:ring-white/40 backdrop-blur-sm'
                  : 'border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 focus-within:ring-2 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600'
              }`}
            >
              <div className="flex items-center pl-3 shrink-0">
                <MapPin className={`w-3.5 h-3.5 ${onHero ? 'text-white/60' : 'text-zinc-400'}`} />
              </div>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search by city or area..."
                className={`flex-1 min-w-0 px-2 py-2.5 text-xs bg-transparent focus:outline-none ${
                  onHero ? 'text-white placeholder:text-white/50' : 'text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500'
                }`}
              />
              {locationSearch && (
                <button
                  type="button"
                  onClick={() => { setLocationSearch(''); if (isMen) navigate('/men'); if (isWomen) navigate('/women'); }}
                  className={`px-2 ${onHero ? 'text-white/60 hover:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="submit"
                className={onHero
                  ? 'px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0'
                  : 'px-3.5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shrink-0'
                }
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
