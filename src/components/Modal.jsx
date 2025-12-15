import { useEffect } from "react"

export default function Modal({ show, onClose, children }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fullscreen blur + dark overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-[972px] px-4 py-6">{children}</div>
    </div>
  )
}
