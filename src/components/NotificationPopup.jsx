import { useState } from "react";
import CloseIcon from "../assets/icons/exit button.svg";

export default function NotificationPopup({
  onClose,
  lowStockItems = [],
  role = "staff",
  onReviewAction,
}) {
  // Prepare reorder suggestions (for admin only)
  const reorderSuggestions =
    role === "admin"
      ? lowStockItems.filter((item) => item.current < item.threshold)
      : [];

  // Staff only sees items that are fully out of stock (Menu/Beverages)
  const filteredItems =
    role === "admin"
      ? lowStockItems
      : lowStockItems.filter(
          (item) =>
            item.current === 0 &&
            (item.category === "Menu" || item.category === "Beverages")
        );

  // Local state for tracking reviewed suggestions
  const [reviewed, setReviewed] = useState({});

  const handleReviewAction = (item, status) => {
    const newState = { ...reviewed, [item.name]: status };
    setReviewed(newState);

    if (onReviewAction) {
      onReviewAction(item, status);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-24 z-50">
      <div className="relative bg-[#CE3846] border border-[#932936] rounded-xl w-[90%] max-w-[778px] h-auto p-8 text-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-6 h-6 flex items-center justify-center"
          aria-label="Close"
        >
          <img src={CloseIcon || "/placeholder.svg"} alt="Close" className="w-6 h-6" />
        </button>

        {/* Header */}
        <h1 className="font-staatliches text-[36px] leading-[45px] text-[#E9DEDA] mb-4">
          Notifications
        </h1>

        {/* Alerts Section */}
        <div className="mb-6">
          <h2 className="font-staatliches text-[32px] leading-[40px] text-[#932936] mb-2">
            {role === "admin" ? "LOW STOCK ALERTS" : "OUT OF STOCK ALERTS"}
          </h2>

          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <p key={index} className="font-poppins text-[12px] leading-[18px] text-[#EAEA0E] mb-1">
                ⚠️ {item.name}{" "}
                {role === "admin"
                  ? `is below threshold (${item.current}/${item.threshold})`
                  : `is out of stock`}
              </p>
            ))
          ) : (
            <p className="font-poppins text-[12px] leading-[18px] text-white">
              {role === "admin"
                ? "All items are above threshold."
                : "No Menu or Beverages items are out of stock."}
            </p>
          )}
        </div>

        {/* Reorder Suggestions — Admin Only */}
        {role === "admin" && (
          <div>
            <h2 className="font-staatliches text-[32px] leading-[40px] text-[#932936] mb-2">
              REORDER SUGGESTIONS
            </h2>

            {reorderSuggestions.length > 0 ? (
              reorderSuggestions.map((item, index) => (
                <div key={index} className="mb-3">
                  <p className="font-poppins text-[12px] leading-[18px] text-[#EAEA0E]">
                    📦 {item.name} needs restocking (Current: {item.current})
                  </p>

                  {/* Review Buttons */}
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleReviewAction(item, "approved")}
                      className="px-3 py-1 bg-white text-[#CE3846] rounded text-[11px] font-semibold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReviewAction(item, "dismissed")}
                      className="px-3 py-1 bg-[#932936] text-white rounded text-[11px]"
                    >
                      Dismiss
                    </button>

                    <button
                      onClick={() => handleReviewAction(item, "reviewed")}
                      className="px-3 py-1 bg-[#EAEA0E] text-black rounded text-[11px]"
                    >
                      Mark Reviewed
                    </button>
                  </div>

                  {/* Status Label */}
                  {reviewed[item.name] && (
                    <p className="text-[10px] mt-1 text-white/80">
                      Status: {reviewed[item.name].toUpperCase()}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="font-poppins text-[12px] leading-[18px] text-white">
                No reorder suggestions at this time.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
