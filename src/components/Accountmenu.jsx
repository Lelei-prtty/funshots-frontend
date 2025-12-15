import { useState } from "react";
import CloseIcon from "../assets/icons/exit button.svg";
import ProfileIcon from "../assets/icons/profile icon.svg";
import AccountSettingsTab from "../components/AccountSettingsTab.jsx";

export default function AccountMenu({ user, onClose, open }) {
  const [activeTab, setActiveTab] = useState(null);

  const userRole = localStorage.getItem("role") || "admin";
  const isStaff = userRole === "staff";

  const baseBtn = "w-full h-[50px] rounded-[20px] font-poppins font-semibold transition-all duration-200 border";

  const inactiveBtn = `${baseBtn} bg-yellow-400 text-white border-yellow-400 hover:bg-transparent hover:text-red-500 hover:border-red-500`;
  const activeBtn = `${baseBtn} bg-transparent text-red-500 border-red-500`;

  if (!open) return null;

  if (activeTab) {
    return (
      <AccountSettingsTab
        initialTab={activeTab}
        onClose={onClose}
        user={user}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/30 backdrop-blur-sm px-4 overflow-auto">
      <div className="relative w-full max-w-[1126px] bg-[#F10F10] rounded-2xl shadow-lg pb-10">
        <div className="absolute top-4 left-6">
          <h1 className="font-poppins font-bold text-xl sm:text-[32px] text-white">Profile</h1>
        </div>

        <div className="mt-20 mx-4 sm:mx-6 bg-white rounded-[15px] p-6 shadow-md flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <img
            src={user?.profile || ProfileIcon}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-white/40"
            alt="Profile"
          />
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-[#EDBE0C] text-2xl font-bold">{isStaff ? "Staff" : "Admin"}</h2>
            <p className="text-[#EDBE0C] text-sm break-all">{user?.email}</p>

            <div className="mt-4 space-y-3 max-w-[320px]">
              <button onClick={() => setActiveTab("edit-information")} className={inactiveBtn}>Edit Information</button>
              <button onClick={() => setActiveTab("change-password")} className={inactiveBtn}>Change Password</button>
              <button onClick={() => setActiveTab("login-activity")} className={inactiveBtn}>Login Activity</button>
              {!isStaff && <button onClick={() => setActiveTab("user-management")} className={inactiveBtn}>User Management</button>}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-6 bg-yellow-400 text-white rounded-[20px] h-[48px] w-[130px] font-poppins flex items-center justify-center gap-2 hover:bg-transparent hover:text-red-500 hover:border-red-500 hover:border-2"
        >
          <img src={CloseIcon} className="w-6 h-6 brightness-0 invert" /> Close
        </button>
      </div>
    </div>
  );
}