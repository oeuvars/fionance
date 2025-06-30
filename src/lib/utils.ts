import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
};

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
};

export function formatCurrency(value: number) {
  const finalValue = convertAmountFromMiliunits(value);
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(finalValue);
}

export function formatCurrencyINR(value: number) {
  const finalValue = convertAmountFromMiliunits(value);
  return Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(finalValue);
}
