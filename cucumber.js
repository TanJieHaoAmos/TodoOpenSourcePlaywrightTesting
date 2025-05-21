
export default {
  paths: ['tests/features/'],
  import: ['tests/steps/*.ts'],
  format: ['html:cucumber-report.html'],
  dryRun: false,
  timeout: 30000,
};
