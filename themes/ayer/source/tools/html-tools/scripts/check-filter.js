const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'index.json'), 'utf8'));

function filterTools({ category = 'all', search = '' }) {
  const searchQuery = search.toLowerCase();
  return data.tools.filter((tool) => {
    const matchesCategory = category === 'all' || tool.category === category;
    const matchesSearch = !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });
}

function countMatches(label, options, expectAtLeastIds = []) {
  const result = filterTools(options);
  const ids = new Set(result.map((tool) => tool.id));
  const missing = expectAtLeastIds.filter((id) => !ids.has(id));
  console.log(`\n[${label}] count=${result.length}`);
  if (missing.length) {
    console.log(`  missing: ${missing.join(', ')}`);
  } else if (expectAtLeastIds.length) {
    console.log('  includes expected ids: OK');
  }
  return { result, missing };
}

const checks = [];
checks.push(countMatches('Search: JSON', { search: 'JSON' }, [
  'json-formatter',
  'json-to-yaml',
  'json-to-csv',
  'json-escape',
]));

checks.push(countMatches('Search: 图片', { search: '图片' }, [
  'image-to-base64',
  'image-compressor',
  'image-resizer',
  'image-to-webp',
]));

checks.push(countMatches('Search: format', { search: 'format' }, [
  'js-formatter',
  'html-formatter',
  'sql-formatter',
]));

checks.push(countMatches('Category: image', { category: 'image' }));
checks.push(countMatches('Category: developer', { category: 'developer' }, [
  'http-status',
  'url-query-builder',
  'gradient-generator',
]));

const total = data.tools.length;
console.log(`\n[Total tools] ${total}`);

const failures = checks.flatMap((check) => check.missing || []);
if (failures.length) {
  console.log('\nResult: FAIL');
  process.exit(1);
}
console.log('\nResult: PASS');
