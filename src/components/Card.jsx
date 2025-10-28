import React from "react";
import { Building2, MapPin, Users, Calendar } from "lucide-react";

const Card = ({ item }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">{item.name}</h2>

      <div className="flex items-center text-slate-600 text-sm mb-1">
        <Building2 className="w-4 h-4 mr-2 text-slate-500" />
        {item.industry}
      </div>

      <div className="flex items-center text-slate-600 text-sm mb-1">
        <MapPin className="w-4 h-4 mr-2 text-slate-500" />
        {item.city}, {item.country}
      </div>

      <div className="flex items-center text-slate-600 text-sm mt-3 gap-4">
        <span className="flex items-center">
          <Users className="w-4 h-4 mr-1 text-slate-500" />
          {item.employees?.toLocaleString() || "-"}
        </span>
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1 text-slate-500" />
          {item.founded}
        </span>
      </div>
    </div>
  );
};

export default Card;
