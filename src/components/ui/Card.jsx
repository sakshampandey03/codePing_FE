import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-lg rounded-3xl p-6 border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
