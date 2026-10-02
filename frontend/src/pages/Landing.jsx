import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, MapPin, PlusCircle, Edit, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useTypewriter from '../hooks/useTypewriter';

// ─── Constants ────────────────────────────────────────────────────────────────

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4';

const SENSITIVITY = 0.8;

// Role-specific content
const HERO_CONTENT = {
  guest: {
    intro: ["Hey there, welcome to Snip,", "Your smart salon discovery & booking platform."],
    typewriter: "Find the perfect salon near you. Great cuts, flawless styles, and zero wait time.",
    pills: [
      { label: "Browse Men's Salons", route: '/login', solid: true },
      { label: "Browse Women's Salons", route: '/login', solid: true },
      { label: "Register Free", route: '/register', solid: true },
      { label: "List Your Salon", route: '/register', solid: true },
    ],
  },
  customer: {
    intro: ["Welcome back to Snip,", "Top salons are ready for your next visit."],
    typewriter: "Discover nearby salons. Book your next haircut, beard trim, or beauty treatment in seconds.",
    pills: [
      { label: "✂️ Men's Salons", route: '/men', solid: true },
      { label: "💇‍♀️ Women's Salons", route: '/women', solid: true },
    ],
  },
  owner: {
    intro: ["Welcome back, Salon Owner,", "Manage your Snip presence right here."],
    typewriter: "Add your salon, update availability, and start receiving customer bookings today.",
    pills: [
      { label: "Add Your Salon", route: '/add-salon', solid: true, icon: PlusCircle },
      { label: "Update Salon", route: '/update-salon', solid: true, icon: Edit },
    ],
  },
};

// ─── Copy Icon SVG ────────────────────────────────────────────────────────────
function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="0.5" width="8" height="8" rx="1.2" />
      <rect x="0.5" y="3.5" width="8" height="8" rx="1.2" />
    </svg>
  );
}

