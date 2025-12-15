import { useState, useEffect } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import NotificationPopup from "../components/NotificationPopup"
import Accountmenu from "../components/Accountmenu"
import NotifIcon from "../assets/icons/notif.svg"
import AccountIcon from "../assets/icons/account.svg"
import PersonIcon from "../assets/icons/person.svg"
import LogoutIcon from "../assets/icons/logout.svg"
import Logo2 from "../assets/bg/logo2.svg"

export default function RootLayout() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [user] = useState({ email: "Admin@funshots.com" })

  const userRole = localStorage.getItem("role") || "admin"
  const userEmail = localStorage.getItem("email") || "Admin@funshots.com"
  const isStaff = userRole === "staff"

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("email")
    localStorage.removeItem("role")
    window.location.href = "/login"
  }

  useEffect(() => {
    if (isStaff && location.pathname === "/") {
      navigate("/pos", { replace: true })
    }
  }, [isStaff, location.pathname, navigate])

  // Helper for active nav link
  const navLinkClass = (path) =>
    `w-full py-3 rounded-lg text-center font-bold transition-colors shadow
    ${location.pathname === path ? "bg-white text-[#EDBE0C]" : "bg-[#EDBE0C] text-white hover:bg-yellow-400"}`

  return (
    <>
      <div className="h-screen flex bg-[#F10F10] overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col items-center w-[260px] h-screen fixed left-0 top-0 bg-[#F10F10] py-6 px-2 z-30">
          <img src={Logo2 || "/placeholder.svg"} alt="Funshots Logo" className="w-32 h-auto mb-8" />
          <nav className="flex flex-col gap-4 w-full">
            {!isStaff && (
              <>
                <Link to="/" className={navLinkClass("/")}>
                  DASHBOARD
                </Link>
                <Link to="/inventory" className={navLinkClass("/inventory")}>
                  INVENTORY
                </Link>
              </>
            )}
            <Link to="/pos" className={navLinkClass("/pos")}>
              POINT OF SALES
            </Link>
            {!isStaff && (
              <Link to="/history" className={navLinkClass("/history")}>
                HISTORY
              </Link>
            )}
          </nav>
          <div className="flex-1" />
          <div className="w-full mt-8 px-2">
            <div className="border-t-2 border-[#EDBE0C] mb-1" />
            <div className="text-center text-[#EDBE0C] font-bold text-xs tracking-widest">
              FUNSHOTS {isStaff ? "STAFF" : "ADMIN"}
            </div>
            <div className="border-t-2 border-[#EDBE0C] mb-2" />
          </div>
        </aside>

        {/* Mobile Topbar */}
        <aside className="md:hidden w-full fixed top-0 left-0 z-40 flex flex-row items-center bg-[#F10F10] px-2 py-2">
          <img src={Logo2 || "/placeholder.svg"} alt="Funshots Logo" className="w-16 sm:w-20 h-auto mr-2" />
          <nav className="flex flex-1 gap-1 overflow-x-auto no-scrollbar">
            {!isStaff && (
              <>
                <Link to="/" className={navLinkClass("/") + " text-[10px] sm:text-xs px-2 py-1 whitespace-nowrap"}>
                  DASH
                </Link>
                <Link
                  to="/inventory"
                  className={navLinkClass("/inventory") + " text-[10px] sm:text-xs px-2 py-1 whitespace-nowrap"}
                >
                  INV
                </Link>
              </>
            )}
            <Link to="/pos" className={navLinkClass("/pos") + " text-[10px] sm:text-xs px-2 py-1 whitespace-nowrap"}>
              POS
            </Link>
            {!isStaff && (
              <Link
                to="/history"
                className={navLinkClass("/history") + " text-[10px] sm:text-xs px-2 py-1 whitespace-nowrap"}
              >
                HIST
              </Link>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen bg-gray-100 md:ml-[260px]">
          {/* Header */}
          <header className="w-[95%] max-w-[1137px] mx-auto mt-4 sm:mt-6 mb-3 sm:mb-4 min-h-[54px] sm:h-[62px] bg-[#F10F10] rounded-[60px] flex items-center justify-between px-4 sm:px-6 shadow-md z-20">
            <h1 className="text-[#EDBE0C] font-bold text-base sm:text-xl tracking-wide">
              WELCOME BACK, {isStaff ? "STAFF" : "ADMIN"}
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={() => setShowNotifications(true)} className="p-2 hover:scale-110 transition-transform">
                <img src={NotifIcon || "/placeholder.svg"} alt="Notifications" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button onClick={() => setShowAccount(true)} className="p-2 hover:scale-110 transition-transform">
                <img src={AccountIcon || "/placeholder.svg"} alt="Account" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#EABB12] hover:bg-[#EABB12] px-3 sm:px-4 py-2 rounded-full transition-colors"
              >
                <img src={PersonIcon || "/placeholder.svg"} alt="Profile" className="w-5 h-5 sm:w-6 sm:h-6" />
                <img src={LogoutIcon || "/placeholder.svg"} alt="Logout" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Notification Popup */}
      {showNotifications && <NotificationPopup onClose={() => setShowNotifications(false)} />}

      {/* Account Menu */}
      {showAccount && <Accountmenu user={user} open={showAccount} onClose={() => setShowAccount(false)} />}
    </>
  )
}
