import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom"; // Added useLocation
import { Mail, Lock, Loader2, EyeOff, Eye, CheckCircle2 } from "lucide-react"; // Added CheckCircle2

import useAuth from "../authentication/useAuth.js";
import AuthLayout from "../layouts/AuthLayout.jsx";
import AuthCard from "../components/AuthCard.jsx";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Used to catch the success message
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Check if we arrived here from a successful password reset
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
      // Clean up state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:7005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.message || "Login failed" });
        setIsLoading(false);
        return;
      }

      // AUTH VIA CONTEXT
      login(data.token, data.user);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrors({
        api: "Server not responding. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Please enter your details to sign in"
        footer={
          <>
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign up for free
            </a>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Success Message Alert */}
          {successMsg && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700 animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "", api: "" }));
                  setSuccessMsg(""); // Clear success message on typing
                }}
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-500 ml-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "", api: "" }));
                  setSuccessMsg(""); // Clear success message on typing
                }}
                className={`w-full rounded-xl border pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:ring-4 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500 ml-1">
                {errors.password}
              </p>
            )}
          </div>

          {errors.api && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
              {errors.api}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-70 transition-all active:scale-[0.98]"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Authenticating..." : "Sign in to Dashboard"}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;