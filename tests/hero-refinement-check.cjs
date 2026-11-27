// Compatible entry point for the current hero, services and comparison behavior.
require('./public-ui.cjs').run({ scope: 'hero' }).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
