import { useState } from "react";
import AddInformDelivery from "../components/AddInformDelivery";
import AddIcon from "../assets/icons/truck.svg";
import Peso from "../assets/icons/peso.svg";
import Bag from "../assets/icons/BagIcon.svg";
import Month from "../assets/icons/ArUpIcon.svg";

export default function InventoryPage() {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("daily");
  const [categoryFilter, setCategoryFilter] = useState("All");

  /* DAILY INVENTORY */
  const inventoryData = [
    {
      productName: "Funshots - Original",
      category: "Menu",
      date: "09/12/25",
      time: "7:00am",
      quantity: 120,
      beginningStock: 120,
      endingStock: 0,
      threshold: "10 stocks",
    },
    {
      productName: "Mango Cheesecake Shake",
      category: "Beverages",
      date: "09/12/25",
      time: "8:00am",
      quantity: 25,
      beginningStock: 25,
      endingStock: 5,
      threshold: "5 stocks",
    },
    {
      productName: "Chicken Breast",
      category: "Delivery",
      date: "09/11/25",
      time: "3:00pm",
      quantity: 50,
      beginningStock: 0,
      endingStock: 50,
      threshold: "20 stocks",
    },
    {
      productName: "Cups",
      category: "Item",
      date: "09/12/25",
      time: "7:00am",
      quantity: 100,
      beginningStock: 100,
      endingStock: 20,
      threshold: "10 stocks",
    },
  ];

  /* WEEKLY INVENTORY */
  const weeklyData = [
    {
      productName: "Funshots - Original",
      category: "Menu",
      date: "09/05-09/12/25",
      quantity: 840,
      beginningStock: 840,
      endingStock: 0,
      threshold: "10 stocks",
    },
    {
      productName: "Mango Cheesecake Shake",
      category: "Beverages",
      date: "09/05-09/12/25",
      quantity: 175,
      beginningStock: 175,
      endingStock: 35,
      threshold: "5 stocks",
    },
  ];

  /* MONTHLY INVENTORY */
  const monthlyData = [
    {
      productName: "Funshots - Original",
      category: "Menu",
      date: "09/01-09/30/25",
      quantity: 3600,
      beginningStock: 3600,
      endingStock: 0,
      threshold: "10 stocks",
    },
    {
      productName: "Mango Cheesecake Shake",
      category: "Beverages",
      date: "09/01-09/30/25",
      quantity: 750,
      beginningStock: 750,
      endingStock: 150,
      threshold: "5 stocks",
    },
  ];

  // Combine daily times into weekly/monthly
  const getTableData = () => {
    let data;
    if (activeTab === "weekly") {
      data = weeklyData.map((weekItem) => {
        const dailyTimes = inventoryData
          .filter((d) => d.productName === weekItem.productName)
          .map((d) => d.time)
          .join(", ");
        return { ...weekItem, time: dailyTimes };
      });
    } else if (activeTab === "monthly") {
      data = monthlyData.map((monthItem) => {
        const dailyTimes = inventoryData
          .filter((d) => d.productName === monthItem.productName)
          .map((d) => d.time)
          .join(", ");
        return { ...monthItem, time: dailyTimes };
      });
    } else {
      data = inventoryData;
    }

    // Filter by search term
    if (searchTerm) {
      data = data.filter((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "All") {
      data = data.filter((item) => item.category === categoryFilter);
    }

    return data;
  };

  const handleAddClick = () => {
    setSelectedDeliveryItem(null);
    setShowDeliveryModal(true);
  };

  return (
    <div className="p-3 sm:p-5 w-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-[1041px] mb-8">
        <div>
          <h2 className="text-[#0C1208] font-poppins font-bold text-2xl sm:text-3xl">
            Inventory
          </h2>
          <p className="text-[#CF3847] font-poppins text-base sm:text-lg">
            Track your restaurant's items and ingredients
          </p>
        </div>

<div className="flex items-center gap-3">
 {/* Search Bar */}
<div className="relative">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search..."
    className="w-[180px] sm:w-[250px] h-[48px] bg-[#EABB12] text-white placeholder-white/70 rounded-[30px] px-5 pr-10 font-poppins text-[16px] hover:border-yellow-400 transition focus:outline-none"
  />
  <svg
    className="absolute right-[15px] top-[12px] w-5 h-5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
</div>

  {/* Category Dropdown */}
  <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="w-[180px] sm:w-[157px] h-[48px] bg-[#EABB12] text-white placeholder-white/70 rounded-[30px] px-5 pr-10 font-poppins text-[16px] border-2 border-transparent hover:border-yellow-400 transition"
  >
    {["All", "Menu", "Beverages", "Item", "Delivery"].map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  {/* Delivery Button */}
  <button
    onClick={handleAddClick}
    className="flex items-center sm:w-[120px] gap-2 bg-[#EABB12] hover:bg-[#d4a610] hover:border-2 hover:border-yellow-400 text-white font-poppins rounded-[30px] px-5 py-3 transition"
  >
    <span>Delivery</span>
    <img src={AddIcon} className="w-5 h-5" />
  </button>
</div>


      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        {["daily", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-[20px] text-base font-poppins transition ${
              activeTab === tab ? "bg-[#F10F10] text-white" : "bg-[#E5E5E5] text-black"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1084px] border border-[#DFDFDF] rounded-[15px] bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={activeTab === "daily" ? Peso : activeTab === "weekly" ? Bag : Month}
              className="w-14 h-14"
            />
            <h3 className="text-[#CF3847] font-poppins font-bold text-2xl capitalize">
              {activeTab} Inventory
            </h3>
          </div>

          {/* Header */}
          <div className="grid grid-cols-8 gap-4 font-poppins text-[#F10F10] font-semibold border-b pb-2">
            <p>Product</p>
            <p>Category</p>
            <p>Quantity</p>
            <p>Beginning</p>
            <p>Ending</p>
            <p>Threshold</p>
            <p>Date</p>
            <p>Time</p>
          </div>

          {/* Rows */}
          {getTableData().map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-8 gap-4 py-3 border-b text-sm font-poppins"
            >
              <p>{item.productName}</p>
              <p>{item.category}</p>
              <p>{item.quantity}</p>
              <p>{item.beginningStock}</p>
              <p>{item.endingStock}</p>
              <p className="text-[#F10F10] font-semibold">{item.threshold}</p>
              <p>
                {item.date}
                <span>
                  <p className="text-[#f10f10] text-[10px] opacity-50">mm/dd/yyyy</p>
                </span>
              </p>
              <p>{item.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <AddInformDelivery
          show={showDeliveryModal}
          onClose={() => setShowDeliveryModal(false)}
          selectedItem={selectedDeliveryItem}
        />
      )}
    </div>
  );
}
