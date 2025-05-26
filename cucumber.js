export default {
  paths: ["tests/features/"],
  import: ["tests/steps/*.ts","tests/features/support/hooks.ts"],
  format: ["html:cucumber-report.html"],
  dryRun: false,
  formatOptions: {
    snippetInterface: "async-await"
  },
};

