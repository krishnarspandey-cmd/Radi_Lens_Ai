export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-lg gap-md">
      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-3 border-surface-variant rounded-full" />
        <div className="absolute inset-0 border-3 border-primary border-t-transparent rounded-full animate-spin-slow" />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-title-sm text-on-surface mb-1">Analyzing X-Ray</p>
        <p className="text-body-sm text-on-surface-variant">Running multi-model inference…</p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            style={{
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