// ─── Feature cards (below hero) ───────────────────────────────────────────────
const FEATURES = [
  {
    icon: '✂️',
    title: 'Real-Time Availability',
    desc: 'See exactly how many chairs are open right now — no calls, no guessing.',
  },
  {
    icon: '📍',
    title: 'Location-Based Search',
    desc: 'Filter salons by city or neighbourhood. Find the best one closest to you.',
  },
  {
    icon: '⭐',
    title: 'Verified Ratings',
    desc: 'Honest reviews from real customers help you choose with confidence every time.',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const prevXRef = useRef(null);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);

  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Determine role
  const role = !user ? 'guest' : user.role === 'owner' ? 'owner' : 'customer';
  const content = HERO_CONTENT[role];

  // Typewriter text changes based on auth state — reset on change
  const { displayed, done } = useTypewriter(content.typewriter, 38, 600);

  // ── Pills fade in 400 ms after page load ─────────────────────────────────
  useEffect(() => {
    setPillsVisible(false);
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, [role]);

  // ── Mouse-scrub video ────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMouseMove = (e) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      if (!video.duration || isNaN(video.duration)) return;

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + offset)
      );

      if (!seekingRef.current) {
        seekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    const handleSeeked = () => {
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
        video.currentTime = targetTimeRef.current;
      } else {
        seekingRef.current = false;
      }
    };

    const handleMouseLeave = () => { prevXRef.current = null; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  // ── Copy email ────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('hello@snip.co');
    } catch {
      const el = document.createElement('textarea');
      el.value = 'hello@snip.co';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Shared style values ───────────────────────────────────────────────────
  const heroFont = {
    fontSize: 'clamp(17px, 3.8vw, 25px)',
    lineHeight: 1.35,
    fontWeight: 400,
    color: '#fff',
    fontFamily: 'var(--font-body)',
  };

  const pillBase =
    'inline-flex items-center justify-center gap-1.5 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 mx-[0.2em] mb-[0.4em] whitespace-nowrap transition-colors duration-200 cursor-pointer border';

  const pillPy = { paddingTop: '0.32em', paddingBottom: '0.32em' };

  return (
    <>
      {/* ── Hero section — video is ONLY visible here ───────────────────────── */}
      {/* overflow:hidden clips the absolutely-positioned video to this section */}
      <section
        className="relative flex flex-col justify-end md:justify-center pb-14 md:pb-0 px-5 sm:px-8 md:px-12 overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        {/* Video — absolute, fills only the hero section */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '70% center',
            pointerEvents: 'none',
          }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {/* Dark gradient overlay — also absolute, only inside hero */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.25) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hero content — sits above video */}
        <div style={{ maxWidth: '580px', position: 'relative', zIndex: 1 }}>

          {/* Snip logo mark */}
          <div className="mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Snip
            </span>
          </div>

          {/* Blurred intro label */}
          <p
            className="mb-5 sm:mb-6 select-none pointer-events-none"
            style={{ ...heroFont, lineHeight: 1.3, filter: 'blur(4px)' }}
          >
            {content.intro[0]}
            <br />
            {content.intro[1]}
          </p>

          {/* Typewriter text */}
          <p className="mb-5 sm:mb-6" style={{ ...heroFont, minHeight: '52px' }}>
            {displayed}
            {!done && (
              <span
                className="snip-cursor-blink inline-block align-middle ml-[2px]"
                style={{ width: '2px', height: '1.1em', backgroundColor: '#fff' }}
              />
            )}
          </p>

          {/* Action pill buttons */}
          <div
            className="flex flex-wrap gap-y-0"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {/* Role-specific solid white pills */}
            {content.pills.map(({ label, route, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(route)}
                className={`${pillBase} bg-white text-black border-black/10 hover:bg-black hover:text-white`}
                style={pillPy}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}

            {/* Guest: Log In + Sign Up */}
            {role === 'guest' && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className={`${pillBase} bg-transparent text-white border-white hover:bg-white hover:text-black gap-2`}
                  style={pillPy}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className={`${pillBase} bg-transparent text-white border-white hover:bg-white hover:text-black gap-2`}
                  style={pillPy}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Sign Up
                </button>
              </>
            )}

            {/* Contact email outline pill */}
            <button
              type="button"
              onClick={handleCopy}
              className={`${pillBase} bg-transparent text-white border-white hover:bg-white hover:text-black gap-2 sm:gap-3`}
              style={pillPy}
              title={copied ? 'Copied!' : 'Copy email'}
            >
              <span>
                Contact:{' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px' }}>
                  hello@snip.co
                </span>
              </span>
              {copied ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="2,6.5 5,9.5 10,3" />
                </svg>
              ) : (
                <CopyIcon />
              )}
            </button>

            {/* Customer: location search hint */}
            {role === 'customer' && (
              <button
                type="button"
                onClick={() => navigate('/men')}
                className={`${pillBase} bg-transparent text-white border-white/50 hover:bg-white hover:text-black gap-1.5`}
                style={pillPy}
              >
                <MapPin className="w-3.5 h-3.5" />
                Search by location
              </button>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none select-none"
          style={{ opacity: 0.45, zIndex: 1 }}
        >
          <span style={{ fontSize: '11px', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, #fff, transparent)' }} />
        </div>
      </section>

      {/* ── Features section (below hero, solid background) ─────────────────── */}
      <section
        id="features"
        className="relative z-10 bg-white dark:bg-zinc-950 px-5 sm:px-8 md:px-12 py-20 sm:py-24"
      >
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold mb-5">
            <Scissors className="w-3.5 h-3.5 -rotate-45" />
            <span>Why Snip</span>
          </div>

          <h2
            className="text-zinc-900 dark:text-white mb-12"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Booking a salon<br />
            <span className="opacity-40">should feel effortless.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3
                  className="text-zinc-900 dark:text-white mb-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(16px, 1.6vw, 19px)',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </h3>
                <p
                  className="text-zinc-500 dark:text-zinc-400"
                  style={{ fontSize: '14px', lineHeight: 1.6 }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          {!user && (
            <div className="mt-14 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <UserPlus className="w-4 h-4" />
                Get started — it's free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <LogIn className="w-4 h-4" />
                Log in
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About anchor */}
      <div id="about" />
    </>
  );
};

export default Landing;
