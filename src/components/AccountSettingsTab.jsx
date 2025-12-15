import React, { useState } from "react";
import CloseIcon from "../assets/icons/exit button.svg";
import ProfileIcon from "../assets/icons/profile icon.svg";
import EditIcon from "../assets/icons/EditProfile.svg";
import PasswordIcon from "../assets/icons/password.svg";
import UserCogIcon from "../assets/icons/user-cog.svg";
import LoginIcon from "../assets/icons/log-in.svg";
import EyeOpenIcon from "../assets/icons/eye.svg";
import EyeClosedIcon from "../assets/icons/eye-closed.svg";
import SuccessToast from "../components/SuccessToast.jsx";

export default function AccountSettingsTab({ onClose, user = {}, initialTab = "edit-information", mode = "normal" }) {
  const storedRole = localStorage.getItem("role") || "admin";
  const isAdmin = storedRole === "admin";
  const isStaff = storedRole === "staff";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isChangingTab, setIsChangingTab] = useState(false);

  // Toast
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSubMessage, setToastSubMessage] = useState("");
  const showToast = (msg, sub) => { setToastMessage(msg); setToastSubMessage(sub); setShowSuccessToast(true); };
  const closeToast = () => setShowSuccessToast(false);

  const handleTabChange = (tab) => {
    if (isStaff && !["edit-information", "change-password", "login-activity"].includes(tab)) return;
    if (isChangingTab) return;
    setIsChangingTab(true);
    setActiveTab(tab);
    setTimeout(() => setIsChangingTab(false), 250);
  };

  // Edit info form
  const [form, setForm] = useState({
    profile: user?.profile || "",
    name: user?.name || "",
    email: user?.email || "",
    contact: user?.contact || "",
    role: "staff",
  });

  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const togglePassword = (field) => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));

  // Sample Login Activity
  const [loginActivity, setLoginActivity] = useState([
    { id: 1, email: "admin@funshots.com", role: "admin", date: "2025-09-08", time: "10:00 AM", device: "Windows - Chrome", ip: "192.168.1.10" },
    { id: 2, email: "staff1@funshots.com", role: "staff", date: "2025-09-07", time: "08:12 AM", device: "Android - Chrome", ip: "192.168.1.11" },
  ]);
  const filteredLoginActivity = isStaff ? loginActivity.filter(act => act.email === user?.email) : loginActivity;
  const [loginLogs, setLoginLogs] = useState(filteredLoginActivity.map(log => ({ ...log, status: "Active" })));

  const handleSignOut = (id) => {
    setLoginLogs(logs => logs.map(log => log.id === id ? { ...log, status: "Signed Out" } : log));
    const signedOutLog = loginLogs.find(log => log.id === id);
    showToast("Signed Out", `${signedOutLog?.email} has been signed out`);
  };

  // Users and activity logs
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Reyes", email: "alice@funshots.com", contact: "+63 912 345 6789", role: "staff", suspended: false },
    { id: 2, name: "Ben Cruz", email: "ben@funshots.com", contact: "+63 912 555 1234", role: "staff", suspended: false },
  ]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Input styles
  const inputClass =
    "w-full p-3 rounded-lg  bg-red-400 text-white placeholder-white shadow-inner outline-none focus:ring-2 focus:ring-yellow-400 transition";
  const dropdownClass =
    "w-full p-3 rounded-lg  bg-red-400 text-white shadow-inner outline-none focus:ring-2 focus:ring-yellow-400 transition";

  // User management functions
  const addUser = () => {
    if (!form.name || !form.email) { showToast("Required fields missing", "Please complete name and email"); return; }
    const newUser = { id: Date.now(), ...form, suspended: false };
    setUsers(u => [newUser, ...u]);
    setActivityLogs(logs => [
      { user: storedRole, action: "Added user", item: newUser.name, time: new Date().toLocaleString() },
      ...logs
    ]);
    setForm({ ...form, name: "", email: "", contact: "", role: "staff" });
    showToast("User Added", `${newUser.name} added successfully`);
  };

  const removeUser = (id) => {
    const removed = users.find(u => u.id === id);
    setUsers(u => u.filter(u => u.id !== id));
    setActivityLogs(logs => [
      { user: storedRole, action: "Deleted user", item: removed.name, time: new Date().toLocaleString() },
      ...logs
    ]);
    showToast("User Removed", "Account deleted from system");
  };

  const toggleSuspend = (id) => {
    setUsers(u => u.map(u => {
      if (u.id === id) {
        setActivityLogs(logs => [
          { user: storedRole, action: u.suspended ? "Unsuspended user" : "Suspended user", item: u.name, time: new Date().toLocaleString() },
          ...logs
        ]);
        return { ...u, suspended: !u.suspended };
      }
      return u;
    }));
    showToast("Status Updated", "Suspension state changed");
  };

  const editUser = (id) => {
    const u = users.find(user => user.id === id);
    if (!u) return;
    const newName = prompt("Enter new name", u.name) || u.name;
    const newEmail = prompt("Enter new email", u.email) || u.email;
    const newContact = prompt("Enter new contact", u.contact) || u.contact;
    const newRole = prompt("Enter role (staff/admin)", u.role) || u.role;
    setUsers(users.map(user => user.id === id ? { ...user, name: newName, email: newEmail, contact: newContact, role: newRole } : user));
    setActivityLogs(logs => [
      { user: storedRole, action: "Edited user", item: newName, time: new Date().toLocaleString() },
      ...logs
    ]);
    showToast("User Edited", `${newName} updated successfully`);
  };

  // Forgot password mode
  if (mode === "forgot-password") {
    const [resetEmail, setResetEmail] = useState(user?.email || "");
    const [errorMessage, setErrorMessage] = useState("");
    const existingAccounts = ["admin@funshots.com", "staff@funshots.com"];

    const validateAndSend = () => {
      setErrorMessage("");
      if (!resetEmail.trim()) { setErrorMessage("Please enter your email."); return; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(resetEmail)) { setErrorMessage("Please enter a valid email address."); return; }
      if (!existingAccounts.includes(resetEmail.toLowerCase())) { setErrorMessage("This email is not registered in the system."); return; }
      showToast("Reset Email Sent!", `A reset link was sent to ${resetEmail}`);
      setTimeout(() => onClose(), 1500);
    };

    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-[#F10F10] text-white rounded-2xl shadow-2xl p-6 w-full max-w-[380px] transform transition-all duration-300 animate-[fadeIn_0.3s_ease-out,scaleIn_0.3s_ease-out]">
            <h2 className="text-2xl font-bold text-center mb-2">Forgot Password?</h2>
            <p className="text-center text-yellow-200 text-sm mb-6">Enter your email to receive a password reset link.</p>
            <div className="mb-3">
              <label className="text-xs mb-1 block font-semibold text-yellow-200">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg  placeholder-white bg-red-400 text-white text-sm outline-none"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            {errorMessage && (<p className="text-yellow-300 text-xs mt-1 mb-2 text-center">{errorMessage}</p>)}
            <button onClick={validateAndSend} className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-300 transition">Send Reset Link</button>
            <button onClick={onClose} className="w-full mt-3 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition">Cancel</button>
          </div>
        </div>
        {showSuccessToast && <SuccessToast message={toastMessage} subMessage={toastSubMessage} onClose={closeToast} />}
      </>
    );
  }


  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/40 backdrop-blur-md px-4 overflow-auto">
        <div className="relative w-full max-w-[1100px] bg-[#F10F10] rounded-2xl shadow-2xl">

          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-6 bg-yellow-400 text-white rounded-[20px] h-[48px] w-[130px] flex items-center justify-center gap-2 hover:bg-transparent hover:text-red-500 hover:border-red-500 hover:border-2">
            <img src={CloseIcon} className="w-6 h-6 brightness-0 invert" /> Close
          </button>

          {/* Header */}
          <div className="absolute top-4 left-6 z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
          </div>

          <div className="relative w-full max-w-[1060px] mx-auto mt-20 mb-6 bg-white rounded-xl p-6 flex flex-col lg:flex-row gap-6">

            {/* LEFT TAB */}
            <div className="lg:w-[300px] space-y-4">
              <div className="flex items-center gap-4">
                <img src={form.profile || ProfileIcon} alt="profile" className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <h2 className="text-[#EDBE0C] font-bold text-2xl capitalize">{isAdmin ? "Admin" : "Staff"}</h2>
                  <p className="text-xs text-[#EDBE0C] font-semibold break-all">{form.email}</p>
                </div>
              </div>
              <TabButton title="Edit Information" active={activeTab==="edit-information"} onClick={()=>handleTabChange("edit-information")} />
              <TabButton title="Change Password" active={activeTab==="change-password"} onClick={()=>handleTabChange("change-password")} />
              <TabButton title="Login Activity" active={activeTab==="login-activity"} onClick={()=>handleTabChange("login-activity")} />
              {isAdmin && <TabButton title="User Management" active={activeTab==="user-management"} onClick={()=>handleTabChange("user-management")} />}
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1">
              {/* Edit Information */}
              {activeTab==="edit-information" && (
                <div className="bg-[#F10F10] rounded-xl p-6 text-white flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-6">
                    <img src={EditIcon} className="w-6 h-6 brightness-0 invert" />
                    <h3 className="text-xl font-bold">Edit Information</h3>
                  </div>
                  <Field label="Profile Picture">
                    <input type="file" accept="image/*" onChange={e => setForm({...form, profile: URL.createObjectURL(e.target.files[0])})} />
                  </Field>
                  <Field label="Name"><input className={inputClass} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
                  <Field label="Email"><input className={inputClass} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
                 <Field label="Contact Number">
                  <input
                  type="number"
                  className={inputClass}
                  value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })} placeholder=" +63"/>
                  </Field>
              <div className="flex gap-3 mt-6"><ConfirmBtn onClick={()=>showToast("Saved!","Information updated")} /><CancelBtn onClick={onClose} /></div>
                </div>
              )}

              {/* Change Password */}
              {activeTab==="change-password" && (
                <div className="bg-[#F10F10] rounded-xl p-6 text-white flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-6">
                    <img src={PasswordIcon} className="w-6 h-6 brightness-0 invert" />
                    <h3 className="text-xl font-bold">Change Password</h3>
                  </div>
                  {["current","new","confirm"].map(f=>{
                    const labels={current:"Current Password",new:"New Password",confirm:"Confirm Password"};
                    return (
                      <Field key={f} label={labels[f]}>
                        <div className="relative w-full max-w-[400px]">
                          <input type={showPassword[f]?"text":"password"} className={inputClass + " pr-10"} placeholder={labels[f]} />
                          <img src={showPassword[f]?EyeOpenIcon:EyeClosedIcon} alt="toggle" onClick={()=>togglePassword(f)} className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer" />
                        </div>
                      </Field>
                    );
                  })}
                  <div className="flex gap-3 mt-6"><ConfirmBtn onClick={()=>showToast("Password Updated","Password changed successfully")} /><CancelBtn onClick={onClose} /></div>
                </div>
              )}

              {/* Login Activity */}
              {activeTab==="login-activity" && (
                <div className="bg-[#F10F10] rounded-xl p-6 text-white">
                  <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <img src={LoginIcon} alt="" className="w-6 h-6 brightness-0 invert" />
                      <h3 className="text-xl font-bold">Login Activity</h3>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {loginLogs.map(log=>(<div key={log.id} className="bg-white/20 p-4 rounded flex flex-col justify-between">
                      <p className="font-semibold">{log.email}</p>
                      <p className="text-sm">{log.date} • {log.time}</p>
                      <p className="text-sm">{log.device}</p>
                      <p className="text-sm font-bold text-yellow-200">{log.status}</p>
                      {log.status==="Active" && <span onClick={()=>handleSignOut(log.id)} className="mt-2 text-white cursor-pointer hover:underline text-sm">Sign Out</span>}
                    </div>))}
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeTab === "user-management" && isAdmin && (
                <div className="bg-[#F10F10] rounded-xl p-6 text-white">

                  {/* Header */}
                  <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <img src={UserCogIcon} alt="" className="w-6 h-6 brightness-0 invert" />
                      <h3 className="text-xl font-bold">User Management</h3>
                    </div>
                  </div>

                  {/* Add User Form */}
                  <div className="bg-white/10 p-4 rounded mb-4">
                    <div className="grid sm:grid-cols-4 gap-3">
                      <input type="text" placeholder="Name" className={inputClass} value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
                      <input type="email" placeholder="Email" className={inputClass} value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
                      <input type="number" placeholder="Contact Number" className={inputClass} value={form.contact} onChange={(e)=>setForm({...form,contact:e.target.value})}/>
                      <select className={dropdownClass} value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button onClick={addUser} className="mt-3 bg-yellow-400 text-white px-4 py-2 rounded font-bold hover:bg-transparent hover:border-2 hover:border-red-500 hover:text-red-500">Add User</button>
                  </div>

                  {/* User List */}
                  <div className="space-y-3">
                    {users.map(u=>(<div key={u.id} className="bg-white/10 p-4 rounded flex justify-between items-center flex-wrap">
                      <div>
                        <p className="font-semibold">{u.name} {u.suspended && <span className="text-yellow-300 text-sm">(Suspended)</span>}</p>
                        <p className="opacity-80 text-sm">{u.email} • {u.contact} • role: {u.role}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                        <button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-transparent hover:text-white hover:border-white/40 hover:border-2" onClick={()=>toggleSuspend(u.id)}>{u.suspended?"Unsuspend":"Suspend"}</button>
                        <button className="px-3 py-2 border border-white/40 rounded hover:bg-red-500 hover:text-white hover:border-white/40 hover:border-2" onClick={()=>removeUser(u.id)}>Delete</button>
                        <button className="px-3 py-2 border border-white/40 rounded hover:bg-red-500 hover:text-white hover:border-white/40 hover:border-2" onClick={()=>editUser(u.id)}>Edit</button>
                      </div>
                    </div>))}
                  </div>

                  {/* User Activity Logs */}
                  <div className="mt-6 bg-white/10 p-4 rounded">
                    <h4 className="font-bold mb-2">User Activity Logs</h4>
                    {activityLogs.length === 0 ? (<p className="text-sm opacity-70">No activity recorded.</p>) : (
                      <ul className="space-y-1 text-sm">
                        {activityLogs.map((log, idx)=>(<li key={idx}><span className="font-semibold">{log.user}</span>: {log.action} on <span className="italic">{log.item}</span> at {log.time}</li>))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      {showSuccessToast && <SuccessToast message={toastMessage} subMessage={toastSubMessage} onClose={closeToast} />}
    </>
  );
}

// Tab button
function TabButton({ title, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full h-[55px] flex items-center justify-center rounded-xl font-poppins text-[16px] transition-all duration-200 ${active ? "bg-transparent border-2 border-red-500 text-red-500" : "bg-yellow-400 text-white border-yellow-400 hover:bg-transparent hover:text-red-500 hover:border-red-500"}`}>{title}</button>
  );
}

// Field and buttons
function Field({ label, children }) { return (<div className="flex flex-col mb-4 w-full max-w-[400px]"><label className="text-xs mb-1 font-poppins">{label}</label>{children}</div>); }
function ConfirmBtn({ onClick }) { return (<button onClick={onClick} className="px-6 py-2 bg-yellow-400 text-white rounded-xl font-poppins hover:bg-transparent hover:border-2 hover:border-red-500 hover:text-red-500">Confirm</button>); }
function CancelBtn({ onClick }) { return (<button onClick={onClick} className="px-6 py-2 bg-red-500 text-white rounded-xl font-poppins hover:bg-transparent hover:border-2 hover:border-red-500 hover:text-red-500">Cancel</button>); }
