const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.utils.kv['@0.1.16'].set({
  key: `ignoreCase`,
  value: `${context.params.event.data.values[0]}`
});