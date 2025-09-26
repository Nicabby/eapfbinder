/**
 * Feature flags configuration
 * Set to true to enable features, false to disable
 */
export const FEATURES = {
  // PDF Export functionality
  PDF_EXPORT: false, // Set to true to enable PDF export buttons
} as const;

export type FeatureName = keyof typeof FEATURES;