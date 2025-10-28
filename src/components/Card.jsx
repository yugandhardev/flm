import React from "react";
import { Building2, MapPin, Users, Calendar } from "lucide-react";

const Card = ({ item }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 mb-5 text-center">
            {item.name}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-slate-400" />
            {item.industry || "N/A"}
          </p>

          <p className="text-sm text-slate-500 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            {item.city}, {item.country}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 text-slate-600 text-sm border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            {item.employees?.toLocaleString() || "-"}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            {item.founded || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
