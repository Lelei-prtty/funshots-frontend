import { useState, useEffect } from "react";
import PesoIcon from "../assets/icons/Peso.svg";
import GreenArrowIcon from "../assets/icons/greenarrow.svg";
import BagIcon from "../assets/icons/BagIcon.svg";
import UpArrowIcon from "../assets/icons/ArUpIcon.svg";
import PercentIcon from "../assets/icons/Percent.svg";
import RedArrowIcon from "../assets/icons/redarrow.svg";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  /* SAMPLE DATA */
  const transactions = {
    daily: 2847.5,
    weekly: 12000,
    monthly: 45000,
    dailyChange: 12.5,
    weeklyChange: 18.2,
    monthlyChange: 8.3,
    profitMargin: -2.1,
  };

  const inventoryOverview = {
    totalStock: 1230,
    lowStockItems: 5,
    bestSellingItems: [
      { name: "Spicy Chicken Bucket", sold: 89, price: 2000 },
      { name: "Classic Fried Chicken", sold: 76, price: 1500 },
      { name: "Buffalo Wings", sold: 65, price: 1000 },
    ],
    bestSellingBeverages: [
      { name: "Chocolate Shake", sold: 45, price: 225 },
      { name: "Vanilla Shake", sold: 38, price: 190 },
      { name: "Matcha Shake", sold: 32, price: 162 },
    ],
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6">

      {/* TOP HEADER */}
      <div className="flex flex-col items-start justify-center w-full max-w-[436px] mt-4 sm:mt-6 lg:mt-8 px-2 sm:px-4 lg:px-0">
        <h2 className="text-[#0C1208] font-poppins font-bold text-3xl">Dashboard</h2>
        <p className="text-[#CF3847] font-poppins text-lg">
          Monitor your restaurant's performance and key metrics
        </p>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start w-full max-w-[1400px] mx-auto">

        {/* LEFT COLUMN – TRANSACTIONS */}
        <div className="flex flex-col gap-4 w-full lg:w-[280px]">

          {/* Day Total Income */}
          <IncomeCard
            icon={PesoIcon}
            change={transactions.dailyChange}
            changeColor="green"
            label="Day Total Income"
            amount={transactions.daily}
            onClick={() => navigate("/pos", { state: { tab: "daily" } })}
          />

          {/* Week Total Income */}
          <IncomeCard
            icon={BagIcon}
            change={transactions.weeklyChange}
            changeColor="green"
            label="Week Total Income"
            amount={transactions.weekly}
            onClick={() => navigate("/pos", { state: { tab: "weekly" } })}
          />

          {/* Month Total Income */}
          <IncomeCard
            icon={UpArrowIcon}
            change={transactions.monthlyChange}
            changeColor="green"
            label="Monthly Income"
            amount={transactions.monthly}
            onClick={() => navigate("/pos", { state: { tab: "monthly" } })}
          />

          {/* Mean Profit Margin */}
          <IncomeCard
            icon={PercentIcon}
            change={transactions.profitMargin}
            changeColor={transactions.profitMargin >= 0 ? "green" : "red"}
            label="Mean Profit Margin"
            amount={transactions.profitMargin >= 0 ? `+${transactions.profitMargin}%` : `${transactions.profitMargin}%`}
            isPercentage={true}
          />

        </div>

        {/* RIGHT COLUMN – BEST SELLING + INVENTORY */}
        <div className="flex flex-col gap-6 flex-1 w-full">

          {/* INVENTORY OVERVIEW */}
          <div
            className="flex flex-col justify-between bg-white border border-[#DFDFDF] rounded-2xl p-4 sm:p-6 cursor-pointer"
            onClick={() => navigate("/inventory")}
          >
            <div className="flex items-center justify-between">
              <div className="text-[#0C1208] font-bold font-poppins text-lg">Inventory Overview</div>
              <div className="text-[#F10F10] font-semibold text-sm">{inventoryOverview.lowStockItems} Low Stock Items</div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {inventoryOverview.bestSellingItems.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{idx + 1}. {item.name}</span>
                  <span>{item.sold} sold</span>
                </div>
              ))}
            </div>
          </div>

          {/* BEST SELLING MENU */}
          <BestSellingCard title="3 Best Selling Menu" items={inventoryOverview.bestSellingItems} colors={["#CA498C","#942A38","#F10F10"]} />

          {/* BEST SELLING BEVERAGES */}
          <BestSellingCard title="3 Best Selling Beverages" items={inventoryOverview.bestSellingBeverages} colors={["#DCAF5C","#AAEEAA","#ABDC5C"]} />

        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */
const IncomeCard = ({ icon, change, changeColor, label, amount, onClick, isPercentage }) => {
  const changeIcon = change >= 0 ? GreenArrowIcon : RedArrowIcon;
  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-center items-start p-4 gap-2 bg-white border border-[#DFDFDF] rounded-[20px] cursor-pointer"
    >
      <div className="flex flex-row items-center gap-4 w-full">
        <img src={icon} className="w-12 h-12" />
        <div className="flex flex-row items-center gap-1">
          <img src={changeIcon} className="w-5 h-5" />
          <span className={`text-sm font-poppins ${changeColor === "green" ? "text-[#22BB22]" : "text-[#F10F10]"}`}>
            {change}%
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm font-bold text-[#CF3847] font-poppins">{label}</div>
      <div className="text-lg font-bold text-black font-poppins">{isPercentage ? amount : `₱ ${amount}`}</div>
    </div>
  );
};

const BestSellingCard = ({ title, items, colors }) => {
  return (
    <div className="flex flex-col justify-center items-start gap-6 bg-white border border-[#DFDFDF] rounded-2xl p-4 sm:p-6 w-full">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: colors[0] }}></div>
        <h2 className="text-[#0C1208] font-poppins font-bold text-lg">{title}</h2>
      </div>

      {/* PIE CHART */}
      <div className="relative w-[214px] h-[200px] mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {items.map((item, idx) => (
            <circle
              key={idx}
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={colors[idx]}
              strokeWidth="30"
              strokeDasharray={`${2 * Math.PI * 80 * item.sold / Math.max(...items.map(i => i.sold))} ${2 * Math.PI * 80}`}
              strokeDashoffset={`-${2 * Math.PI * 80 * items.slice(0, idx).reduce((a,b)=>a+b.sold,0)/Math.max(...items.map(i=>i.sold))}`}
            />
          ))}
        </svg>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-4 w-full">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors[idx] }}></div>
              <div className="ml-4">
                <p className="text-black font-poppins text-base">{item.name}</p>
                <p className="text-sm text-[#CF3847]">{item.sold} sold</p>
              </div>
            </div>
            <span className="text-[#942A38] font-medium">₱{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
