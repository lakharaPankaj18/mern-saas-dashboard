import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Loader2,
  Sparkles,
  CheckCircle2,
  EyeOff,
  Eye,
} from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import AuthCard from "../components/AuthCard";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Helper to check if passwords match and are not empty
  const isMatched =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors as user types
    if (name === "confirmPassword" || name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        api: "",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "", api: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:7005/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrors({ api: data.message || "Registration failed" });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("error", error);
      setErrors({ api: "Server error. Please try again." });
      setIsLoading(false);
    }
  };

  // Dynamic Tailwind Classes for Inputs
  const inputStyles = (error, success) => `
    w-full rounded-xl border bg-slate-50 pl-11 pr-12 py-2.5 text-sm transition-all duration-200
    focus:bg-white focus:outline-none focus:ring-4 
    ${
      error
        ? "border-red-500 focus:ring-red-100 ring-red-50"
        : success
        ? "border-emerald-500 focus:ring-emerald-100 bg-emerald-50/30"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 ring-indigo-50"
    }
  `;

  return (
    <AuthLayout>
      <AuthCard
        title="Create an account"
        description="Join us and start managing your dashboard"
        footer={
          <>
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign in
            </a>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3.5 top-3 text-slate-400"
                size={18}
              />
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={inputStyles(errors.name, false)}
              />
            </div>
            {errors.name && (
              <p className="ml-1 text-xs font-medium text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-semibold text-slate-700">
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-3 text-slate-400"
                size={18}
              />
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className={inputStyles(errors.email, false)}
              />
            </div>
            {errors.email && (
              <p className="ml-1 text-xs font-medium text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="ml-1 text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-3 text-slate-400"
                  size={18}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputStyles(errors.password, false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={2.5} />
                  ) : (
                    <Eye size={18} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="ml-1 text-sm font-semibold text-slate-700">
                Confirm
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-3 transition-colors duration-300 ${
                    isMatched ? "text-emerald-500" : "text-slate-400"
                  }`}
                  size={18}
                />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputStyles(errors.confirmPassword, isMatched)}
                />

                {/* Real-time Match Indicator */}
                <div className="absolute right-10 top-3 flex items-center">
                  {isMatched && (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-500 animate-in zoom-in duration-300"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3.5 top-3 transition-colors ${
                    isMatched ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} strokeWidth={2.5} />
                  ) : (
                    <Eye size={18} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {(errors.password || errors.confirmPassword) && (
            <p className="ml-1 text-xs font-medium text-red-500">
              {errors.password || errors.confirmPassword}
            </p>
          )}

          {/* API Error Container */}
          {errors.api && (
            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600 animate-in slide-in-from-top-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
              {errors.api}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group mt-2 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
            )}
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default Register;
