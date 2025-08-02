import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function PersianDatePicker({
  value,
  onChange,
  minDate,
  placeHolder,
  readOnly = false,
  label,
  id,
  autoCompleteToday = false,
  className,
  error,
}) {
  const [internalValue, setInternalValue] = useState(null);

  useEffect(() => {
    if (!value && autoCompleteToday) {
      const today = new DateObject({ calendar: persian, locale: persian_fa });
      setInternalValue(today);
      onChange?.(today);
    }
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <DatePicker
        inputClass={`w-full px-3 py-2 rounded-md border shadow-sm focus:outline-none transition ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        } ${className || ""}`}
        containerClassName="w-full"
        id={id}
        calendar={persian}
        locale={persian_fa}
        value={value || internalValue}
        onChange={onChange}
        format="YYYY/MM/DD"
        placeholder={placeHolder}
        weekDays={["ش", "ی", "د", "س", "چ", "پ", "ج"]}
        minDate={minDate}
        readOnly={readOnly}
        className={className}
      />
    </div>
  );
}
