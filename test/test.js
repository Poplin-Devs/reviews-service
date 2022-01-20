const newman = require('newman');
const collection = require('./server-API-collection.json');
const globalVars = require('./test-globals.json');

newman.run({
  collection: collection,
  reporters: 'cli',
  globals: globalVars,
}, (err) => {
  if (err) { throw err; }
  console.log('Collection run complete!');
});