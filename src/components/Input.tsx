import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, rightElement, ...props }) => {
    return (
        <div className="mb-5 w-full">
            <div className="flex justify-between items-center mb-1.5">
                <label htmlFor={id} className="block text-sm font-medium text-gray-600">
                    {label}
                </label>
                {rightElement && <div className="text-sm">{rightElement}</div>}
            </div>
            <input
                id={id}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254EE0] focus:border-transparent transition-all text-sm text-gray-800"
                {...props}
            />
        </div>
    );
};