/*
|--------------------------------------------------------------------------
| JavaScript entrypoint for running ace commands
|--------------------------------------------------------------------------
*/

import './node_modules/ts-node-maintained/register/esm.mjs'

await import('./bin/console.js')
