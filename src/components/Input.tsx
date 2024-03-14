import { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Input({ children, className, ...props }: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input {...props} className={twMerge("text-black bg-[#e9e9e9] rounded-[5px] p-[10px] border-[3px] border-black text-[13.3px]", className)}>
        {children}
    </input>
  )
}
