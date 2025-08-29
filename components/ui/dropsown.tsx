import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "Select...",
  className = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 
          bg-gray-800/30 backdrop-blur-xl
          border border-gray-700/50
          rounded-lg
          flex items-center justify-between gap-2
          text-left
          transition-all duration-200
          hover:bg-gray-800/50 hover:border-purple-500/50
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          ${isOpen ? "bg-gray-800/50 border-purple-500/50" : ""}
        `}
      >
        <span className={selectedOption ? "text-white" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-purple-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur-xl" />

            {/* Dropdown content */}
            <div className="relative bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-2xl overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3
                      flex items-center justify-between gap-3
                      transition-all duration-200
                      hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20
                      ${
                        value === option.value
                          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white"
                          : "text-gray-300 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {option.icon && (
                        <span className="text-purple-400">{option.icon}</span>
                      )}
                      <span>{option.label}</span>
                    </div>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
