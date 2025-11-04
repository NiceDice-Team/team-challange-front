export const RadioButton = ({
  id,
  name,
  value,
  checked,
  onChange,
  children,
  className = "",
}) => {
  return (
    <label
      className={`flex items-center cursor-pointer ${className}`}
      onClick={onChange}
    >
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            checked ? "border-purple bg-white" : "border-purple bg-white"
          }`}
        >
          {checked && <div className="bg-purple rounded-full w-3 h-3"></div>}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </label>
  );
};
