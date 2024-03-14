import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Button({ children, className, ...props }: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button {...props} className={twMerge("text-white flex justify-center items-center white rounded-lg border border-transparent py-[0.6em] px-[1.2em] text-[1em] font-medium bg-[#1a1a1a] cursor-pointer", className)}>
        {children}
    </button>
  )
}
