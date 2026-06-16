import { Check, Palette } from "lucide-react"
import { useState } from "react"

const ColorPicker = ({ selectedColor, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const colors = [
        { name: "Blue", value: "#3B82F6" },
        { name: "Indigo", value: "#6366f1" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Green", value: "#10B981" },
        { name: "Red", value: "#EF4444" },
        { name: "Orange", value: "#F97316" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Pink", value: "#EC4899" },
        { name: "Gray", value: "#6B7280" },
        { name: "Black", value: "#1F2937" },
    ]

    // Fallback color agar koi color selected na ho
    const activeColor = selectedColor || "#6B7280";

    return (
        <div>
            <div className="relative">
                
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex items-center gap-2 text-sm font-medium border bg-white shadow-sm transition-all px-3 py-2 rounded-lg"
                    style={{ 
                        borderColor: `${activeColor}40`, // 40 adds transparency to border
                        color: activeColor
                    }}
                >
                    {/* Icon ab select kiye gaye color ke hisab se badlega */}
                    <Palette size={16} style={{ color: activeColor }} />
                    <span className="max-sm:hidden">Accent</span>
                </button>

                {isOpen && (
                    <div className="grid grid-cols-4 w-64 gap-2 absolute top-full left-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-lg">
                        {colors.map((color) => (
                            <div 
                                key={color.value} 
                                className="relative cursor-pointer group flex flex-col items-center" 
                                onClick={() => { onChange(color.value); setIsOpen(false) }}
                            >
                                <div 
                                    className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors flex items-center justify-center shadow-inner" 
                                    style={{ backgroundColor: color.value }}
                                >
                                    {selectedColor === color.value && (
                                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                                    )}
                                </div>
                                <p className="text-[10px] text-center mt-1 text-gray-500 font-medium">{color.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ColorPicker