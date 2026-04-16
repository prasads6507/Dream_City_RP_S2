// FormInput Component — reusable styled input/textarea/select
// Matches the GTA dark theme design system

/**
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.id - Unique element ID
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.as='input'] - Element type ('input', 'textarea', 'select')
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {boolean} [props.disabled=false] - Whether field is disabled
 * @param {number} [props.rows=4] - Textarea rows
 * @param {React.ReactNode} [props.children] - Select options
 * @param {string} [props.helpText] - Helper text below input
 */
const FormInput = ({
  label,
  id,
  type = 'text',
  as = 'input',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  children,
  helpText
}) => {
  const inputProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    className: 'gta-input'
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--color-gta-text)'
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--color-gta-accent)', marginLeft: '4px' }}>*</span>}
      </label>

      {as === 'textarea' ? (
        <textarea {...inputProps} rows={rows} style={{ resize: 'vertical', minHeight: '100px' }} />
      ) : as === 'select' ? (
        <select {...inputProps}>
          {children}
        </select>
      ) : (
        <input {...inputProps} type={type} />
      )}

      {helpText && (
        <p style={{
          marginTop: '6px',
          fontSize: '0.82rem',
          color: 'var(--color-gta-text-dim)'
        }}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormInput;
