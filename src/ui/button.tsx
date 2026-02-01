import { clsx } from 'clsx'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
    'bg-brand-500/90 text-white',
    'hover:bg-brand-500',
    'active:bg-brand-600',
    'focus-visible:ring-1 focus-visible:ring-brand-400/50',
  ),
  secondary: clsx(
    'border border-foreground/10 bg-foreground/[0.04] text-foreground',
    'hover:bg-foreground/[0.08]',
    'active:bg-foreground/[0.12]',
    'focus-visible:ring-1 focus-visible:ring-foreground/20',
  ),
  ghost: clsx(
    'bg-transparent text-foreground',
    'hover:bg-foreground/[0.06]',
    'active:bg-foreground/[0.10]',
    'focus-visible:ring-1 focus-visible:ring-foreground/20',
  ),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-4 text-base rounded-md',
  lg: 'h-12 px-6 text-lg rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium select-none',
          'transition-colors duration-150',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'outline-none',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
