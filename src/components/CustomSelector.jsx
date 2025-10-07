import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function CustomSelector({
    options = [],
    selected = null,
    onSelect = () => {},
    labelKey = "nombre",
    placeholder = "Selecciona una opción",
    getColor = () => {}
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.targer)) setOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={ref} className="relative w-full">
            <button type="button" onClick={() => setOpen(!open)} className="w-full flex justify-between items-center bg-[#2a2a2a] text-white px-4 py-2 rounded-md border-gray-700 hover:border-gray-500 transition">
                <span>
                    {selected ? typeof selected === "string" ? selected : selected[labelKey] : placeholder}
                </span>
                <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180":""}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div key="options" initial={{opacity: 0, y: -8}} animate={{opacity: 1, y: 0}} exit={{opacity:0, y: -8}} transition={{duration: 0.15}} className="absolute top-full left-0 w-full mt-1 bg-[#333] border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                        {options.length > 0 ? (
                            options.map((opt, index) => {
                                const label = typeof opt === "string" ? opt : opt[labelKey] || (index + 1).toString()
                                return (
                                    <div key={typeof opt === "string" ? opt : opt.$id || index} onClick={() => {
                                        onSelect(opt)
                                        setOpen(false)
                                    }} className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#444] cursor-pointer transition">
                                        {getColor && (
                                            <span className="size-3 rounded-full" style={{ backgroundClip: getColor(index+1) }} />
                                        )}
                                        <span>{label}</span>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="px-4 py-2 text-gray-400 text-sm">No hay opciones disponibles</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}