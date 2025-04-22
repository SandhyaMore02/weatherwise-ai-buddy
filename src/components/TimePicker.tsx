
import React from "react";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <select
        className="bg-background border border-input rounded px-2 py-1"
        value={value.split(':')[0]}
        onChange={(e) => {
          const hour = e.target.value;
          const minute = value.split(':')[1];
          onChange(`${hour}:${minute}`);
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        className="bg-background border border-input rounded px-2 py-1"
        value={value.split(':')[1]}
        onChange={(e) => {
          const hour = value.split(':')[0];
          const minute = e.target.value;
          onChange(`${hour}:${minute}`);
        }}
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;

