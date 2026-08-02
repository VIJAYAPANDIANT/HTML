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

export interface MapLocation {
  id: string | number;
  pos: [number, number];
  name: string;
  details: Record<string, string | number>;
  risk?: string;
  riskStatus?: 'CRITICAL' | 'HIGH' | 'HIGH LOAD' | 'MEDIUM' | 'WARNING' | 'STABLE' | string;
}

interface LeafletMapProps {
  centerPosition: [number, number];
  zoom?: number;
  locations: MapLocation[];
}

export default function LeafletMap({ centerPosition, zoom = 13, locations }: LeafletMapProps) {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-border bg-[#0F172A]">
      <MapContainer 
        center={centerPosition} 
        zoom={zoom} 
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
                {Object.entries(loc.details).map(([key, val]) => (
                  <p key={key}><strong>{key}:</strong> {val}</p>
                ))}
                {loc.risk && (
                  <p>
                    <strong>Risk Assessment:</strong>{' '}
                    <span className={`font-bold ${
                      loc.riskStatus === 'CRITICAL' || loc.riskStatus === 'HIGH' || loc.riskStatus === 'HIGH LOAD'
                        ? 'text-destructive'
                        : loc.riskStatus === 'MEDIUM' || loc.riskStatus === 'WARNING'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}>
                      {loc.risk}
                    </span>
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
