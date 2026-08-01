import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon asset resolution bug in Vite bundling
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function SmartCityMap() {
  // Center of Sector 7 region (Chicago, IL)
  const centerPosition: [number, number] = [41.8781, -87.6298];

  const locations = [
    { id: 1, pos: [41.8820, -87.6320] as [number, number], name: 'Sector 7 Grid Substation', metric: 'Load: 186.2 MW / 200 MW', risk: 'WARNING' },
    { id: 2, pos: [41.8750, -87.6250] as [number, number], name: 'Interstate-90 off-ramp', metric: 'Congestion: 78%', risk: 'CONGESTED' },
    { id: 3, pos: [41.8840, -87.6210] as [number, number], name: 'Madison River Crossing Bridge', metric: 'Health score: 96%', risk: 'STABLE' },
    { id: 4, pos: [41.8710, -87.6350] as [number, number], name: 'Metro Pressure Reservoir 4', metric: 'Pressure: 2.1 bar (flow: 820 L/s)', risk: 'WARNING' }
  ];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-border bg-[#0F172A]">
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.pos}>
            <Popup>
              <div className="p-1 font-sans text-xs text-slate-800 space-y-1">
                <p className="font-bold text-sm text-primary mb-1">{loc.name}</p>
                <p><strong>Status Value:</strong> {loc.metric}</p>
                <p>
                  <strong>Risk Assessment:</strong>{' '}
                  <span className={`font-bold ${
                    loc.risk === 'CONGESTED' || loc.risk === 'WARNING' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {loc.risk}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
