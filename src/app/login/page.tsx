"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../../components/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (isSignUp && !email.endsWith("@shortpoint.com")) {
      return "Only shortpoint.com domain users can sign up";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (isSignUp && password.length < 8) {
      return "Password must be at least 8 characters";
    }
    return "";
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ) => {
    if (isSignUp && !confirmPassword) return "Please confirm your password";
    if (isSignUp && confirmPassword !== password)
      return "Passwords do not match";
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const newErrors: { [key: string]: string } = {};

    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      try {
        let success = false;

        if (isSignUp) {
          success = await signup(formData.email, formData.password);
          if (!success) {
            setErrors({
              email: "Only shortpoint.com domain users can sign up",
            });
          }
        } else {
          success = await login(formData.email, formData.password);
          if (!success) {
            setErrors({ password: "Invalid email or password" });
          }
        }

        if (success) {
          // Redirect will be handled by useEffect
          router.push("/");
        }
      } catch {
        setErrors({ password: "An error occurred. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleForgotPassword = () => {
    alert("Forgot password functionality (Mock - not connected to backend)");
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] to-[#e8eef7] flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3161D1]/20 border-t-[#3161D1]"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#7DD3C0] animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="space-y-2">
            <p className="text-[#202224] text-lg font-semibold">Loading...</p>
            <p className="text-[#5774A8] text-sm">Preparing your experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] to-[#e8eef7] flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm mx-auto sm:max-w-md">
        {/* ShortPoint Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/shortpoint-logo.svg"
            alt="ShortPoint"
            width={200}
            height={60}
            className="h-10 w-auto sm:h-12 transition-all duration-300"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#202224] mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm sm:text-base text-[#5774A8]">
            {isSignUp
              ? "Join the ShortPoint community"
              : "Sign in to access your dashboard"}
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-xl rounded-2xl sm:py-8 sm:px-10 backdrop-blur-sm border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#202224]"
              >
                Email Address<span className="text-[#ef4444] ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#ADB5BD]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-4 text-base border-2 transition-all duration-200 rounded-xl bg-[#f8f9fa] focus:bg-white placeholder-[#ADB5BD] focus:outline-none touch-manipulation ${
                    errors.email
                      ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-4 focus:ring-[#ef4444]/20"
                      : "border-transparent focus:border-[#3161D1] focus:ring-4 focus:ring-[#3161D1]/20"
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              {errors.email && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-1 h-1 bg-[#ef4444] rounded-full"></div>
                  <p className="text-sm text-[#ef4444] font-medium">
                    {errors.email}
                  </p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#202224]"
              >
                Password<span className="text-[#ef4444] ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#ADB5BD]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-14 py-4 text-base border-2 transition-all duration-200 rounded-xl bg-[#f8f9fa] focus:bg-white placeholder-[#ADB5BD] focus:outline-none touch-manipulation ${
                    errors.password
                      ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-4 focus:ring-[#ef4444]/20"
                      : "border-transparent focus:border-[#3161D1] focus:ring-4 focus:ring-[#3161D1]/20"
                  }`}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    type="button"
                    className="text-[#ADB5BD] hover:text-[#3161D1] transition-colors p-2 touch-manipulation"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" data-testid="eye-icon" />
                    ) : (
                      <Eye className="h-5 w-5" data-testid="eye-icon" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-1 h-1 bg-[#ef4444] rounded-full"></div>
                  <p className="text-sm text-[#ef4444] font-medium">
                    {errors.password}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field (only for sign up) */}
            {isSignUp && (
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#202224]"
                >
                  Confirm Password<span className="text-[#ef4444] ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#ADB5BD]" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-4 py-4 text-base border-2 transition-all duration-200 rounded-xl bg-[#f8f9fa] focus:bg-white placeholder-[#ADB5BD] focus:outline-none touch-manipulation ${
                      errors.confirmPassword
                        ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-4 focus:ring-[#ef4444]/20"
                        : "border-transparent focus:border-[#3161D1] focus:ring-4 focus:ring-[#3161D1]/20"
                    }`}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-1 h-1 bg-[#ef4444] rounded-full"></div>
                    <p className="text-sm text-[#ef4444] font-medium">
                      {errors.confirmPassword}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-6 text-base font-semibold text-white bg-gradient-to-r from-[#3161D1] to-[#4A73DF] rounded-xl shadow-lg hover:shadow-xl hover:from-[#2a56c7] hover:to-[#3d66d4] focus:outline-none focus:ring-4 focus:ring-[#3161D1]/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    <span>
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </span>
                  </div>
                ) : (
                  <span className="flex items-center">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </span>
                )}
              </button>
            </div>

            {/* Forgot Password (only for login) */}
            {!isSignUp && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-[#3161D1] hover:text-[#2a56c7] transition-colors py-2 px-4 rounded-lg hover:bg-[#3161D1]/5 touch-manipulation"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#eaeaea]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#5774A8] font-medium">
                  {isSignUp ? "Already have an account?" : "New to ShortPoint?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFormData({ email: "", password: "", confirmPassword: "" });
                  setErrors({});
                }}
                className="w-full flex justify-center items-center py-4 px-6 border-2 border-[#eaeaea] rounded-xl text-base font-semibold text-[#202224] bg-white hover:bg-[#f8f9fa] hover:border-[#3161D1] focus:outline-none focus:ring-4 focus:ring-[#3161D1]/20 transition-all duration-200 touch-manipulation"
              >
                {isSignUp ? "Sign In Instead" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
