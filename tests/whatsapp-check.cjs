// Uses the verified business number by default; no external enquiries are sent.
require('./public-ui.cjs').run({ scope: 'contact' }).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
