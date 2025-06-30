import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-lg text-xs font-medium tracking-normal leading-none max-w-max transition-all duration-150 focus:outline-none relative overflow-hidden leading-none flex-col shadow-[inset_0.5px_1px_0px_rgba(255,255,255,0.2),inset_-0.5px_1px_0px_rgba(255,255,255,0.2)]",
	{
		variants: {
			variant: {
				default:
					"bg-gradient-to-b from-primary/90 via-primary to-primary/80 text-primary-foreground border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/70 after:via-white/70 after:to-white/70 after:dark:from-neutral-800/70 after:dark:via-neutral-800/70 after:dark:to-neutral-800/70 after:blur-[2.5px]",

				secondary:
					"bg-gradient-to-b from-secondary/90 via-secondary to-secondary/80 text-secondary-foreground border-b-[2px] border-secondary/15 dark:border-neutral-900/90 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/30 after:via-white/30 after:to-white/30 after:blur-[2.5px]",

				destructive:
					"bg-gradient-to-b from-destructive/90 via-destructive to-destructive/80 text-destructive-foreground border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/90 after:via-white/90 after:to-white/90 after:blur-[2.5px]",

				outline:
					"bg-gradient-to-b from-background/90 via-background to-background/80 text-foreground border-b-[2px] border-outline/15 dark:border-outline/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/30 after:via-white/30 after:to-white/30 after:blur-[2.5px]",

				blue: "bg-gradient-to-b from-[#007bff]/90 via-[#007bff] to-[#007bff]/80 dark:from-[#0a7cff]/90 dark:via-[#0a7cff] dark:to-[#0a7cff]/80 text-white border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:bg-gradient-to-r after:from-white/80 after:via-white/80 after:to-white/80 after:dark:from-white/90 after:dark:via-white/90 after:dark:to-white/90 after:blur-[2.5px]",

				red: "bg-gradient-to-b from-[#fe342d]/90 via-[#fe342d] to-[#fe342d]/80 dark:from-[#fe3e38]/90 dark:via-[#fe3e38] dark:to-[#fe3e38]/80 text-white border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/90 after:via-white/90 after:to-white/90 after:blur-[2.5px]",

				yellow:
					"bg-gradient-to-b from-[#f7b707]/90 via-[#f7b707] to-[#f7b707]/80 dark:from-[#f9ac05]/90 dark:via-[#f9ac05] dark:to-[#f9ac05]/80 text-white border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/90 after:via-white/90 after:to-white/90 after:blur-[2.5px]",

				green:
					"bg-gradient-to-b from-[#1da41d]/90 via-[#1da41d] to-[#1da41d]/80 dark:from-[#1fb11f]/90 dark:via-[#1fb11f] dark:to-[#1fb11f]/80 text-white border-b-[2px] border-black/20 dark:border-black/40 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/80 after:via-white/80 after:to-white/80 after:dark:from-white/90 after:dark:via-white/90 after:dark:to-white/90 after:blur-[2.5px]",

				mint: "bg-gradient-to-b from-[#00c6b3]/90 via-[#00c6b3] to-[#00c6b3]/80 dark:from-[#66d0c5]/90 dark:via-[#66d0c5] dark:to-[#66d0c5]/80 text-white border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/90 after:via-white/90 after:to-white/90 after:blur-[2.5px]",

				orange:
					"bg-gradient-to-b from-[#ff8c00]/90 via-[#ff8c00] to-[#ff8c00]/80 dark:from-[#ff900a]/90 dark:via-[#ff900a] dark:to-[#ff900a]/80 text-white border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/90 after:via-white/90 after:to-white/90 after:blur-[2.5px]",

				purple:
					"bg-gradient-to-b from-[#a248de]/90 via-[#a248de] to-[#a248de]/80 dark:from-[#b85fec]/90 dark:via-[#b85fec] dark:to-[#b85fec]/80 text-white border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/90 after:via-white/90 after:to-white/90 after:blur-[2.5px]",

				indigo:
					"bg-gradient-to-b from-[#5766d5]/90 via-[#5766d5] to-[#5766d5]/80 dark:from-[#636fdd]/90 dark:via-[#636fdd] dark:to-[#636fdd]/80 text-white border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/90 after:via-white/90 after:to-white/90 after:blur-[2.5px]",

				pink: "bg-gradient-to-b from-[#ff3269]/90 via-[#ff3269] to-[#ff3269]/80 dark:from-[#fe4c73]/90 dark:via-[#fe4c73] dark:to-[#fe4c73]/80 text-white border-b-[2px] border-black/15 dark:border-black/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/90 after:via-white/90 after:to-white/90 after:blur-[2.5px]",

				muted:
					"bg-gradient-to-b from-black/5 via-black/0 to-black/5 dark:from-muted/90 dark:via-muted dark:to-muted/80 text-muted-foreground border-b-[2px] border-black/10 dark:border-muted/50 border-t-[1px] border-x-[0.75px] before:absolute before:inset-0 before:pointer-events-none after:absolute after:inset-x-[0%] after:bottom-0 after:h-[1.5px] after:bg-gradient-to-r after:from-white/30 after:via-white/30 after:to-white/30 after:blur-[2.5px]",
			},
			size: {
				xs: "h-4 px-1.5 text-xs rounded-[4px] flex items-center",
				sm: "h-5 px-2 rounded-[4px] flex items-center",
				md: "h-6 px-2.5 rounded-[5px] flex items-center",
				lg: "h-7 px-3 rounded-[6px] flex items-center",
			},
			pressed: {
				true: "translate-y-[1px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)] before:opacity-30 after:opacity-50 border-b-0",
				false: "",
			},
			elevated: {
				true: "shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_3px_6px_rgba(0,0,0,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_3px_6px_rgba(0,0,0,0.6)] after:h-[6px] after:blur-[2px] border-b-[2px]",
				false: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			pressed: false,
			elevated: false,
		},
	}
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
	pressed?: boolean
	elevated?: boolean
}

function Badge({ className, variant, size, pressed, elevated, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant, size, pressed, elevated }), className)} {...props}>
			<span className="relative z-10 inline-flex items-center justify-center">{props.children}</span>
		</div>
	)
}

export { Badge, badgeVariants }
