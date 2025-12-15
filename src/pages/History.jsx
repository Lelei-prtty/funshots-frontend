import { useState, useEffect } from "react"
import chickenImage from "../assets/icons/drumstick.svg"
import soda from "../assets/icons/cup-soda.svg"
import deliveryTruck from "../assets/icons/package-check.svg"

export default function History() {
  const [activeTab, setActiveTab] = useState("menu")
  const [searchTerm, setSearchTerm] = useState("")

  /* SAMPLE DATA */
  const defaultMenu = [
    {
      product: "Funshots - Original",
      category: "Menu",
      beginning: 120,
      sales: 120,
      amount: "₱10,000",
      ending: 0,
      threshold: 10,
      delivery: 0,
      date: "09/12/25",
      time: "7:00am",
      user: "admin"
    },
    {
      product: "Pastil - Chicken Fillet",
      category: "Menu",
      beginning: 80,
      sales: 50,
      amount: "₱5,000",
      ending: 30,
      threshold: 10,
      delivery: 0,
      date: "09/12/25",
      time: "7:30am",
      user: "staff"
    },
  ]

  const defaultBeverage = [
    {
      product: "Mango Cheesecake Shake",
      category: "Beverage",
      beginning: 25,
      sales: 20,
      amount: "₱12,000",
      ending: 5,
      threshold: 5,
      delivery: 0,
      date: "09/12/25",
      time: "8:00am",
      user: "admin"
    },
    {
      product: "Water",
      category: "Beverage",
      beginning: 30,
      sales: 30,
      amount: "₱1,500",
      ending: 0,
      threshold: 5,
      delivery: 0,
      date: "09/12/25",
      time: "8:30am",
      user: "staff"
    },
  ]

  const defaultDelivery = [
    {
      supplier: "Fresh Supplies Co",
      product: "Chicken Breast",
      quantity: 50,
      amount: "₱7,500",
      status: "Accepted",
      date: "09/11/25",
      time: "3:00pm"
    },
    {
      supplier: "Beverage Distributor",
      product: "Juice Concentrate",
      quantity: 10,
      amount: "₱2,000",
      status: "Returned",
      date: "09/11/25",
      time: "4:00pm"
    },
  ]

  const [menuHistory, setMenuHistory] = useState(defaultMenu)
  const [beverageHistory, setBeverageHistory] = useState(defaultBeverage)
  const [deliveryHistory, setDeliveryHistory] = useState(defaultDelivery)

  const parseAmount = (val) => Number(String(val).replace(/[^\d.-]/g, "")) || 0

  const computeTotalSales = (row) => parseAmount(row.amount)

  const formatCurrency = (num) =>
    `₱${Number(num).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  return (
    <div className="p-4 sm:p-6 w-full flex flex-col font-poppins">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-[1041px] mb-8">
        <div>
          <h2 className="text-[#0C1208] font-bold text-3xl">History</h2>
          <p className="text-[#CF3847] text-lg">View sales and delivery records</p>
        </div>

        <div className="flex flex-row items-center gap-3 mt-4 sm:mt-0">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-[257px] h-[48px] bg-[#EABB12] text-white placeholder-white/70 rounded-[30px] px-5 font-poppins text-[16px]"
          />
          <button className="bg-[#CF3847] text-white px-4 py-2 rounded-[20px] text-sm">
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        {["menu", "beverages", "delivery"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-[20px] text-sm transition-all ${
              activeTab === tab
                ? "bg-[#F10F10] text-white"
                : "bg-[#E5E5E5] text-black hover:bg-[#D5D5D5]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="w-full">
        {activeTab === "menu" && (
          <FixedHistoryTable
            icon={chickenImage}
            title="Menu History"
            columns={[
              "Product Name", "Category", "Beginning Stock", "Sales", "Amount",
              "End Stock", "Threshold", "Date", "Time", "Total Sales", "User"
            ]}
            data={menuHistory}
            computeTotalSales={computeTotalSales}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "beverages" && (
          <FixedHistoryTable
            icon={soda}
            title="Beverage History"
            columns={[
              "Product Name", "Category", "Beginning Stock", "Sales", "Amount",
              "End Stock", "Threshold", "Date", "Time", "Total Sales", "User"
            ]}
            data={beverageHistory}
            computeTotalSales={computeTotalSales}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "delivery" && (
          <FixedDeliveryTable
            icon={deliveryTruck}
            title="Delivery History"
            columns={[
              "Supplier Name", "Product Name", "Quantity",
              "Amount", "Date", "Time", "Amount Purchased", "Status"
            ]}
            data={deliveryHistory}
            computeTotalSales={computeTotalSales}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </div>
  )
}

function FixedHistoryTable({ icon, title, columns, data, computeTotalSales, formatCurrency }) {
  
  // Fraction-based column widths for perfect fitting
  const colWidths = [
    "1.6fr",  
    "1fr",    
    "0.9fr",  
    "0.8fr",  
    "1fr",   
    "0.8fr",  
    "1fr",  
    "1fr", 
    "0.8fr", 
    "1.2fr", 
    "1fr",   
  ]

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1041px] border border-gray-300 rounded-2xl shadow-sm p-6 bg-white">

        {/* HEADER SECTION */}
        <div className="flex items-center gap-3 mb-4">
          <img src={icon} alt="" className="w-14 h-14" />
          <h3 className="text-[#CF3847] font-bold text-2xl">{title}</h3>
        </div>

        {/* TABLE HEADER */}
        <div
          className="grid font-bold text-[#F10F10] border-b border-gray-400 pb-2 mb-4 text-xs sm:text-sm"
          style={{
            gridTemplateColumns: colWidths.join(" "),
          }}
        >
          {columns.map((col, i) => (
            <div key={i}>{col}</div>
          ))}
        </div>

        {/* TABLE ROWS */}
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid py-3 border-b border-gray-200 text-xs sm:text-sm"
            style={{
              gridTemplateColumns: colWidths.join(" "),
            }}
          >
            {columns.map((col, colIndex) => {
              const key = columnToKey(col)
              let val = row[key] ?? ""

              if (col === "Total Sales") {
                val = formatCurrency(computeTotalSales(row))
              }

              if (col === "Amount") {
                val = formatCurrency(parseFloat(String(val).replace(/[^\d.-]/g, "")))
              }

              return <div key={colIndex}>{val}</div>
            })}
          </div>
        ))}

      </div>
    </div>
  )
}

function FixedDeliveryTable({ icon, title, columns, data, computeTotalSales, formatCurrency }) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1041px] border border-gray-300 rounded-2xl shadow-sm p-6 bg-white">

        <div className="flex items-center gap-3 mb-4">
          <img src={icon} alt="" className="w-14 h-14" />
          <h3 className="text-[#CF3847] font-bold text-2xl">{title}</h3>
        </div>

        <div
          className="grid font-bold text-[#F10F10] border-b border-gray-400 pb-2 mb-4 text-xs sm:text-sm"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
          }}
        >
          {columns.map((col, i) => <div key={i}>{col}</div>)}
        </div>

        {data.map((row, i) => (
          <div
            key={i}
            className="grid gap-3 py-3 border-b border-gray-200 text-xs sm:text-sm"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
            }}
          >
            {columns.map((col, idx) => {
              const key = columnToKey(col)
              let val = row[key] ?? ""

              if (col === "Amount Purchased") val = formatCurrency(computeTotalSales(row))

              return <div key={idx}>{val}</div>
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function columnToKey(col) {
  const map = {
    "Product Name": "product",
    "Category": "category",
    "Beginning Stock": "beginning",
    "Sales": "sales",
    "Amount": "amount",
    "End Stock": "ending",
    "Threshold": "threshold",
    "Date": "date",
    "Time": "time",
    "Total Sales": "total_sales",
    "User": "user",
    "Supplier Name": "supplier",
    "Quantity": "quantity",
    "Status": "status",
    "Amount Purchased": "amount_purchased",
  }
  return map[col] || col.toLowerCase().replace(/\s+/g, "_")
}
