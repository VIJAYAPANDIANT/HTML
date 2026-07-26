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

export default function AgricultureMap() {
  // Center of Fresno/Central Valley Agricultural Region
  const centerPosition: [number, number] = [36.7783, -119.4179];

  const locations = [
    { id: 1, pos: [36.7820, -119.4200] as [number, number], name: 'Sector 1A (Wheat Field)', moisture: '68%', status: 'Optimal', risk: 'LOW' },
    { id: 2, pos: [36.7750, -119.4120] as [number, number], name: 'Sector 4B (Corn Field)', moisture: '54%', status: 'Dry Warning', risk: 'MEDIUM' },
    { id: 3, pos: [36.7840, -119.4080] as [number, number], name: 'Sector 3C (Soybean Field)', moisture: '62%', status: 'Optimal', risk: 'LOW' }
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
                <p><strong>Moisture Level:</strong> {loc.moisture}</p>
                <p><strong>Health Status:</strong> {loc.status}</p>
                <p>
                  <strong>Risk Assessment:</strong>{' '}
                  <span className={`font-bold ${loc.risk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'}`}>
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
