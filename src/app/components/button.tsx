import React from "react";

interface ButtonProps {
  callback: any;
  placeholder: string;
}

export const Button = ({ callback, placeholder }: ButtonProps) => {
  return (
    <button
      onClick={callback}
      className="hover:bg-gray-600 border-b border-gray-300 bg-[#232424] pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:py-4 lg:px-8 lg:dark:bg-zinc-800/30"
    >
      {placeholder}
    </button>
  );
};
