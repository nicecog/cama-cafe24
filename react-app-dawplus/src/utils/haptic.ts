/**
 * Haptic Feedback Utility
 *
 * Provides haptic feedback for mobile devices using the Vibration API and iOS checkbox hack.
 *
 * Browser Support:
 * - ✅ Android: Chrome, Firefox, Samsung Internet (Vibration API)
 * - ✅ iOS Safari 18+: Supported via checkbox switch hack
 * - ✅ PWA on Android: Supported when installed
 *
 * @example
 * ```tsx
 * import { haptic } from '@/utils/haptic';
 *
 * // Light tap for button clicks
 * <button onClick={() => { haptic.light(); handleClick(); }}>
 *   Click me
 * </button>
 *
 * // Success pattern for completed actions
 * haptic.success();
 * ```
 */

/**
 * iOS Detection
 */
const isIOS = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

/**
 * Hidden checkbox for iOS haptic feedback (iOS 18+)
 * This is a workaround using the checkbox switch attribute
 */
let iosHapticCheckbox: HTMLInputElement | null = null;

/**
 * Initialize iOS haptic checkbox
 */
const initIOSHaptic = (): void => {
  if (typeof document === "undefined" || iosHapticCheckbox) return;

  // Create hidden checkbox with switch attribute (iOS 18+ feature)
  iosHapticCheckbox = document.createElement("input");
  iosHapticCheckbox.type = "checkbox";
  iosHapticCheckbox.setAttribute("switch", "");
  iosHapticCheckbox.style.position = "absolute";
  iosHapticCheckbox.style.opacity = "0";
  iosHapticCheckbox.style.pointerEvents = "none";
  iosHapticCheckbox.style.width = "1px";
  iosHapticCheckbox.style.height = "1px";
  iosHapticCheckbox.setAttribute("aria-hidden", "true");

  document.body.appendChild(iosHapticCheckbox);
};

/**
 * Trigger iOS haptic feedback
 */
const triggerIOSHaptic = (): void => {
  if (!iosHapticCheckbox) {
    initIOSHaptic();
  }

  if (iosHapticCheckbox) {
    // Toggle checkbox to trigger haptic
    iosHapticCheckbox.click();
  }
};

/**
 * Check if the Vibration API is supported
 */
const isVibrationSupported = (): boolean => {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
};

/**
 * Check if any haptic feedback is supported
 */
const isSupported = (): boolean => {
  return isVibrationSupported() || isIOS();
};

/**
 * Safely trigger vibration with iOS-first approach
 * iOS Safari lies about Vibration API support, so we check iOS first
 */
const vibrate = (pattern: number | number[]): void => {
  // iOS first! Safari lies about Vibration API support
  if (isIOS()) {
    console.log("📱 iOS detected, using checkbox hack");
    // For patterns, trigger multiple times with delays
    if (Array.isArray(pattern)) {
      // Trigger haptic for each vibration in the pattern
      let delay = 0;
      for (let i = 0; i < pattern.length; i += 2) {
        setTimeout(() => {
          triggerIOSHaptic();
        }, delay);
        // Add vibration time + pause time for next iteration
        delay += pattern[i] + (pattern[i + 1] || 0);
      }
    } else {
      // Single vibration
      triggerIOSHaptic();
    }
    return;
  }

  // Android: Try Vibration API
  if (isVibrationSupported()) {
    try {
      console.log("🤖 Android detected, using Vibration API");
      navigator.vibrate(pattern);
      return;
    } catch (error) {
      console.debug("Vibration API failed:", error);
    }
  }

  console.warn("⚠️ No haptic feedback available on this device");
};

/**
 * Haptic feedback utility object
 */
export const haptic = {
  /**
   * Light tap - 10ms
   * Use for: Button clicks, list item selection
   */
  light: (): void => {
    vibrate(10);
  },

  /**
   * Medium tap - 20ms
   * Use for: Toggle switches, checkbox selection
   */
  medium: (): void => {
    vibrate(20);
  },

  /**
   * Heavy tap - 50ms
   * Use for: Important actions, confirmations
   */
  heavy: (): void => {
    vibrate(50);
  },

  /**
   * Success pattern - [10ms, pause 50ms, 10ms]
   * Use for: Successful operations, form submissions
   */
  success: (): void => {
    vibrate([10, 50, 10]);
  },

  /**
   * Error pattern - [50ms, pause 100ms, 50ms]
   * Use for: Errors, validation failures
   */
  error: (): void => {
    vibrate([50, 100, 50]);
  },

  /**
   * Warning pattern - [30ms, pause 50ms, 30ms, pause 50ms, 30ms]
   * Use for: Warnings, important notifications
   */
  warning: (): void => {
    vibrate([30, 50, 30, 50, 30]);
  },

  /**
   * Selection pattern - [5ms, pause 30ms, 5ms]
   * Use for: Swipe gestures, drag and drop
   */
  selection: (): void => {
    vibrate([5, 30, 5]);
  },

  /**
   * Custom vibration pattern
   * @param pattern - Single duration or array of [vibrate, pause, vibrate, ...]
   *
   * @example
   * ```tsx
   * // Single vibration for 100ms
   * haptic.custom(100);
   *
   * // Pattern: vibrate 50ms, pause 100ms, vibrate 50ms
   * haptic.custom([50, 100, 50]);
   * ```
   */
  custom: (pattern: number | number[]): void => {
    vibrate(pattern);
  },

  /**
   * Stop all ongoing vibrations
   */
  stop: (): void => {
    vibrate(0);
  },

  /**
   * Check if haptic feedback is supported on this device
   */
  isSupported,
};

/**
 * React hook for haptic feedback
 *
 * @example
 * ```tsx
 * const hapticFeedback = useHaptic();
 *
 * <button onClick={() => hapticFeedback.light()}>
 *   Click me
 * </button>
 * ```
 */
export const useHaptic = () => {
  return haptic;
};
