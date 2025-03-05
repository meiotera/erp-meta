import React from 'react';

function Input({ type, placeholder, value, handleInputChange, label, id }) {
    const handleChange = (event) => {
        handleInputChange(id, event.target.value);
    };

    return (
        <div className="mb-3">
            {
                type !== 'hidden' && <label htmlFor={id} className="form-label">{label}:</label>
            }
            <input
                className="form-control"
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}

export default Input;