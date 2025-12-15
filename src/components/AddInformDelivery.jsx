import { useState, useEffect } from "react"
import Modal from "./Modal"
import SaveIcon from "../assets/icons/save.svg"
import SuccessToast from "./SuccessToast"
import Close from "../assets/icons/exit button.svg"

export default function AddInformDelivery({ show, onClose, selectedItem }) {
  const [showToast, setShowToast] = useState(false)

  const [formData, setFormData] = useState({
    supplierName: "",
    productName: "",
    quantity: "",
    deliveryStatus: "accepted",
    date: "",
    time: "",
    image: null,
    comment: "",
  })

  // Supplier and Product Data
  const suppliers = {
    "Cc Products Supplier - Dasmariñas Cavite": ["Chicken", "Chicken Fillet"],
    "Goldfood Enterprises - Quinta Market Quiapo": [
      "Mela Box",
      "Spork",
      "Cups",
      "Chicken Sauce",
      "Gravy",
      "Juice",
    ],
  }

  useEffect(() => {
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0]
    const timeStr = now.toTimeString().slice(0, 5)

    setFormData((prev) => ({
      ...prev,
      date: dateStr,
      time: timeStr,
      supplierName: selectedItem?.supplierName || "",
      productName: selectedItem?.productName || "",
    }))
  }, [selectedItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      onClose()
    }, 1200)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Reset product name when supplier changes
    if (name === "supplierName") {
      setFormData((prev) => ({
        ...prev,
        supplierName: value,
        productName: "",
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      deliveryStatus: status,
    }))
  }

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <div className="relative bg-white w-full max-w-[982px] rounded-[20px] mx-auto flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center border-b-[3px] border-[#E7EBEA] px-6 py-4 sticky top-0 bg-white z-10">
            <h2 className="text-[#000000] font-bold text-xl">Delivery Information</h2>
            <button onClick={onClose} className="hover:opacity-70 transition">
              <img src={Close || "/placeholder.svg"} alt="Close" className="w-7 h-7" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 sm:px-8 lg:px-14 py-6 sm:py-8 flex flex-col gap-6 overflow-y-auto max-h-[calc(90vh-200px)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch content-stretch">
              {/* Supplier Name (Dropdown) */}
              <div className="border border-[#979797] rounded-[20px] p-4 sm:p-6 flex flex-col gap-4 min-h-[160px] justify-between">
                <label className="font-bold text-base text-[#000000] font-poppins">Supplier Name</label>
                <select
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  className="text-[#000000] font-poppins text-base bg-transparent outline-none border-b border-[#979797] pb-2 focus:ring-0"
                >
                  <option value="">Select Supplier</option>
                  {Object.keys(suppliers).map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name (Dropdown - depends on Supplier) */}
              <div className="border border-[#979797] rounded-[20px] p-4 sm:p-6 flex flex-col gap-4 min-h-[160px] justify-between">
                <label className="font-bold text-base text-[#000000] font-poppins">Product Name</label>
                <select
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  disabled={!formData.supplierName}
                  className={`text-[#000000] font-poppins text-base bg-transparent outline-none border-b border-[#979797] pb-2 focus:ring-0 ${
                    !formData.supplierName ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">
                    {formData.supplierName ? "Select Product" : "Select Supplier First"}
                  </option>
                  {formData.supplierName &&
                    suppliers[formData.supplierName]?.map((product) => (
                      <option key={product} value={product}>
                        {product}
                      </option>
                    ))}
                </select>
              </div>

              {/* Status */}
              <div className="border border-[#979797] rounded-[20px] p-4 sm:p-6 flex flex-col gap-6 min-h-[160px] justify-between">
                <h3 className="font-bold text-base text-[#000000] font-poppins">Status</h3>
                <div className="flex flex-col gap-4">
                  {/* Accepted */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryStatus"
                      value="accepted"
                      checked={formData.deliveryStatus === "accepted"}
                      onChange={() => handleStatusChange("accepted")}
                      className="hidden"
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        formData.deliveryStatus === "accepted"
                          ? "bg-[#F10F10] border-[#F10F10]"
                          : "border-[#979797] bg-white"
                      }`}
                    >
                      {formData.deliveryStatus === "accepted" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-bold text-base text-[#0C1208] font-poppins">Accepted</span>
                  </label>

                  {/* Return */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryStatus"
                      value="return"
                      checked={formData.deliveryStatus === "return"}
                      onChange={() => handleStatusChange("return")}
                      className="hidden"
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        formData.deliveryStatus === "return"
                          ? "bg-[#F10F10] border-[#F10F10]"
                          : "border-[#979797] bg-white"
                      }`}
                    >
                      {formData.deliveryStatus === "return" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-bold text-base text-[#0C1208] font-poppins">Return to Seller</span>
                  </label>
                </div>
              </div>

              {/* Quantity */}
              <div className="border border-[#979797] rounded-[20px] p-4 sm:p-6 flex flex-col gap-4 min-h-[160px] justify-between">
                <label className="font-bold text-base text-[#000000] font-poppins">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter Quantity"
                  className="text-[#000000] font-poppins text-lg sm:text-xl bg-transparent outline-none border-b border-[#979797] pb-2"
                />
              </div>

              {/* Date */}
              <div className="border border-[#979797] rounded-[20px] p-4 sm:p-6 flex flex-col gap-4 min-h-[160px] justify-between">
                <label className="font-bold text-sm sm:text-base text-[#000000] font-poppins">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="text-[#000000] font-poppins text-sm sm:text-base bg-transparent outline-none border-b border-[#979797] pb-2"
                />
                <p className="text-xs text-[#979797]">Auto-filled with current date</p>
              </div>

              {/* Time */}
              <div className="border border-[#979797] rounded-[20px] p-4 sm:p-6 flex flex-col gap-4 min-h-[160px] justify-between">
                <label className="font-bold text-sm sm:text-base text-[#000000] font-poppins">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="text-[#000000] font-poppins text-sm sm:text-base bg-transparent outline-none border-b border-[#979797] pb-2"
                />
                <p className="text-xs text-[#979797]">Auto-filled with current time</p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#EABB12] text-white font-semibold rounded-[30px] px-8 py-2 hover:bg-[#d9a60f] transition w-full sm:w-auto"
              >
                <span>Save</span>
                <img src={SaveIcon || "/placeholder.svg"} alt="Save" className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Success Toast */}
      {showToast && (
        <SuccessToast
          message="Delivery Confirmation Saved Successfully!"
          subMessage="Your delivery confirmation has been saved to the system"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
