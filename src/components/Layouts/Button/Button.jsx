import "./Button.css";

const Button = ({
  buttonText,
  wrapperClassName,
  type = "button",
  className,
  onClick,
  ariaLabel,
  disabled = false,
  title,
  icon: Icon,
}) => {
  const button = (
    <button
      type={type}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel ?? buttonText}
      disabled={disabled}
      title={title}
    >
      {Icon && <Icon />}
      {buttonText}
    </button>
  );

  if (!wrapperClassName) return button;

  return <div className={wrapperClassName}>{button}</div>;
};

export default Button;