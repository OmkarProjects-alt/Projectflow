import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  textColor = "text-white",
}) => {
  return (
    <div className="bg-[#151b27c0] backdrop-blur-2xl border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-neutral-400 text-sm">
            {title}
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${textColor}`}
          >
            {value}
          </h2>
        </div>

        {icon && (
          <div className="text-2xl">
            {icon}
          </div>
        )}

      </div>
    </div>
  );
};

export default StatCard;