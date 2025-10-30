import { APP_LOGO } from "@/const";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = "md", 
  text = "جاري التحميل...",
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="h-full w-full rounded-full border-4 border-primary/30 border-t-primary"></div>
        </div>
        
        {/* Inner pulsing circle with logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse">
            <img 
              src={APP_LOGO} 
              alt="ViScan" 
              className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16'} object-contain`}
            />
          </div>
        </div>
      </div>
      
      {text && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

// Medical-themed DNA helix loader
export function DNALoader({ text = "تحليل البيانات..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-24 h-32">
        {/* DNA Helix Animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-primary rounded-full animate-dna-helix"
                style={{
                  left: '25%',
                  top: `${i * 20}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={`r-${i}`}
                className="absolute w-3 h-3 bg-blue-500 rounded-full animate-dna-helix-reverse"
                style={{
                  right: '25%',
                  top: `${i * 20}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

// Heartbeat loader for medical theme
export function HeartbeatLoader({ text = "معالجة..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-32 h-16">
        <svg
          className="w-full h-full"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 50 L 40 50 L 50 30 L 60 70 L 70 50 L 110 50 L 120 20 L 130 80 L 140 50 L 200 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary animate-heartbeat"
          />
        </svg>
      </div>
      {text && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

// Skeleton loader for content
export function SkeletonLoader() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-4 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="h-24 bg-muted rounded animate-pulse" />
        <div className="h-24 bg-muted rounded animate-pulse" />
        <div className="h-24 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

// Progress bar loader
export function ProgressLoader({ 
  progress = 0, 
  text = "جاري التحميل..." 
}: { 
  progress?: number; 
  text?: string;
}) {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{text}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Scanning animation for image analysis
export function ScanningLoader({ text = "مسح الصورة..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-48 h-48 border-2 border-primary/30 rounded-lg overflow-hidden">
        {/* Scanning line */}
        <div className="absolute inset-x-0 h-1 bg-primary shadow-lg shadow-primary/50 animate-scan" />
        
        {/* Corner markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={APP_LOGO} 
            alt="ViScan" 
            className="w-16 h-16 object-contain opacity-50"
          />
        </div>
      </div>
      
      {text && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
