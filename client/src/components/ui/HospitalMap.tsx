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

export default function HospitalMap() {
  // Center of Fresno Medical Center region
  const centerPosition: [number, number] = [36.7783, -119.4179];

  const locations = [
    { id: 1, pos: [36.7820, -119.4200] as [number, number], name: 'IntelliSphere Central Medical Center', beds: '150 Beds', load: '84% Occupied', risk: 'HIGH LOAD' },
    { id: 2, pos: [36.7750, -119.4120] as [number, number], name: 'East Fresno Emergency Clinic', beds: '60 Beds', load: '65% Occupied', risk: 'STABLE' },
    { id: 3, pos: [36.7840, -119.4080] as [number, number], name: 'Clovis Pediatric & General', beds: '80 Beds', load: '40% Occupied', risk: 'STABLE' }
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
                <p><strong>Total Capacity:</strong> {loc.beds}</p>
                <p><strong>Current Bed Occupancy:</strong> {loc.load}</p>
                <p>
                  <strong>Risk Assessment:</strong>{' '}
                  <span className={`font-bold ${loc.risk === 'HIGH LOAD' ? 'text-amber-600' : 'text-emerald-600'}`}>
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
