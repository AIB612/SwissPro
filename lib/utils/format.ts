/**
 * Swiss number formatting utilities
 */

/**
 * Format number with Swiss thousand separator (apostrophe)
 * Examples: 1300 → "1'300", 50000 → "50'000"
 */
export function formatSwissNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

/**
 * Format currency in Swiss style
 * Examples: 1300 → "1'300 CHF", 50000 → "50'000 CHF"
 */
export function formatSwissCurrency(value: number): string {
  return `${formatSwissNumber(value)} CHF`;
}

/**
 * Calculate subsidy based on canton rules
 */
export function calculateSubsidy(
  installationCost: number,
  percentageCovered?: number,
  maxAmount?: number,
  amountPerSpace?: number,
  numberOfSpaces: number = 1
): number {
  let subsidy = 0;

  // If there's a per-space amount, use that
  if (amountPerSpace) {
    subsidy = amountPerSpace * numberOfSpaces;
  }
  
  // If there's a percentage, calculate based on installation cost
  if (percentageCovered) {
    const percentageSubsidy = (installationCost * percentageCovered) / 100;
    subsidy = Math.max(subsidy, percentageSubsidy);
  }

  // Apply max cap if exists
  if (maxAmount && maxAmount > 0) {
    subsidy = Math.min(subsidy, maxAmount);
  }

  return Math.round(subsidy);
}
