import React from 'react';

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
  statusIndicator,
}) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size] || sizeMap.md} rounded-full object-cover ring-2 ring-white border border-slate-200`}
        />
      ) : (
        <div
          className={`${
            sizeMap[size] || sizeMap.md
          } rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center justify-center ring-2 ring-white border border-amber-200`}
        >
          {getInitials(name)}
        </div>
      )}

      {statusIndicator !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
            statusIndicator ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
          title={statusIndicator ? 'Active now' : 'On leave'}
        />
      )}
    </div>
  );
};

export default Avatar;
