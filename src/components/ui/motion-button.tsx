'use client'

import { FC } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
function cn(...inputs: any[]) { return twMerge(clsx(inputs)) }

interface Props {
  label: string
  variant?: 'primary' | 'secondary'
  classes?: string
  animate?: boolean
  delay?: number
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

// TweebStars button: a solid yellow box (the logo's yellow). On hover a solid pink layer (the logo's pink) slides up
// from the bottom over the yellow. Two flat colours, no blending; the only animation is the slide.
const MotionButton: FC<Props> = ({ label, classes, type = 'button', disabled, onClick }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-[none] bg-[#f7e014] px-7 py-3.5 text-black outline-none disabled:opacity-50',
        classes
      )}
    >
      <span
        aria-hidden='true'
        className='absolute inset-0 translate-y-full bg-[#e12669] transition-transform duration-500 ease-out group-hover:translate-y-0'
      />
      <span className='relative z-10 font-poppins text-base font-semibold tracking-tight whitespace-nowrap'>{label}</span>
    </button>
  )
}

export default MotionButton
