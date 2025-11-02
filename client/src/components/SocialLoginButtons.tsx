import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInWithGoogle, signInWithApple } from "@/lib/firebase";
// Note: Replace with your actual toast implementation
interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

const useToast = () => {
  return {
    toast: ({ title, description, variant }: ToastOptions) => {
      if (variant === 'destructive') {
        alert(`Error: ${title}\n${description}`);
      } else {
        alert(`${title}\n${description}`);
      }
    }
  };
};

interface User {
  displayName?: string | null;
  email?: string | null;
  uid: string;
}

interface SocialLoginButtonsProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

export default function SocialLoginButtons({ onSuccess, onError }: SocialLoginButtonsProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success && result.user) {
        toast({
          title: "Success!",
          description: `Welcome, ${result.user.displayName || 'User'}!`,
        });
        onSuccess?.(result.user);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to sign in with Google",
          variant: "destructive",
        });
        onError?.(result.error || "Unknown error");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in with Google";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      const result = await signInWithApple();
      if (result.success && result.user) {
        toast({
          title: "Success!",
          description: `Welcome, ${result.user.displayName || 'User'}!`,
        });
        onSuccess?.(result.user);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to sign in with Apple",
          variant: "destructive",
        });
        onError?.(result.error || "Unknown error");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in with Apple";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Sign-In Button */}
      <Button
        variant="outline"
        className="w-full h-12 relative hover:bg-slate-50 transition-colors"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || appleLoading}
      >
        {googleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <svg className="absolute left-4 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </>
        )}
      </Button>

      {/* Apple Sign-In Button */}
      <Button
        variant="outline"
        className="w-full h-12 relative bg-black hover:bg-gray-900 text-white border-black transition-colors"
        onClick={handleAppleSignIn}
        disabled={googleLoading || appleLoading}
      >
        {appleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <svg className="absolute left-4 h-5 w-5 fill-white" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="font-medium">Continue with Apple</span>
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>
    </div>
  );
}
