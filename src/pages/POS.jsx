import { useState, useEffect } from "react"
import AddIcon from "../assets/icons/add.svg"
import Peso from "../assets/icons/peso.svg"
import Bag from "../assets/icons/BagIcon.svg"
import Month from "../assets/icons/ArUpIcon.svg"
import AddInformPOS from "../components/AddinformPOS"
import StaffPOSForm from "../components/StaffPOSform"
import ProfitIcon from "../assets/icons/income.svg"

export default function POS() {
  const [activeTab, setActiveTab] = useState("profit")
  const [showModal, setShowModal] = useState(false)
  const [isProfit, setIsProfit] = useState(false)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [salesData, setSalesData] = useState([])
  const [monthFilter, setMonthFilter] = useState("All")
  const [weekFilter, setWeekFilter] = useState("All") // Week 1-4 for weekly tab
  const [showDeliveryOnly, setShowDeliveryOnly] = useState(false)

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setDate(now.toLocaleDateString())
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }
    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load sales data from localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("salesData") || "[]")
    const normalized = storedData.map((s) => normalizeEntry(s))
    setSalesData(normalized)
  }, [])

  const persistSalesToStorage = (arr) => {
    localStorage.setItem("salesData", JSON.stringify(arr))
  }

  const normalizeEntry = (entry) => {
    const e = { ...entry }

    // parse amount if string like "₱1,000"
    if (e.amount != null && typeof e.amount === "string") {
      const parsed = Number(String(e.amount).replace(/[^\d.-]/g, ""))
      e.amount = Number.isNaN(parsed) ? 0 : parsed
    } else {
      e.amount = Number(e.amount || 0)
    }

    e.sales = Number(e.sales || 0)

    // discount normalization
    e.discounted = Boolean(e.discounted)
    e.discountValue = Number(e.discountValue || 0)

    // subtotal: if unitPrice present compute unitPrice * sales, otherwise fallback to amount
    const unitPrice = e.unitPrice != null ? Number(String(e.unitPrice).replace(/[^\d.-]/g, "")) : null
    e.subtotal = unitPrice != null && !Number.isNaN(unitPrice) ? unitPrice * e.sales : Number(e.amount || 0)

    // interpret discountValue: treat <=100 as percent, >100 as absolute
    if (e.discounted && e.discountValue) {
      const dv = e.discountValue
      if (dv > 0 && dv <= 100) {
        e.discountAmount = (e.subtotal * dv) / 100
      } else {
        e.discountAmount = dv
      }
    } else {
      e.discountAmount = 0
    }

    e.total = Number((e.subtotal - e.discountAmount).toFixed(2))

    if (!e.date) {
      e.date = new Date().toISOString()
    } else {
      const parsed = tryParseDateToISO(e.date)
      if (parsed) e.date = parsed
    }

    if (!e.time) e.time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const role = localStorage.getItem("role") || "admin"
    e.user = e.user || role

    e.delivery = Boolean(e.delivery)

    e.capital = Number(e.capital || 0)
    e.salary = Number(e.salary || 0)
    e.rent = Number(e.rent || 0)

    return e
  }

  const tryParseDateToISO = (dateStr) => {
    try {
      const d = new Date(dateStr)
      if (d.toString() !== "Invalid Date") return d.toISOString()
      const parts = dateStr.split(/[\/\-\.]/)
      if (parts.length === 3) {
        let [m, dpart, y] = parts
        if (y.length === 2) y = "20" + y
        const iso = new Date(`${y}-${m.padStart(2, "0")}-${dpart.padStart(2, "0")}`)
        if (iso.toString() !== "Invalid Date") return iso.toISOString()
      }
    } catch (e) {}
    return null
  }

  const saveSalesData = (newEntry) => {
    const normalized = normalizeEntry(newEntry)
    const updatedData = [...salesData, normalized]
    setSalesData(updatedData)
    persistSalesToStorage(updatedData)
  }

  const userRole = localStorage.getItem("role") || "admin"
  const isStaff = userRole === "staff"

  const handleUpdateClick = () => {
    setIsProfit(false)
    setShowModal(true)
  }

  // Helpers
  function monthIndexFromName(name) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const idx = months.findIndex((m) => m.toLowerCase() === name.toLowerCase())
    return idx >= 0 ? idx : -1
  }

  function getWeekOfMonth(dateObj) {
    // week 1 => day 1-7, week2 => 8-14, 3 =>15-21, 4 => 22+
    const day = dateObj.getDate()
    if (day <= 7) return "Week 1"
    if (day <= 14) return "Week 2"
    if (day <= 21) return "Week 3"
    return "Week 4"
  }

  // Filtering:
  const filteredSales = salesData
    .filter((item) => {
      const name = (item.flavorName || item.product || item.productName || "").toString().toLowerCase()
      return name.includes(searchTerm.toLowerCase())
    })
    .filter((item) => {
      if (showDeliveryOnly) return item.delivery === true
      return true
    })
    .filter((item) => {
      // apply month filter only when activeTab is monthly
      if (activeTab === "monthly") {
        if (monthFilter === "All") return true
        const dateObj = new Date(item.date)
        if (dateObj.toString() === "Invalid Date") {
          const iso = tryParseDateToISO(item.date)
          if (!iso) return false
          const d2 = new Date(iso)
          return d2.getMonth() === monthIndexFromName(monthFilter)
        }
        return dateObj.getMonth() === monthIndexFromName(monthFilter)
      }

      // apply week filter only when activeTab is weekly
      if (activeTab === "weekly") {
        if (weekFilter === "All") return true
        const dateObj = new Date(item.date)
        if (dateObj.toString() === "Invalid Date") {
          const iso = tryParseDateToISO(item.date)
          if (!iso) return false
          const d2 = new Date(iso)
          return getWeekOfMonth(d2) === weekFilter
        }
        return getWeekOfMonth(dateObj) === weekFilter
      }

      // daily: no month/week filter
      return true
    })

  // summary totals for current filteredSales (used for daily right-side display and weekly/monthly single-line)
  const summary = filteredSales.reduce(
    (acc, cur) => {
      acc.totalOrders += Number(cur.sales || 0)
      acc.subtotal += Number(cur.subtotal || 0)
      acc.totalAmount += Number(cur.total || 0)
      if (cur.discounted) acc.discountedCount += 1
      if (cur.delivery) acc.deliveryCount += 1
      return acc
    },
    { totalOrders: 0, subtotal: 0, totalAmount: 0, discountedCount: 0, deliveryCount: 0 }
  )

  if (isStaff) {
    return (
      <div className="p-3 sm:p-5 w-full flex flex-col items-center min-h-screen overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-[1041px] mb-4">
          <div>
            <h2 className="text-[#0C1208] font-poppins font-bold text-2xl sm:text-3xl">Sales Invoice</h2>
            <p className="text-[#CF3847] font-poppins text-base sm:text-lg">Record your customer's Order</p>
          </div>
        </div>
        <StaffPOSForm date={date} time={time} onSave={(entry) => saveSalesData(entry)} />
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-5 w-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-[1041px] mb-8 gap-4 sm:gap-6">
        <div>
          <h2 className="text-[#0C1208] font-poppins font-bold text-2xl sm:text-3xl">Sales Tracking</h2>
          <p className="text-[#CF3847] font-poppins text-base sm:text-lg">Track your restaurant's Sales and Income</p>
        </div>

        {/* Search and Update */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-[180px] sm:w-[250px] h-[48px] bg-[#EABB12] text-white placeholder-white/70 rounded-[30px] px-5 pr-10 font-poppins text-[16px] outline-none focus:ring-2 focus:ring-[#cf9d00]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-[15px] top-[12px] w-5 h-5 text-white pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>

          <button
            onClick={handleUpdateClick}
            className="flex items-center gap-2 bg-[#EABB12] hover:bg-[#d4a610] text-white font-poppins text-sm sm:text-[16px] rounded-[30px] px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm transition"
          >
            <span>Update</span>
            <img src={AddIcon || "/placeholder.svg"} alt="Add icon" className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 w-full max-w-[1041px]">
        {["profit", "daily", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-[20px] font-poppins text-sm sm:text-base transition-all duration-200 ${
              activeTab === tab ? "bg-[#F10F10] text-white" : "bg-[#E5E5E5] text-[#000000] hover:bg-[#D5D5D5]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profit Tab */}
      {activeTab === "profit" && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl border bg-white border-[#DFDFDF] rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex justify-center items-center w-[50px] h-[50px] bg-[rgba(241,15,16,0.08)] rounded-[20px]">
                <img src={ProfitIcon} alt="Icon" className="w-12 h-12 sm:w-16 sm:h-16 object-contain opacity-90" />
              </div>
              <h3 className="text-[#CF3847] font-poppins font-bold text-2xl">Income Overview</h3>
            </div>

            <div className="grid grid-cols-5 text-center font-poppins text-[#F10F10] border-b border-gray-300 pb-2 mb-4">
              <p>Capital</p>
              <p>Salary</p>
              <p>Rent</p>
              <p>Total Sales</p>
              <p>Profit</p>
            </div>
            <div className="grid grid-cols-5 text-center font-poppins text-sm sm:text-base border-b border-gray-100 py-3">
              <p>₱{salesData.reduce((sum, i) => sum + Number(i.capital || 0), 0)}</p>
              <p>₱{salesData.reduce((sum, i) => sum + Number(i.salary || 0), 0)}</p>
              <p>₱{salesData.reduce((sum, i) => sum + Number(i.rent || 0), 0)}</p>
              <p>₱{salesData.reduce((sum, i) => sum + Number(i.total || i.amount || 0), 0)}</p>
              <p className="text-[#22BB22] font-semibold">
                ₱
                {salesData.reduce((sum, i) => sum + Number(i.total || i.amount || 0), 0) -
                  (salesData.reduce((sum, i) => sum + Number(i.capital || 0), 0) +
                    salesData.reduce((sum, i) => sum + Number(i.salary || 0), 0) +
                    salesData.reduce((sum, i) => sum + Number(i.rent || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sales Tables */}
      {["daily", "weekly", "monthly"].includes(activeTab) && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1084px] bg-white border border-[#DFDFDF] rounded-[15px] shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex justify-center items-center w-[50px] h-[50px] bg-[rgba(241,15,16,0.08)] rounded-[20px]">
                <img
                  src={activeTab === "daily" ? Peso : activeTab === "weekly" ? Bag : Month}
                  alt="Icon"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain opacity-90"
                />
              </div>

              {/* Title + Filters */}
              <div className="flex-1 flex items-center justify-between">
                <h2 className="text-[#CF3847] font-poppins font-bold text-xl sm:text-2xl capitalize">{activeTab} Sales</h2>

                <div className="flex items-center gap-3">
                  {activeTab === "monthly" && (
                    <>
                      <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="h-[40px] rounded-md px-3 font-poppins"
                      >
                        <option>All</option>
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                      </select>

                      <label className="flex items-center gap-2 font-poppins text-sm">
                        <input
                          type="checkbox"
                          checked={showDeliveryOnly}
                          onChange={(e) => setShowDeliveryOnly(e.target.checked)}
                          className="w-4 h-4"
                        />
                        Delivery only
                      </label>
                    </>
                  )}

                  {activeTab === "weekly" && (
                    <>
                      <select
                        value={weekFilter}
                        onChange={(e) => setWeekFilter(e.target.value)}
                        className="h-[40px] rounded-md px-3 font-poppins"
                      >
                        <option>All</option>
                        <option>Week 1</option>
                        <option>Week 2</option>
                        <option>Week 3</option>
                        <option>Week 4</option>
                      </select>
                      <label className="flex items-center gap-2 font-poppins text-sm">
                        <input
                          type="checkbox"
                          checked={showDeliveryOnly}
                          onChange={(e) => setShowDeliveryOnly(e.target.checked)}
                          className="w-4 h-4"
                        />
                        Delivery only
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2 sm:gap-4 text-xs sm:text-[15px] font-poppins font-medium text-[#F10F10] border-b border-[#8A8A8A] pb-2">
              <p>Product Name</p>
              <p>Category</p>
              <p>Beginning</p>
              <p>Sales</p>
              <p>Amount</p>
              <p>Ending</p>
              <p>Date</p>
              <p>Time</p>
              <p>User</p>
              <p>Total</p>
            </div>

            {filteredSales.map((item, idx) => (
              <div key={idx} className="grid grid-cols-10 gap-2 sm:gap-4 items-center py-3 text-xs sm:text-[15px] font-poppins border-b border-[#EAEAEA]">
                <p className="text-[#000000]">{item.flavorName || item.product || item.productName}</p>
                <p className="text-[#000000]">{item.category}</p>
                <p className="text-[#000000]">{item.beginning}</p>
                <p className="text-[#000000]">{item.sales}</p>

                <p className="text-[#000000]">
                  ₱{Number(item.amount || item.subtotal || 0).toFixed(2)}
                </p>

                <p className="text-[#000000]">{item.ending}</p>

                <div className="flex flex-col">
                  <p className="text-[#000000] text-xs sm:text-[14px]">{formatDateReadable(item.date)}</p>
                </div>

                <p className="text-[#000000] text-xs sm:text-[14px]">{item.time}</p>

                <p className="text-[#000000] text-xs sm:text-[14px]">{item.user}</p>

                <p className="text-[#000000] flex items-center gap-1">
                  <span className="text-[#F10F10]">₱</span>{Number(item.total || 0).toFixed(2)}
                  {item.discounted && <span className="ml-2 text-xs text-gray-500">(discounted)</span>}
                </p>
              </div>
            ))}

            {/* For daily: add heading line above the totals and keep totals displayed on the right side */}
            {activeTab === "daily" && (
              <div className="mt-4 flex justify-end">
                <div className="text-right font-poppins text-sm">
                  <div>Total orders: <span className="font-bold">{summary.totalOrders}</span></div>
                  <div>Subtotal: <span className="font-bold">₱{Number(summary.subtotal).toFixed(2)}</span></div>
                  <div className="text-right font-semibold font-poppins">Total Summary: <span className="font-bold">₱{Number(summary.totalAmount).toFixed(2)}</span></div>
                </div>
              </div>
            )}

            {/* For weekly: show single right-aligned line "Weekly sale: ₱..." */}
            {activeTab === "weekly" && (
              <div className="mt-4 flex justify-end">
                <div className="text-right font-semibold font-poppins">
                  Weekly sale: <span className="font-bold">₱{Number(summary.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* For monthly: show single right-aligned line "Monthly sales: ₱..." */}
            {activeTab === "monthly" && (
              <div className="mt-4 flex justify-end">
                <div className="text-right font-semibold font-poppins">
                  Monthly sales: <span className="font-bold">₱{Number(summary.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <AddInformPOS
        show={showModal}
        onClose={() => setShowModal(false)}
        isProfit={isProfit}
        category=""
        showSalesSection={true}
        onSave={(entry) => {
          saveSalesData(entry)
          setShowModal(false)
        }}
      />
    </div>
  )

  function formatDateReadable(dateStr) {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    if (d.toString() !== "Invalid Date") return d.toLocaleDateString()
    const iso = tryParseDateToISO(dateStr)
    if (iso) return new Date(iso).toLocaleDateString()
    return dateStr
  }
}
