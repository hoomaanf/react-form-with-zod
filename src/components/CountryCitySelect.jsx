import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

const countryCities = {
  IR: ["تهران", "مشهد", "اصفهان", "تبریز"],
  US: ["نیویورک", "لس آنجلس", "شیکاگو"],
  DE: ["برلین", "مونیخ", "فرانکفورت"],
};

export default function CountryCitySelect() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedCountry = watch("country");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (selectedCountry) {
      setCities(countryCities[selectedCountry] || []);
      setValue("city", "");
    }
  }, [selectedCountry, setValue]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="country" className="text-sm font-semibold">
          کشور
        </label>
        <select
          {...register("country")}
          id="country"
          className={`border p-2 rounded w-full ${
            errors.country ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">-- انتخاب کنید --</option>
          <option value="IR">ایران</option>
          <option value="US">آمریکا</option>
          <option value="DE">آلمان</option>
        </select>
        {errors.country && (
          <span className="text-red-500 text-sm">{errors.country.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="city" className="text-sm font-semibold">
          شهر
        </label>
        <select
          {...register("city")}
          id="city"
          className={`border p-2 rounded w-full ${
            errors.city ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">-- انتخاب کنید --</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && (
          <span className="text-red-500 text-sm">{errors.city.message}</span>
        )}
      </div>
    </div>
  );
}
