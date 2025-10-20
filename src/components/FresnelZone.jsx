import React, { useMemo, useEffect, useState } from 'react'
import { Polygon } from 'react-leaflet'
import L from 'leaflet'
import { fetchElevations } from '../utils/elevation'

// helpers: meters <-> degrees
const metersToDegreesLat = m => m / 111111
const metersToDegreesLng = (m, lat) => m / (111111 * Math.cos((lat * Math.PI) / 180))

const FresnelZone = ({ link, samples = 24 }) => {
  const [elevations, setElevations] = useState([])

  const ptsAndRadii = useMemo(() => {
    if (!link) return { pts: [], totalDist: 0 }

    const p1 = L.latLng(link.tower1.position)
    const p2 = L.latLng(link.tower2.position)
    const totalDist = p1.distanceTo(p2) // meters
    if (totalDist === 0) return { pts: [], totalDist }

    // sample evenly along lat/lng (good enough for small distances)
    const samplesArr = []
    for (let i = 0; i < samples; i++) {
      const t = i / (samples - 1)
      samplesArr.push({
        lat: p1.lat + (p2.lat - p1.lat) * t,
        lng: p1.lng + (p2.lng - p1.lng) * t,
        frac: t
      })
    }

    // prepare geometry helpers
    const centerLat = (p1.lat + p2.lat) / 2
    // compute vector in meters from p1->p2
    const dxTotal = (p2.lng - p1.lng) * (111111 * Math.cos((centerLat * Math.PI) / 180)) // east meters
    const dyTotal = (p2.lat - p1.lat) * 111111 // north meters

    // compute cumulative distance along samples (using L distance)
    const cumDistances = samplesArr.map(s => {
      const ll = L.latLng(s.lat, s.lng)
      return p1.distanceTo(ll)
    })

    // wavelength
    const c = 3e8
    const fHz = (link.frequency || 1) * 1e9
    const lambda = c / fHz

    // For each sample compute fresnel radius (meters)
    const radii = cumDistances.map(d1 => {
      const d2 = Math.max(totalDist - d1, 1e-6)
      const r = Math.sqrt((lambda * d1 * d2) / (d1 + d2))
      return r
    })

    // Build polygon by computing perp offsets at each sample
    // unit vector along link in meters:
    const len = Math.sqrt(dxTotal * dxTotal + dyTotal * dyTotal)
    const ux = dxTotal / len
    const uy = dyTotal / len
    // perpendicular (east,north)
    const px = -uy
    const py = ux

    const leftPts = []
    const rightPts = []
    for (let i = 0; i < samplesArr.length; i++) {
      const s = samplesArr[i]
      const r = radii[i]
      // perp offset in meters
      const offEast = px * r
      const offNorth = py * r
      // convert meters -> degrees
      const latOff = metersToDegreesLat(offNorth)
      const lngOff = metersToDegreesLng(offEast, s.lat)
      leftPts.push([s.lat + latOff, s.lng + lngOff])
      rightPts.push([s.lat - latOff, s.lng - lngOff])
    }

    // polygon: left side forward + right side reversed
    const polygon = leftPts.concat(rightPts.reverse())
    return { pts: polygon, totalDist, samplesArr, radii }
  }, [link, samples])

  // fetch elevations for samples (optional, used only for info/extension)
  useEffect(() => {
    let mounted = true
    if (!link) return
    const p1 = L.latLng(link.tower1.position)
    const p2 = L.latLng(link.tower2.position)
    const coords = []
    const n = Math.max(6, samples)
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      coords.push({ lat: p1.lat + (p2.lat - p1.lat) * t, lng: p1.lng + (p2.lng - p1.lng) * t })
    }
    fetchElevations(coords).then(ev => {
      if (mounted) setElevations(ev)
    }).catch(() => {
      if (mounted) setElevations([])
    })
    return () => { mounted = false }
  }, [link, samples])

  if (!ptsAndRadii.pts || ptsAndRadii.pts.length === 0) return null

  return (
    <Polygon
      positions={ptsAndRadii.pts}
      pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.25, weight: 2 }}
    />
  )
}

export default FresnelZone