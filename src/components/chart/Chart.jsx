import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ title, aspect, data }) => {
  return (
    <div className="flex-1 lg:flex-[5] shadow-[4px_6px_15px_2px_rgba(201,201,201,0.6)] relative transition-transform duration-300 hover:scale-105 hover:shadow-[4px_6px_15px_2px_rgba(201,201,201,0.6)] p-4 mr-4 mt-0 text-gray-500 rounded-lg">
      <div className="p-2 font-bold text-lg font-saira text-center">
        {title}
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 5, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e64c3e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#e64c3e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#e64c3e"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
