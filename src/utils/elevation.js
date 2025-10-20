// Simple elevation fetch wrapper using Open-Elevation
export async function fetchElevations(coords = []) {
  // coords: [{ lat, lng }, ...]
  if (!coords.length) return []
  const locations = coords.map(c => `${c.lat},${c.lng}`).join('|')
  const url = `https://api.open-elevation.com/api/v1/lookup?locations=${locations}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`elevation fetch ${res.status}`)
    const json = await res.json()
    // returns array of elevations in meters (same order)
    return (json.results || []).map(r => r.elevation ?? 0)
  } catch (err) {
    console.warn('fetchElevations error:', err)
    return coords.map(() => 0)
  }
}