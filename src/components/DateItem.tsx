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
        flex flex-col items-center justify-center p-1 w-14 h-24
        transition-all duration-200 ease-in-out rounded-lg
        ${
          isAvailable
            ? "hover:bg-blue-50 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }
        ${isSelected ? "bg-blue-100 hover:bg-blue-200" : "bg-white"}
        relative group
      `}
    >
      <div className="text-xs font-medium text-gray-600">
        {date.toLocaleDateString(undefined, { weekday: "short" })}
      </div>
      <div className="text-2xl font-bold text-gray-900">{date.getDate()}</div>
      <div className="text-xs text-gray-600">
        {date.toLocaleDateString(undefined, { month: "short" })}
      </div>
      {isSelected && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
        </div>
      )}
    </button>
  );
}
