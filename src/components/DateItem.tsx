interface DateItemProps {
  date: Date;
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

export function DateItem({
  date,
  isSelected,
  isAvailable,
  onClick,
}: DateItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={`
        w-full px-4 py-3 text-left transition-all duration-200 ease-in-out
        ${
          isAvailable
            ? "hover:bg-blue-50 cursor-pointer hover:shadow-sm"
            : "opacity-50 cursor-not-allowed"
        }
        ${isSelected ? "bg-blue-100 hover:bg-blue-200 shadow-sm" : "bg-white"}
        border-b border-gray-200 relative group
      `}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {date.toLocaleDateString(undefined, { weekday: "long" })}
          </div>
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
        {isSelected && (
          <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
