"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HomeDatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  const handleFetch = async () => {
    if (!date) return;

    const res = await fetch(`/api/data?date=${date.toISOString()}`);
    const data = await res.json();
    console.log(data);
  };

  const handleDateChange = (d: Date | null) => {
    setDate(d);
  };

  return (
    <div>
      <DatePicker
        selected={date}
        onChange={handleDateChange}
        placeholderText="Seleccionar fecha"
        dateFormat="dd/MM/yyyy"
      />

      <button onClick={handleFetch} disabled={!date}>
        Buscar
      </button>
    </div>
  );
}
