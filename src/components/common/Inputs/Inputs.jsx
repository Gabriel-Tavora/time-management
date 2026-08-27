import "./Inputs.css";
const Input = ({
  placeholder,
  classNameIn,
  labelText,
  id,
  type,
  value,
  onChange,
  name,
  max,
  min,
  icon: Icon,
}) => {
  return (
    <div className={classNameIn}>
      <label htmlFor={id}>{labelText}</label>
      {Icon && <Icon />}
      <input
      placeholder={placeholder}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        max={max}
        min ={min}
      />
    </div>
  );
};

export default Input;