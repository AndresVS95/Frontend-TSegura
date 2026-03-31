import React, { type SelectHTMLAttributes } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
}

export const Select: React.FC<SelectProps> = ({ label, id, options, ...props }) => {
    return (
        <div className="mb-5 w-full">
            <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1.5">
                {label}
            </label>
            <select
                id={id}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#254EE0] focus:border-transparent transition-all text-sm text-gray-800"
                {...props}
            >
                <option value="" disabled hidden>Selecciona una opción</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};