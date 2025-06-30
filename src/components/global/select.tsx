'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Select = ({
    value,
    onChange,
    disabled,
    onCreate,
    options = [],
    placeholder,
}: {
    onChange: (value?: string) => void;
    onCreate: (value: string) => void;
    options?: { label: string; value: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    
    const selectedOption = options.find(option => option.value === value);

    const handleSelect = (option: { label: string; value: string }) => {
        onChange(option.value);
        setIsOpen(false);
        setInputValue('');
    };

    const handleCreate = () => {
        if (inputValue.trim()) {
            onCreate(inputValue.trim());
            setInputValue('');
            setIsOpen(false);
        }
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="relative">
            <div
                className="flex items-center justify-between h-10 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white cursor-pointer hover:border-slate-300"
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={selectedOption ? 'text-slate-900' : 'text-slate-500'}>
                    {selectedOption?.label || placeholder}
                </span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="absolute z-10 w-full mt-1 space-y-1 py-1 bg-white border border-slate-300 rounded-md shadow-lg"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                    {/* <div className="px-3 pt-2 pb-0">
                        <Input
                            type="text"
                            className="mx-0"
                            placeholder="Type to search or create..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                        />
                    </div> */}
                    <div className="max-h-48 overflow-y-auto">
                        {filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className="mx-1 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-neutral-800 hover:text-white"
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </div>
                        ))}
                        {inputValue && !filteredOptions.some(opt => opt.label === inputValue) && (
                            <div
                                className="mx-1 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-neutral-800 hover:text-white"
                                onClick={handleCreate}
                            >
                                Create &apos;{inputValue}&apos;
                            </div>
                        )}
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
