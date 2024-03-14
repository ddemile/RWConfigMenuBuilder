import { AnchorHTMLAttributes, DetailedHTMLProps } from "react"
import { IconType } from "react-icons"
import { BsDiscord, BsGithub } from "react-icons/bs"
import { twMerge } from "tailwind-merge"
import './ProjectLinks.css'

function Link({ className, icon, ...props }: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & { icon: IconType }) {
  const Icon = icon
  
  return (
    <a {...props} target="_blank" className={twMerge("flex m-0 p-0 no-underline text-[#1a1a1a] hover:text-[#131313]", className)}>
      <Icon size={25} />
    </a>
  )
}

export default function ProjectLinks() {
  return (
    <div className="absolute top-0 p-[10px] left-1/2 -translate-x-1/2 flex justify-center items-center bg-white border border-[#dadada] rounded-b-[10px] gap-[15px]">
      <Link href="https://github.com/ddemile/RWConfigMenuBuilder" icon={BsGithub} />
      <Link href="#" icon={BsDiscord} />
    </div>
  )
}