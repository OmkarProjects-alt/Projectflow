import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeProvider";
const CommonCharter = ({ chartData, total, className }) => {


  const pieData =
  total === 0
    ? [{ name: "No Tasks", value: 1 }]
    : chartData;

  const { theme } = useTheme();


  return (
     <div className={`${className.top} w-full p-3`}>

        <div className={`${className.chartHight} z-30 w-70 relative`}>
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
              >
                {total  === 0 ? 
                  (
                    <Cell 
                      key="No tasks"
                      fill="#444444"
                    />
                  )
                : (chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                )))}
              </Pie>
                    
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

            <span className={`text-4xl font-bold ${theme.text.primary}`}>
              {pieData.length === 0 ? 0 : total}
            </span>

            <span className={`${theme.text.secondary} text-sm`}>
              Total Tasks
            </span>

          </div>
        </div>

        <div className={`grid ${className.grid} gap-3 mt-4`}>
          {pieData.map((item) => (
            <div
              key={item.name}
              className={`
                flex
                items-center
                justify-between
                ${theme.card.modal}
                ${theme.text.muted}
                rounded-lg
                ${className.width}
                px-3
                py-2
              `}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
                <span className=" text-sm">
                  {item.name}
                </span>
              </div>

              <span className={`${theme.text.primary} font-semibold`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
  )
}

export default CommonCharter
