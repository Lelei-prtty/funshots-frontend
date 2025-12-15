import { useState, useContext, useEffect } from "react"
import { POSContext } from "../context/POSContext"
import StaffProdSelect from "./StaffProdSelect"
import SuccessToast from "./SuccessToast"

export default function StaffPOSForm({ date, time, onOrderAdded }) {
  const posContext = useContext(POSContext)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const [formData, setFormData] = useState({
    productName: "",
    size: "",
    sales: "",
    amount: "",
    discount: 0,
    discountedAmount: "",
  })

  useEffect(() => {
    if (formData.amount && formData.discount >= 0) {
      const discountRate = Math.min(formData.discount, 100) / 100
      const finalAmount = formData.amount - formData.amount * discountRate
      setFormData((prev) => ({ ...prev, discountedAmount: finalAmount.toFixed(2) }))
    } else {
      setFormData((prev) => ({ ...prev, discountedAmount: "" }))
    }
  }, [formData.amount, formData.discount])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.productName && formData.sales && formData.amount) {
      const newOrder = {
        id: Date.now(),
        ...formData,
        date,
        time,
      }

      if (posContext?.addStaffOrder) {
        posContext.addStaffOrder(newOrder)
      }

      if (onOrderAdded) {
        onOrderAdded(newOrder)
      }

      setShowSuccessToast(true)
      setFormData({
        productName: "",
        size: "",
        sales: "",
        amount: "",
        discount: 0,
        discountedAmount: "",
      })
    }
  }

  const handleToastClose = () => setShowSuccessToast(false)

  const isBeverage =
    formData.productName?.includes("Shake") ||
    formData.productName?.includes("Juice") ||
    formData.productName === "Water"
  const isJuice = formData.productName?.includes("Juice")

  return (
    <>
      <div className="w-full bg-transparent px-2 sm:px-4 py-2 flex items-center justify-center">
        <div className="w-full max-w-[1084px] bg-white border rounded-[15px] p-4 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0 flex-wrap gap-2">
            <h2 className="text-[20px] font-semibold text-[#000] font-poppins">Add Order</h2>
            <button
              type="submit"
              form="posForm"
              className="bg-[#EABB12] text-white text-[14px] font-poppins rounded-[30px] px-6 py-2 flex items-center justify-center hover:bg-[#d9a60f] transition whitespace-nowrap"
            >
              Add Order
            </button>
          </div>

          <form id="posForm" onSubmit={handleSubmit} className="flex-1">
            {/* Product Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 flex-shrink-0">
              {/* Product Name Button */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-black font-poppins">Product</label>
                <button
                  type="button"
                  onClick={() => setShowProductModal(true)}
                  className="border border-[#979797] rounded-[15px] px-2 sm:px-3 py-1.5 text-left text-xs sm:text-sm text-[#979797] font-poppins hover:bg-gray-50 transition"
                >
                  {formData.productName || "Select Product"}
                </button>
              </div>

              {/* Sales */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-black font-poppins">Sales</label>
                <input
                  type="number"
                  value={formData.sales}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sales: e.target.value }))}
                  placeholder="0"
                  className="border border-[#979797] rounded-[15px] px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-[#000000] placeholder-[#979797] focus:outline-none"
                />
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-black font-poppins">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="0"
                  className="border border-[#979797] rounded-[15px] px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-[#000000] placeholder-[#979797] focus:outline-none"
                />
              </div>
            </div>

            {/* Discount Section */}
            <div className="flex gap-2 sm:gap-3 flex-shrink-0 mb-3 flex-wrap">
              <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-black font-poppins">Discount</label>
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, discount: 20 }))}
                    className="flex-1 px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm transition"
                    style={{
                      backgroundColor: formData.discount === 20 ? "#F10F10" : "#E5E5E5",
                      color: formData.discount === 20 ? "white" : "#000000",
                    }}
                  >
                    20% OFF
                  </button>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discount: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    placeholder="Custom %"
                    className="flex-1 border border-[#979797] rounded-[15px] px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-[#000000] placeholder-[#979797] focus:outline-none"
                  />
                </div>
              </div>

              {/* Discounted Total */}
              <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-black font-poppins">Total Amount</label>
                <input
                  type="text"
                  readOnly
                  value={formData.discountedAmount || ""}
                  placeholder="0.00"
                  className="border border-[#979797] bg-[#f9f9f9] rounded-[15px] px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-[#000000] focus:outline-none"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex-1 border border-[#979797] rounded-[15px] p-2 sm:p-3 flex gap-2">
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-black font-poppins mb-0.5">Date</p>
                  <p className="text-[11px] text-[#979797] font-poppins">{date}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-black font-poppins mb-0.5">Time</p>
                  <p className="text-[11px] text-[#979797] font-poppins">{time}</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Product Selection Modal */}
      <StaffProdSelect
        show={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelectProduct={(product) => {
          setFormData((prev) => ({ ...prev, productName: product }))
          setShowProductModal(false)
        }}
      />

      {/* Success Toast */}
      {showSuccessToast && (
        <SuccessToast
          message="Order Added Successfully!"
          subMessage="Your order has been recorded"
          onClose={handleToastClose}
        />
      )}
    </>
  )
}
