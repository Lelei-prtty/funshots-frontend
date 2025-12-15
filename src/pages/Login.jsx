import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FunshotsName from "../assets/bg/funshotsname.svg";
import BucketChicken from "../assets/bg/bucketchicken.svg";
import AccountSettingsTab from "../components/AccountSettingsTab.jsx";
import EyeOpen from "../assets/icons/eye.svg";
import EyeClosed from "../assets/icons/eye-closed.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const accounts = {
      "admin@funshots.com": { password: "admin123", role: "admin" },
      "staff@funshots.com": { password: "staff123", role: "staff" },
    };

    const account = accounts[email.toLowerCase()];

    if (account && account.password === password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("email", email);
      localStorage.setItem("role", account.role);
      navigate("/");
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

 useEffect(() => {
    const checkAndUpdate = () => {
      if (emailRef.current) {
        const val = emailRef.current.value || "";
        if (val && val !== email) setEmail(val);
      }
      if (passwordRef.current) {
        const val = passwordRef.current.value || "";
        if (val && val !== password) setPassword(val);
      }
    };

    checkAndUpdate();
    const t1 = setTimeout(checkAndUpdate, 200);
    const t2 = setTimeout(checkAndUpdate, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []); 

  return (
    <>
      <div className="relative w-full min-h-screen bg-[#F10F10] flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <div className="bg-[#d50000]/50 w-full sm:w-[1000px] max-w-7xl min-h-[440px] sm:min-h-[500px] rounded-[16px] shadow-lg flex flex-col md:flex-row items-center justify-between p-6 md:p-10 relative">
          {/* Logo */}
          <img
            src={FunshotsName}
            alt="Funshots"
            className="absolute w-[260px] sm:w-[380px] top-[-60px] left-4 sm:left-6 z-20"
          />

          {/* Bucket image */}
          <img
            src={BucketChicken}
            alt="Chicken Bucket"
            className="absolute w-[220px] sm:w-[360px] left-[-10px] top-[40px] pointer-events-none opacity-80"
          />

          {/* Form */}
          <div className="flex-1 ml-auto flex flex-col justify-center items-center md:items-start z-20 max-w-sm w-full">
            <h1 className="text-2xl sm:text-4xl font-bold text-white text-center md:text-left mt-6">
              Hi, Welcome Back
            </h1>

            <p className="text-yellow-200 text-sm sm:text-base mt-2 mb-6 text-center md:text-left">
              Sign in to your FunShots account
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-5">
{/* Email */}
<div className="relative">
  <input
    id="email"
    ref={emailRef}
    type="email"
    required
    autoComplete="email"
    className="peer w-full bg-[#F10F10]/30 rounded-[12px] px-4 pt-5 pb-2 text-white text-sm focus:ring-0 focus:outline-none placeholder-transparent
      autofill:bg-[#F10F10]/30 autofill:text-white"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email Address"
  />
  <label
    htmlFor="email"
    className="absolute left-4 top-1 text-xs sm:text-sm text-yellow-300"
  >
    Email Address
  </label>
</div>

{/* Password */}
<div className="relative">
  <input
    id="password"
    ref={passwordRef}
    type={showPassword ? "text" : "password"}
    required
    autoComplete="current-password"
    className="peer w-full bg-[#F10F10]/30 rounded-[12px] px-4 pt-5 pb-2 pr-10 text-white text-sm focus:ring-0 focus:outline-none placeholder-transparent
      autofill:bg-[#F10F10]/30 autofill:text-white"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
  />
  <label
    htmlFor="password"
    className="absolute left-4 top-1 text-xs sm:text-sm text-yellow-300"
  >
    Password
  </label>

  <button
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-yellow-300"
    onClick={() => setShowPassword(!showPassword)}
  >
    <img src={showPassword ? EyeClosed : EyeOpen} className="w-5 h-5" />
  </button>
</div>

              {/* Forgot Password */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-yellow-300 hover:text-yellow-200 text-xs sm:text-sm font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full max-w-[300px] py-3 bg-[#E9DEDA] text-[#900B09] rounded-2xl font-bold border border-[#F10F10] hover:bg-[#F10F10] hover:text-white transition"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <AccountSettingsTab
          mode="forgot-password"
          onClose={() => setShowForgotPassword(false)}
          user={{ email: email || "admin@funshots.com" }}
        />
      )}
    </>
  );
}
