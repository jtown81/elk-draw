interface AdPlaceholderProps {
  size: 'banner' | 'rectangle' | 'sidebar' | 'leaderboard';
  className?: string;
}

const sizeMap = {
  banner: {
    mobile: 'w-full h-[50px]',
    desktop: 'w-full h-[90px]',
    hidden: false,
  },
  rectangle: {
    mobile: 'w-full h-[100px]',
    desktop: 'w-[300px] h-[250px]',
    hidden: false,
  },
  sidebar: {
    mobile: 'hidden',
    desktop: 'w-[300px] h-[600px]',
    hidden: true,
  },
  leaderboard: {
    mobile: 'w-full h-[50px]',
    desktop: 'w-full h-[90px]',
    hidden: false,
  },
};

export function AdPlaceholder({ size, className = '' }: AdPlaceholderProps) {
  const dims = sizeMap[size];

  if (size === 'sidebar') {
    return (
      <div
        className={`hidden lg:block ${dims.desktop} border-2 border-dashed border-amber-dark/30 rounded-lg flex items-center justify-center bg-canopy/50 ${className}`}
        data-ad-slot={`ad-${size}`}
      >
        <span className="text-parchment text-sm font-heading">Advertisement</span>
      </div>
    );
  }

  return (
    <div
      className={`${dims.mobile} md:${dims.desktop} border-2 border-dashed border-amber-dark/30 rounded-lg flex items-center justify-center bg-canopy/50 ${className}`}
      data-ad-slot={`ad-${size}`}
    >
      <span className="text-parchment text-sm font-heading">Advertisement</span>
    </div>
  );
}
