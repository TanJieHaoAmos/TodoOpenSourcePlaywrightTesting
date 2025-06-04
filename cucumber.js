
export default {
  // Default configuration (options outside 'profiles' apply to all runs unless overridden by a profile or CLI)
  // These options will be used if no profile is specified.
  paths: ["tests/features/*.feature"], // Default paths
  requireModule: ["ts-node/register"], // Use ts-node for TypeScript support
  require: [
    "tests/steps/*.ts",
    "tests/features/support/hooks.ts"
  ],
  format: ["html:cucumber-report.html"],
  formatOptions: {
    snippetInterface: "async-await",
  },
  // You can also define default tags here, e.g., defaultTag: "@smoke"

  // Define your profiles here
  profiles: {
    // --- Profile 1: Desktop Chrome Tests ---
    desktop_chrome: {
      tags: "@test_google_chrome_desktop", // Specific tags for this profil
      format: ["summary", "html:cucumber-report-desktop-chrome.html"] // Different reports
    },
  }
};