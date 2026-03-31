import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'social' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "w-full py-3 px-4 rounded-lg font-medium transition-all focus:outline-none flex justify-center items-center gap-2";

    const variants = {
        primary: "bg-[#254EE0] text-white hover:bg-blue-700 shadow-md",
        social: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm font-semibold",
        outline: "border-2 border-gray-200 text-gray-700 hover:border-[#254EE0] hover:text-[#254EE0]",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};