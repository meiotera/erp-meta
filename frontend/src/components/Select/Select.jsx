function Select({ label, id, options, onChange }) {
    console.log(options)
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}:</label>
            <select id={id} className="form-select" defaultValue="" onChange={onChange}>
                <option value="" disabled>{label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
}

export default Select;