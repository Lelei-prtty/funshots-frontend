import { useState, useEffect, useContext } from "react"
import Modal from "../components/Modal.jsx"
import SuccessToast from "../components/SuccessToast.jsx"
import Save from "../assets/icons/save.svg"
import Close from "../assets/icons/exit button.svg"
import { POSContext } from "../context/POSContext"

export default function AddInformPOS({
  show,
  onClose,
  isProfit = false,
  category = "",
  showSalesSection = false,
  onOrderAdded,
}) {
  const posContext = useContext(POSContext)
  const [showToast, setShowToast] = useState(false)
  const [isProfitMode, setIsProfitMode] = useState(isProfit)

  const [formData, setFormData] = useState({
    category: category || "",
    flavorName: "",
    beginning: "",
    sales: "",
    ending: "",
    amount: "",
    threshold: "",
    date: "",
    time: "",
    capital: "",
    salary: "",
    rent: "",
    total: "",
    expenses: "",
    debt: "",
    cashAdvance: "",
    cash: "",
    gcash: "",
    totalSales: "",
    totalProfit: "",
    menuAvailable: true,
    beveragesAvailable: true,
  })

  // Auto calculate ending stock for staff mode
  useEffect(() => {
    if (!isProfitMode) {
      const beginning = Number(formData.beginning) || 0
      const sales = Number(formData.sales) || 0
      setFormData((prev) => ({
        ...prev,
        ending: Math.max(0, beginning - sales).toString(),
      }))
    }
  }, [formData.beginning, formData.sales, isProfitMode])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isProfitMode) {
      const newOrder = {
        id: Date.now(),
        category: formData.category,
        flavorName: formData.flavorName,
        beginning: Number(formData.beginning) || 0,
        sales: Number(formData.sales) || 0,
        ending: Number(formData.ending) || 0,
        amount: Number(formData.amount) || 0,
        date: formData.date,
        time: formData.time,
        menuAvailable: formData.menuAvailable,
        beveragesAvailable: formData.beveragesAvailable,
      }

      posContext?.addStaffOrder?.(newOrder)
      onOrderAdded?.(newOrder)
    } else {
      const salesData = {
        id: Date.now(),
        capital: Number(formData.capital) || 0,
        salary: Number(formData.salary) || 0,
        rent: Number(formData.rent) || 0,
        totalSales: Number(formData.totalSales) || 0,
        date: formData.date,
        time: formData.time,
      }

      posContext?.addAdminSalesData?.(salesData)
    }

    setShowToast(true)

    const now = new Date()
    setFormData({
      category: category || "",
      flavorName: "",
      beginning: "",
      sales: "",
      ending: "",
      amount: "",
      threshold: "",
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      capital: "",
      salary: "",
      rent: "",
      total: "",
      expenses: "",
      debt: "",
      cashAdvance: "",
      cash: "",
      gcash: "",
      totalSales: "",
      totalProfit: "",
      menuAvailable: true,
      beveragesAvailable: true,
    })
  }

  const handleToastClose = () => {
    setShowToast(false)
    onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const inputClass =
    "w-full h-10 border border-[#979797] rounded-[20px] px-3 text-sm text-[#000000] placeholder-[#979797] focus:outline-none bg-white"
  const readOnlyInputClass =
    "w-full h-10 border border-[#979797] rounded-[20px] px-3 text-sm text-[#000000] bg-[#f5f5f5] cursor-not-allowed"

  const productOptions = {
    Menu: [
      "Funshots - Original",
      "Funshots - Buffalo",
      "Funshots - Teriyaki",
      "Funshots - Honey Butter",
      "Funshots - Soy Garlic",
      "Funshots - Sweet Chili",
      "Funshots - Korean BBQ",
      "Funshots - Lemon Glaze",
      "Funshots - Mango Habanero",
      "Pastil - Chicken Fillet",
      "Spam Musubi",
      "Shanghai",
      "Spicy Wings",
    ],
    Beverages: ["Water", "Juice", "Mango Cheesecake", "Oreo Cheesecake"],
  }

  // Calculate total sale and total profit dynamically
  const discountFromStaffOrders =
    posContext?.staffOrders?.reduce((sum, order) => sum + Number(order.discountedAmount || 0), 0) || 0
  const totalSale =
    (Number(formData.total) || 0) -
    (Number(formData.expenses) || 0) -
    (Number(formData.debt) || 0) -
    (Number(formData.cashAdvance) || 0) -
    discountFromStaffOrders
  const totalProfit = (Number(formData.cash) || 0) + (Number(formData.gcash) || 0)

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <div className="relative bg-white w-full max-w-[982px] rounded-[20px] mx-auto flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b-[3px] border-[#E7EBEA] px-6 py-4 sticky top-0 bg-white z-10">
            <h2 className="text-[#000000] font-bold text-xl">Update POS</h2>
            <button onClick={onClose} className="hover:opacity-70 transition">
              <img src={Close || "/placeholder.svg"} alt="Close" className="w-7 h-7" />
            </button>
          </div>

          <form id="add-inform-pos-form" onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => setIsProfitMode(!isProfitMode)}
                className={`px-4 py-1.5 rounded-[20px] font-semibold text-sm transition ${
                  isProfitMode ? "bg-[#c80d0d] text-white" : "bg-[#EABB12] text-white hover:bg-[#cf9d00]"
                }`}
              >
                {isProfitMode ? "Switch to Sales Inputs" : "Go to Profit Inputs"}
              </button>
            </div>

            {!isProfitMode ? (
              <>
                {/* Sales / Staff Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border border-[#979797] rounded-[20px] px-4 py-4">
                    <h3 className="text-[#000000] font-bold text-base mb-4">Product Availability</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.menuAvailable}
                          onChange={(e) => handleInputChange("menuAvailable", e.target.checked)}
                          className="w-5 h-5 cursor-pointer accent-[#F10F10]"
                        />
                        <span className="font-semibold text-sm text-[#000000]">Menu Available</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.beveragesAvailable}
                          onChange={(e) => handleInputChange("beveragesAvailable", e.target.checked)}
                          className="w-5 h-5 cursor-pointer accent-[#F10F10]"
                        />
                        <span className="font-semibold text-sm text-[#000000]">Beverages Available</span>
                      </label>
                    </div>
                  </div>

                  <div className="border border-[#979797] rounded-[20px] px-4 py-4">
                    <h3 className="text-[#000000] font-bold text-base mb-2">Category</h3>
                    <div className="flex flex-wrap gap-4">
                      {["Menu", "Beverages"].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={formData.category === cat}
                            onChange={(e) => handleInputChange("category", e.target.value)}
                            className="sr-only"
                          />
                          <span
                            className={`w-5 h-5 rounded-full ${
                              formData.category === cat ? "bg-[#F10F10]" : "bg-gray-300"
                            }`}
                          ></span>
                          <span className="text-sm font-bold">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm text-[#000000]">Product Name</label>
                    <select
                      value={formData.flavorName}
                      onChange={(e) => handleInputChange("flavorName", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select Product</option>
                      {productOptions[formData.category]?.map((product) => (
                        <option key={product} value={product}>
                          {product}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm text-[#000000]">Beginning Stocks</label>
                    <input
                      type="number"
                      value={formData.beginning}
                      onChange={(e) => handleInputChange("beginning", e.target.value)}
                      placeholder="Enter beginning quantity"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm text-[#000000]">Sales</label>
                    <input
                      type="number"
                      value={formData.sales}
                      onChange={(e) => handleInputChange("sales", e.target.value)}
                      placeholder="Enter sales quantity"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm text-[#000000]">Amount</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      placeholder="Enter amount"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm text-[#000000]">Ending Stocks</label>
                    <input
                      type="number"
                      value={formData.ending}
                      readOnly
                      placeholder="Auto-calculated"
                      className={readOnlyInputClass}
                    />
                    <p className="text-xs text-[#979797]">Calculated: Beginning - Sales</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="font-bold text-sm text-[#000000]">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="font-bold text-sm text-[#000000]">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange("time", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Profit / Admin Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: "Total", field: "total" },
                    { label: "Expenses", field: "expenses" },
                    { label: "Debt", field: "debt" },
                    { label: "Cash Advance", field: "cashAdvance" },
                    { label: "Cash", field: "cash" },
                    { label: "GCash", field: "gcash" },
                  ].map(({ label, field }) => (
                    <div key={field} className="flex flex-col gap-1">
                      <label className="font-bold text-sm text-[#000000]">{label}</label>
                      <input
                        type="number"
                        value={formData[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder={`Enter ${label}`}
                        className={inputClass}
                      />
                    </div>
                  ))}

                  {/* Auto Discount */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm text-[#000000]">Discount</label>
                    <input
                      type="number"
                      value={discountFromStaffOrders}
                      readOnly
                      className={readOnlyInputClass}
                    />
                  </div>

                  {/* Calculated Total Sale */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm text-[#000000]">Total Sale</label>
                    <input
                      type="number"
                      value={totalSale}
                      readOnly
                      className={readOnlyInputClass}
                    />
                  </div>

                  {/* Calculated Total Profit */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm text-[#000000]">Total Profit</label>
                    <input
                      type="number"
                      value={totalProfit}
                      readOnly
                      className={readOnlyInputClass}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#EABB12] text-white font-semibold rounded-[30px] px-8 py-2 hover:bg-[#d9a60f] transition w-full sm:w-auto"
              >
                <span>Save</span>
                <img src={Save || "/placeholder.svg"} alt="Save" className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {showToast && (
        <SuccessToast
          message="Information Saved Successfully!"
          subMessage="Your data has been added to the system"
          onClose={handleToastClose}
        />
      )}
    </>
  )
}
