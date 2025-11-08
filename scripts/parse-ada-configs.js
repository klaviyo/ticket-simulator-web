const fs = require('fs');
const path = require('path');

const adaJsFolder = '/Users/pierre.sjogreen/Desktop/Code/ada_sim_js';
const outputPath = path.join(__dirname, '../lib/ada-customer-types.json');

const files = fs.readdirSync(adaJsFolder).filter(f => f.endsWith('.js'));

const customerTypes = {};

files.forEach(file => {
  const filePath = path.join(adaJsFolder, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract the customer type name from filename
  // Format: [M][EN][Customer Type].js
  const match = file.match(/\[M\]\[EN\]\[(.+?)\]\.js/);
  if (!match) return;

  const typeName = match[1].trim();

  // Extract metaFields from window.adaSettings
  const metaFieldsMatch = content.match(/metaFields:\s*{([^}]+)}/s);
  if (!metaFieldsMatch) return;

  const metaFieldsStr = metaFieldsMatch[1];
  const metaFields = {};

  // Parse each field
  const fieldMatches = metaFieldsStr.matchAll(/(\w+):\s*"([^"]*)"/g);
  for (const fieldMatch of fieldMatches) {
    metaFields[fieldMatch[1]] = fieldMatch[2];
  }

  customerTypes[typeName] = {
    name: typeName,
    metaFields
  };
});

// Write to JSON file
fs.writeFileSync(outputPath, JSON.stringify(customerTypes, null, 2));
console.log(`Parsed ${Object.keys(customerTypes).length} customer types`);
console.log('Output:', outputPath);
