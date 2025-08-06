import React from 'react';

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
    value,
    onChange,
    min = 1,
    max = 5,
    step = 1,
    className = '',
    disabled = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    const percentage = ((value - min) / (max - min)) * 100;

    const sliderStyle = {
        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`,
        WebkitAppearance: 'none' as const,
        appearance: 'none' as const,
        height: '8px',
        borderRadius: '4px',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease-in-out',
    };

    return (
        <div className={`relative w-full ${className}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className="w-full custom-slider"
                style={sliderStyle}
            />
            <style>
                {`
                .custom-slider {
                    transition: all 0.2s ease-in-out;
                }
                .custom-slider:hover {
                    transform: scaleY(1.2);
                }
                .custom-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #3B82F6;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
                    transition: all 0.2s ease-in-out;
                    transform: scale(1);
                }
                .custom-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                    background: #2563EB;
                }
                .custom-slider::-webkit-slider-thumb:active {
                    transform: scale(1.1);
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
                }
                .custom-slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #3B82F6;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
                    transition: all 0.2s ease-in-out;
                }
                .custom-slider::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                    background: #2563EB;
                }
                .custom-slider:disabled::-webkit-slider-thumb {
                    background: #9CA3AF;
                    cursor: not-allowed;
                    transform: scale(1);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .custom-slider:disabled::-moz-range-thumb {
                    background: #9CA3AF;
                    cursor: not-allowed;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                `}
            </style>
        </div>
    );
};