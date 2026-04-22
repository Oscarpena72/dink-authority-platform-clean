// Removes the hardcoded absolute output path from prisma/schema.prisma
// so `prisma generate` writes to the default node_modules/.prisma/client
// location on Vercel build machines.
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Remove the `output = "..."` line inside the generator block.
const before = schema;
schema = schema.replace(/^\s*output\s*=\s*"[^"]*"\s*\n/m, '');

if (before !== schema) {
  fs.writeFileSync(schemaPath, schema);
  console.log('[fix-prisma-for-vercel] Removed hardcoded output path from schema.prisma');
} else {
  console.log('[fix-prisma-for-vercel] No hardcoded output path found, skipping.');
}
