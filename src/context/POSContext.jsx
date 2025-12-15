import { createContext, useState } from "react"

export const POSContext = createContext()

export default function POSProvider({ children }) {
  const [staffOrders, setStaffOrders] = useState([])
  const [adminSalesData, setAdminSalesData] = useState([])

  const addStaffOrder = (order) => {
    setStaffOrders((prev) => [order, ...prev])
  }

  const addAdminSalesData = (data) => {
    setAdminSalesData((prev) => [data, ...prev])
  }

  const value = {
    staffOrders,
    adminSalesData,
    addStaffOrder,
    addAdminSalesData,
  }

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>
}
