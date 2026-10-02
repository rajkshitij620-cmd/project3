import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scissors,
  Clock,
  ShieldCheck,
  Sparkles,
  MapPin,
  Heart,
  Phone,
  Mail,
  ArrowRight,
  Store,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* 1. Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-zinc-900 group-hover:scale-105 transition-transform shadow-sm">
                <Scissors className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-black text-xl tracking-tight text-zinc-900 dark:text-white">Snip</span>
            </Link>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed max-w-sm">
              The minimal and modern salon booking platform. Discover top-rated barbers and luxury styling studios near you with zero wait times.
            </p>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live chair availability in 100+ cities</span>
            </div>
          </div>

          {/* 2. Discover / Customer Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Discover
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/men" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Men's Barbershops
                </Link>
              </li>
              <li>
                <Link to="/women" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Women's Beauty Studios
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Platform Features
                </a>
              </li>
            </ul>
          </div>

          {/* 3. For Salon Owners */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              For Salon Owners
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/add-salon" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-500" />
                  <span>Add Your Salon</span>
                </Link>
              </li>
              <li>
                <Link to="/update-salon" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Update Salon Profile
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Partner Registration
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Instant Chair Management
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Why Snip & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Why Snip
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200 shrink-0 mt-0.5" />
                <span>Zero wait times with instant seat locking</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>100% verified customer reviews only</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Transparent pricing with no hidden charges</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} Snip. Minimal, Real & Instant Salon Booking.</p>

          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
              Crafted with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> for modern grooming
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
