function parseCookie(cookieHeader, name) {
  if (!cookieHeader) {
    return null;
  }

  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [key, ...rest] = pair.trim().split('=');
    if (key === name) {
      return rest.join('=') || null;
    }
  }

  return null;
}

module.exports = { parseCookie };
