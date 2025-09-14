import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// Utility to convert timestamp -> date
function timestampToDate(timestamp) {
  return new Date(timestamp * 1000).toISOString().split("T")[0];
}

export default function Heatmap({ submissionCalendar }) {
  // submissionCalendar comes from backend/LeetCode API
  const parsedData = JSON.parse(submissionCalendar);

  const values = Object.entries(parsedData).map(([timestamp, count]) => ({
    date: timestampToDate(Number(timestamp)),
    count,
  }));

  return (
    <div className="bg-[#36404A] p-4 rounded-2xl shadow-lg w-2/3 mx-auto">
      <h2 className="text-white text-lg font-semibold mb-2">Streak Heatmap</h2>
      <CalendarHeatmap
        startDate={new Date(new Date().getFullYear(), 0, 1)} // Jan 1
        endDate={new Date()} // Today
        values={values}
        classForValue={(value) => {
          if (!value) return "color-empty";
          if (value.count >= 5) return "color-github-4";
          if (value.count >= 3) return "color-github-3";
          if (value.count >= 1) return "color-github-2";
          return "color-github-1";
        }}
        tooltipDataAttrs={(value) =>
          value.date
            ? { "data-tip": `${value.date}: ${value.count} submissions` }
            : {}
        }
        showWeekdayLabels
      />
    </div>
  );
}
