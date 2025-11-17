/**
 * Payments service (TODOs only - no real billing implementation)
 * 
 * IMPORTANT: This file contains only placeholder functions and TODOs.
 * Do NOT implement real billing code without proper:
 * - App Store / Play Store compliance review
 * - Backend receipt validation
 * - Privacy policy and terms of service
 * - Tax handling
 * 
 * For production implementation:
 * 
 * iOS (App Store):
 * - Use react-native-iap or expo-in-app-purchases
 * - Implement server-side receipt validation
 * - Handle subscription status, renewals, cancellations
 * - See: https://developer.apple.com/in-app-purchase/
 * 
 * Android (Play Store):
 * - Use react-native-iap or expo-in-app-purchases
 * - Implement server-side purchase token validation
 * - Handle subscription lifecycle events
 * - See: https://developer.android.com/google/play/billing
 * 
 * Web:
 * - Use Stripe, PayPal, or similar payment processor
 * - Implement subscription management dashboard
 * - Handle webhook events for subscription changes
 */

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
}

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

/**
 * Get available subscription tiers
 * TODO: Fetch from your backend API
 */
export const getSubscriptionTiers = async (): Promise<SubscriptionTier[]> => {
  // Mock data
  return [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      features: ['Limited skips', 'Ad-supported', 'Standard quality'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      currency: 'USD',
      features: ['Unlimited skips', 'Ad-free', 'High quality', 'Offline downloads'],
    },
  ];
};

/**
 * Purchase subscription (iOS)
 * TODO: Implement using react-native-iap
 * 
 * Example structure:
 * ```typescript
 * import * as InAppPurchases from 'expo-in-app-purchases';
 * 
 * const purchase = await InAppPurchases.purchaseItemAsync(productId);
 * // Send receipt to your backend for validation
 * const validated = await validateReceiptWithBackend(purchase.receipt);
 * if (validated) {
 *   // Update user subscription status
 * }
 * ```
 */
export const purchaseSubscriptionIOS = async (
  _productId: string
): Promise<PurchaseResult> => {
  console.warn('[TODO] Implement iOS in-app purchase using expo-in-app-purchases or react-native-iap');
  return {
    success: false,
    error: 'Not implemented',
  };
};

/**
 * Purchase subscription (Android)
 * TODO: Implement using react-native-iap
 * 
 * Example structure:
 * ```typescript
 * import * as InAppPurchases from 'expo-in-app-purchases';
 * 
 * const purchase = await InAppPurchases.purchaseItemAsync(productId);
 * // Send purchase token to your backend for validation
 * const validated = await validatePurchaseTokenWithBackend(purchase.purchaseToken);
 * ```
 */
export const purchaseSubscriptionAndroid = async (
  _productId: string
): Promise<PurchaseResult> => {
  console.warn('[TODO] Implement Android in-app purchase using expo-in-app-purchases or react-native-iap');
  return {
    success: false,
    error: 'Not implemented',
  };
};

/**
 * Validate receipt with backend (iOS)
 * TODO: Implement server-side receipt validation
 * 
 * Your backend should:
 * 1. Receive receipt data from client
 * 2. Verify with Apple App Store API
 * 3. Check subscription status and expiration
 * 4. Return validated subscription info
 */
export const validateReceiptIOS = async (_receipt: string): Promise<boolean> => {
  console.warn('[TODO] Implement server-side iOS receipt validation');
  return false;
};

/**
 * Validate purchase token with backend (Android)
 * TODO: Implement server-side purchase token validation
 * 
 * Your backend should:
 * 1. Receive purchase token from client
 * 2. Verify with Google Play Billing API
 * 3. Check subscription status
 * 4. Return validated subscription info
 */
export const validatePurchaseTokenAndroid = async (
  _token: string
): Promise<boolean> => {
  console.warn('[TODO] Implement server-side Android purchase token validation');
  return false;
};

/**
 * Restore purchases
 * TODO: Implement purchase restoration
 */
export const restorePurchases = async (): Promise<PurchaseResult> => {
  console.warn('[TODO] Implement purchase restoration');
  return {
    success: false,
    error: 'Not implemented',
  };
};

