import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { toGregorian } from "jalaali-js";

import Input from "./components/Input";
import PersianDatePicker from "./components/DatePicker";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CountryCitySelect from "./components/CountryCitySelect";

const convertDate = (date) => {
  const { gy, gm, gd } = toGregorian(date.year, date.month, date.day);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
};

const schema = z
  .object({
    userName: z.string().min(3, "حداقل ۳ حرف وارد کنید"),
    password: z.string().min(6, "رمز عبور حداقل باید ۶ کاراکتر باشد"),
    repeatPassword: z.string().min(6, "تکرار رمز عبور الزامی است"),
    email: z.string().email("ایمیل معتبر نیست"),
    phone: z
      .string()
      .regex(/^09\d{9}$/, "شماره موبایل باید با 09 شروع شده و 11 رقم باشد"),
    gender: z.string().refine((val) => val === "male" || val === "female", {
      message: "لطفاً جنسیت معتبر را انتخاب کنید",
    }),
    accept: z.boolean().refine((val) => val === true, {
      message: "باید قوانین را بپذیرید",
    }),
    country: z.string().min(1, "کشور را انتخاب کنید"),
    city: z.string().min(1, "شهر را انتخاب کنید"),
    startDate: z.string().min(1, "تاریخ شروع الزامی است"),
    endDate: z.string().min(1, "تاریخ پایان الزامی است"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "رمز عبور و تکرار آن باید یکسان باشند",
  });

function App() {
  const [minDate, setMinDate] = useState(null);

  const formMethods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
      repeatPassword: "",
      email: "",
      phone: "",
      accept: true,
      gender: "",
      country: "",
      city: "",
      bio: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  const handleStartDateChange = (date) => {
    if (!date) return;
    setMinDate(date);
    formMethods.setValue("startDate", convertDate(date));
    formMethods.setValue("endDate", "");
  };

  const handleEndDateChange = (date) => {
    if (!date) return;
    formMethods.setValue("endDate", convertDate(date));
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-4xl overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1"
      >
        <h2 className="col-span-full text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
          فرم اطلاعات کاربر
        </h2>

        {/* Inputs */}
        <Input
          label="نام کاربری"
          type="text"
          id="userName"
          {...formMethods.register("userName")}
          error={formMethods.formState.errors.userName?.message}
        />
        <Input
          label="ایمیل"
          type="email"
          id="email"
          {...formMethods.register("email")}
          error={formMethods.formState.errors.email?.message}
        />
        <Input
          label="رمز عبور"
          type="password"
          id="password"
          {...formMethods.register("password")}
          error={formMethods.formState.errors.password?.message}
        />
        <Input
          label="تکرار رمز عبور"
          type="password"
          id="repeatPassword"
          {...formMethods.register("repeatPassword")}
          error={formMethods.formState.errors.repeatPassword?.message}
        />
        <Input
          label="شماره تماس"
          type="tel"
          id="phone"
          {...formMethods.register("phone")}
          onlyNumber={true}
          maxLength={11}
          startWith={"09"}
          error={formMethods.formState.errors.phone?.message}
        />

        {/* Country and City */}
        <FormProvider {...formMethods}>
          <CountryCitySelect />
        </FormProvider>

        {/* Dates */}
        <div>
          <PersianDatePicker
            placeHolder="تاریخ شروع"
            label="تاریخ شروع"
            id="startDate"
            onChange={handleStartDateChange}
            error={formMethods.formState.errors.startDate?.message}
          />
          {formMethods.formState.errors.startDate && (
            <span className="text-red-500 text-sm">
              {formMethods.formState.errors.startDate.message}
            </span>
          )}
        </div>
        <div>
          <PersianDatePicker
            placeHolder="تاریخ پایان"
            label="تاریخ پایان"
            id="endDate"
            onChange={handleEndDateChange}
            minDate={minDate}
            error={formMethods.formState.errors.endDate?.message}
          />
          {formMethods.formState.errors.endDate && (
            <span className="text-red-500 text-sm">
              {formMethods.formState.errors.endDate.message}
            </span>
          )}
        </div>

        {/* Gender */}
        <div className="col-span-full flex gap-8 mt-3 items-center">
          <label className="font-semibold">جنسیت</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="male"
                {...formMethods.register("gender")}
              />
              مرد
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="female"
                {...formMethods.register("gender")}
              />
              زن
            </label>
          </div>
          {formMethods.formState.errors.gender && (
            <span className="text-red-500 text-sm">
              {formMethods.formState.errors.gender.message}
            </span>
          )}
        </div>

        {/* Accept Terms */}
        <div className="col-span-full flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="accept"
            {...formMethods.register("accept")}
          />
          <label htmlFor="accept" className="text-sm">
            قوانین را می‌پذیرم
          </label>
        </div>
        {formMethods.formState.errors.accept && (
          <span className="text-red-500 text-sm col-span-full">
            {formMethods.formState.errors.accept.message}
          </span>
        )}

        {/* Submit */}
        <div className="col-span-full pt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            ارسال فرم
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
