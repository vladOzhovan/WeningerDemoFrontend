export const formatDate = raw => {
  const t = Date.parse(raw)
  return isNaN(t) ? '' : new Date(t).toLocaleDateString('en-GB').replace(/\//g, '.')
}
