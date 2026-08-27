function snakeToCamel(key) {
  return key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function toCamelCase(row) {
  if (row === null || row === undefined) {
    return row;
  }

  if (Array.isArray(row)) {
    return row.map((item) => toCamelCase(item));
  }

  if (typeof row === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(row)) {
      result[snakeToCamel(key)] = value;
    }
    return result;
  }

  return row;
}

module.exports = { toCamelCase };
