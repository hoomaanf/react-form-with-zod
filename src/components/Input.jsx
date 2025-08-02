export default function Input({
  label,
  placeholder,
  type = "text",
  id,
  required = false,
  error,
  onlyNumber = false,
  maxLength,
  startWith,
  value,
  onChange,
  ...rest
}) {
  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    if (onlyNumber) {
      const isNumberKey = /^[0-9]$/.test(e.key);
      if (!isNumberKey && !allowedKeys.includes(e.key)) {
        e.preventDefault();
        return;
      }
    }

    if (startWith) {
      const input = e.target;
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;
      const newChar = e.key;

      if (allowedKeys.includes(newChar)) return;

      const predictedValue =
        input.value.slice(0, selectionStart) +
        newChar +
        input.value.slice(selectionEnd);

      if (
        !startWith.startsWith(predictedValue) &&
        !predictedValue.startsWith(startWith)
      ) {
        e.preventDefault();
        return;
      }
    }

    rest.onKeyDown?.(e);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (startWith) {
      if (
        newValue.length <= startWith.length &&
        !startWith.startsWith(newValue)
      ) {
        return;
      }

      if (
        newValue.length >= startWith.length &&
        !newValue.startsWith(startWith)
      ) {
        return;
      }
    }

    onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        value={value}
        maxLength={maxLength}
        id={id}
        type={onlyNumber ? "text" : type}
        inputMode={onlyNumber ? "numeric" : undefined}
        pattern={onlyNumber ? "[0-9]*" : undefined}
        placeholder={placeholder}
        required={required}
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none transition ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        }`}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        {...rest}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
