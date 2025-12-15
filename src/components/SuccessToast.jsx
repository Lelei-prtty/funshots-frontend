import { useEffect } from "react"
import Check from "../assets/icons/check.svg"

export default function SuccessToast({ message, subMessage, onClose }) {
  // Enable scrolling (removed background scroll lock)
  useEffect(() => {
    document.body.style.overflow = ""
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center">
      {/* Toast container */}
      <div className="relative w-[90%] sm:w-[500px] max-w-[550px] bg-white rounded-[20px] p-6 sm:p-8 flex flex-col items-center shadow-2xl border border-gray-200">
        {/* Check Icon */}
       <img src={Check} alt="Success" className="w-12 h-12 sm:w-16 sm:h-16" />
        

        {/* Message */}
        <h2 className="text-black text-xl sm:text-2xl font-bold text-center mb-2">{message}</h2>
        <p className="text-gray-600 text-sm sm:text-base text-center mb-6 px-4">{subMessage}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-[#f10f10] hover:bg-[#ce3846] text-white font-semibold rounded-[20px] w-[80%] sm:w-[400px] h-[50px] sm:h-[58px] transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}
