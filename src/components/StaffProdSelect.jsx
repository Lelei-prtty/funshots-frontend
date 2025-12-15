export default function StaffProdSelect({ show, onClose, onSelectProduct }) {
  const menuProducts = [
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
  ]

  const beverageProducts = [
    "Water",
    "Juice - 12 oz",
    "Juice - 16 oz",
    "Juice - 22 oz",
    "Mango Cheesecake Shake",
    "Oreo Cheesecake Shake",
  ]

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] w-full max-w-[700px] shadow-lg max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0e0e0] px-6 py-4 sticky top-0 bg-white">
          <h2 className="text-[20px] text-black font-poppins">Select Product</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center"
          >
            <span className="text-gray-500 text-2xl font-bold leading-none">×</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* MENU SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-[#F10F10] font-poppins mb-4">Menu</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {menuProducts.map((product, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelectProduct(product)
                    onClose()
                  }}
                  className="p-4 h-auto bg-white border-2 border-[#979797] rounded-[15px] hover:bg-[#FFF5E6] hover:border-[#F10F10] transition text-center flex items-center justify-center min-h-[80px]"
                >
                  <span className=" text-sm text-black font-poppins">{product}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BEVERAGES SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-[#F10F10] font-poppins mb-4">Beverages</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {beverageProducts.map((product, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelectProduct(product)
                    onClose()
                  }}
                  className="p-4 h-auto bg-white border-2 border-[#979797] rounded-[15px] hover:bg-[#FFF5E6] hover:border-[#F10F10] transition text-center flex items-center justify-center min-h-[80px]"
                >
                  <span className=" text-sm text-black font-poppins">{product}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
