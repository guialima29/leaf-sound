"use client";

import { useEffect, useState } from "react";

export interface TitleWithBarProps {
  title: string;
  editable?: boolean;
  onTitleChange?: (newTitle: string) => void;
  maxLength?: number;
  className?: string;
}

export default function TitleWithBar({
  title,
  editable = false,
  onTitleChange,
  maxLength = 40,
  className = "",
}: TitleWithBarProps) {
  const [currentTitle, setCurrentTitle] = useState(title);

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentTitle(val);
    onTitleChange?.(val);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-center px-4">
        {editable ? (
          <input
            type="text"
            value={currentTitle}
            onChange={handleChange}
            maxLength={maxLength}
            placeholder="Título da nota"
            className="text-[36px] font-libre-caslon font-semibold text-[#2B3328] text-center bg-transparent border-none outline-none focus:ring-0 focus:border-b focus:border-primary/40 transition-colors w-full max-w-2xl px-2"
          />
        ) : (
          <h1 className="text-[36px] font-libre-caslon font-semibold text-[#2B3328] text-center">
            {title}
          </h1>
        )}
      </div>
      <hr className="w-64 h-1 mx-auto my-4 bg-gray-300 border-0 rounded-sm md:my-10 dark:bg-gray-700" />
    </div>
  );
}