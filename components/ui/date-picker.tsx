"use client";

import * as React from "react";
import { format, addMonths, addYears, endOfYear } from "date-fns";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { playClickSound } from "@/lib/audio";

interface DatePickerProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker({ date, onChange }: DatePickerProps) {
  const today = new Date();
  const minDateStr = format(new Date(today.getTime() + 86400000), "yyyy-MM-dd"); // Tomorrow

  const presets = [
    { label: "1 Month", getDate: () => addMonths(new Date(), 1) },
    { label: "6 Months", getDate: () => addMonths(new Date(), 6) },
    { label: "1 Year", getDate: () => addYears(new Date(), 1) },
    { label: "3 Years", getDate: () => addYears(new Date(), 3) },
    { label: "5 Years", getDate: () => addYears(new Date(), 5) },
    { label: "New Year's Eve", getDate: () => endOfYear(new Date()) },
  ];

  const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      onChange(undefined);
      return;
    }
    const parts = e.target.value.split("-").map(Number);
    const selected = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    onChange(selected);
  };

  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <div className="space-y-3">
      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const isSelected =
            date &&
            format(date, "yyyy-MM-dd") === format(preset.getDate(), "yyyy-MM-dd");
          return (
            <button
              type="button"
              key={preset.label}
              onClick={() => {
                playClickSound();
                onChange(preset.getDate());
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isSelected
                  ? "bg-purple-600/30 border-purple-400 text-purple-200 shadow-sm"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-purple-500/50 hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Date input field */}
      <div className="relative">
        <input
          type="date"
          min={minDateStr}
          value={selectedDateStr}
          onChange={handleCustomDate}
          className="w-full h-11 px-3.5 rounded-xl bg-slate-800/70 border border-purple-500/30 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer font-sans"
        />
      </div>

      {date && (
        <div className="text-xs text-purple-300 flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Will unlock on <strong>{format(date, "PPP")}</strong></span>
        </div>
      )}
    </div>
  );
}