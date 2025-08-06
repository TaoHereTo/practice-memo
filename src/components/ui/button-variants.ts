import { cva } from "class-variance-authority"

export const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 active:scale-95 shadow-lg",
                outline:
                    "border border-border bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 active:scale-95 shadow-lg",
                tertiary:
                    "bg-tertiary text-foreground hover:bg-tertiary/90 hover:scale-105 active:scale-95 shadow-lg",
                ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 rounded-full px-4 py-2",
                lg: "h-14 rounded-full px-10 py-4 text-base",
                icon: "h-12 w-12 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
) 