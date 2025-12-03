import React from 'react';

interface ProgressBarProps {
    current: number;
    target: number;
    label: string;
    color?: string;
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, label, color = "bg-gold", className = "" }) => {
    const percentage = Math.min(100, (current / target) * 100);

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between text-xs md:text-sm mb-2 text-typography-grey">
                <span className="font-medium flex items-center gap-2">
                    {label}
                </span>
                <span>{current.toLocaleString()} / {target.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
