// src/components/environment-badge.tsx
'use client';

export function EnvironmentBadge() {
  const env = process.env.NEXT_PUBLIC_DEPLOY_ENV;

  // Only show in dev and stage — never in production
  if (!env || env === 'production') return null;

  const colors: Record<string, string> = {
    development: 'bg-green-500',
    staging: 'bg-yellow-500',
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-[9999] rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg ${colors[env] ?? 'bg-gray-500'}`}
    >
      {env.toUpperCase()}
    </div>
  );
}
