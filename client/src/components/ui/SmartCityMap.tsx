import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// SVG paths for Lucide icons to use in divIcons
const iconPaths = {
  hospital: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M48 8H12v36M8 8h36M18 22h4v12h-4zM24 16v20M20 26h8"/></svg>`,
  police: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  fire: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>`,
  complaint: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  emergency: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  weather: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.47 0-.89.09-1.3.26A7 7 0 1 0 3 15.5A3.5 3.5 0 0 0 6.5 19H17.5z"/></svg>`
};

const createDivIcon = (color: string, iconHtml: string, pulse: boolean = false) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-7 h-7 rounded-full border border-slate-900 shadow-lg text-white" style="background-color: ${color};">
        ${pulse ? `<span class="absolute inset-0 rounded-full bg-${color} animate-ping opacity-60"></span>` : ''}
        ${iconHtml}
      </div>
    `,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

export default function SmartCityMap() {
  const centerPosition: [number, number] = [41.8781, -87.6298];

  // Overlay toggles state
  const [showTraffic, setShowTraffic] = useState(true);
  const [showPollution, setShowPollution] = useState(true);
  const [showWaste, setShowWaste] = useState(true);
  const [showEmergency, setShowEmergency] = useState(true);
  const [showServices, setShowServices] = useState(true);
  const [showComplaints, setShowComplaints] = useState(true);
  const [showWeather, setShowWeather] = useState(true);

  // 1. Traffic Congestion Polyline coordinates
  const trafficRoute: [number, number][] = [
    [41.8750, -87.6250],
    [41.8790, -87.6280],
    [41.8820, -87.6320]
  ];

  // 2. Pollution AQI Circles
  const pollutionZones = [
    { pos: [41.8840, -87.6380] as [number, number], color: '#EF4444', radius: 450, aqi: 124, name: 'Industrial Bypass Zone' },
    { pos: [41.8720, -87.6220] as [number, number], color: '#F59E0B', radius: 300, aqi: 64, name: 'Downtown Loop Park' }
  ];

  // 3. Waste containers status markers
  const wasteBins = [
    { pos: [41.8820, -87.6320] as [number, number], name: 'City Hall Square Bin', load: '42% Capacity', status: 'NORMAL' },
    { pos: [41.8750, -87.6120] as [number, number], name: 'Bypass Transit Depot Bin', load: '94% Capacity', status: 'WARNING' }
  ];

  // 4. Municipal safety services (Hospitals, Police, Fire)
  const safetyServices = [
    { pos: [41.8800, -87.6280] as [number, number], name: 'Sector 7 Municipal Hospital', beds: '150 Beds', type: 'Hospital', icon: iconPaths.hospital, color: '#10B981' },
    { pos: [41.8740, -87.6300] as [number, number], name: 'Sector 7 Police Precinct', patrols: '12 Active units', type: 'Police Station', icon: iconPaths.police, color: '#3B82F6' },
    { pos: [41.8850, -87.6250] as [number, number], name: 'Sector 7 Fire Station 4', engines: '4 Active engines', type: 'Fire Station', icon: iconPaths.fire, color: '#F97316' }
  ];

  // 5. Citizen Complaints
  const complaints = [
    { pos: [41.8780, -87.6360] as [number, number], name: 'COMP-981: Water Valve Leakage', desc: 'Water main pool outside high school gate.', status: 'IN_PROGRESS' },
    { pos: [41.8830, -87.6220] as [number, number], name: 'COMP-978: Overflowing Garbage area', desc: 'Bins past capacity on galleria avenue.', status: 'OPEN' }
  ];

  // 6. Emergency Incidents
  const emergencies = [
    { pos: [41.8750, -87.6250] as [number, number], name: 'CRITICAL: Multi-Car Collision', desc: 'Expressway blocked. EMS units deployed.', severity: 'CRITICAL' },
    { pos: [41.8710, -87.6350] as [number, number], name: 'CRITICAL: Water Main rupture', desc: 'Metro pressure reservoir 4 drop below 2.1 bar.', severity: 'HIGH' }
  ];

  // 7. Weather telemetry
  const weatherStation = {
    pos: [41.8890, -87.6300] as [number, number],
    name: 'Sector 7 Weather Monitoring Terminal',
    temp: '74 °F',
    condition: 'Partly Cloudy',
    humidity: '62%'
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-border bg-[#0F172A] relative">
      
      {/* Floating control legend */}
      <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md border border-border p-3.5 rounded-xl z-[1000] text-[10px] space-y-2 text-slate-200 shadow-2xl max-w-[150px]">
        <span className="font-bold text-white uppercase tracking-wider block border-b border-border/80 pb-1.5 mb-1.5">GIS Layers</span>
        
        <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showTraffic}
            onChange={(e) => setShowTraffic(e.target.checked)}
            className="accent-primary h-3.5 w-3.5"
          />
          <span>Traffic Congestion</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showPollution}
            onChange={(e) => setShowPollution(e.target.checked)}
            className="accent-primary h-3.5 w-3.5"
          />
          <span>Pollution Zones</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showWaste}
            onChange={(e) => setShowWaste(e.target.checked)}
            className="accent-primary h-3.5 w-3.5"
          />
          <span>Waste Collection</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showServices}
            onChange={(e) => setShowServices(e.target.checked)}
            className="accent-primary h-3.5 w-3.5"
          />
          <span>Municipal Stations</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showComplaints}
            onChange={(e) => setShowComplaints(e.target.checked)}
            className="accent-primary h-3.5 w-3.5"
          />
          <span>Complaints Registry</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showEmergency}
            onChange={(e) => setShowEmergency(e.target.checked)}
            className="accent-primary h-3.5 w-3.5"
          />
          <span className="text-destructive font-semibold">Active Incidents</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showWeather}
            onChange={(e) => setShowWeather(e.target.checked)}
            className="accent-primary h-3.5 w-3.5"
          />
          <span>Weather Overlay</span>
        </label>
      </div>

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

        {/* 1. Congestion Polyline overlay */}
        {showTraffic && (
          <Polyline 
            positions={trafficRoute} 
            pathOptions={{ color: '#EF4444', weight: 6, opacity: 0.8 }} 
          />
        )}

        {/* 2. Pollution AQI Circles */}
        {showPollution && pollutionZones.map((p, idx) => (
          <Circle
            key={idx}
            center={p.pos}
            radius={p.radius}
            pathOptions={{ color: p.color, fillColor: p.color, fillOpacity: 0.2 }}
          >
            <Popup>
              <div className="font-sans text-xs text-slate-800 space-y-1">
                <p className="font-bold text-sm text-primary mb-1">{p.name}</p>
                <p><strong>AQI Index:</strong> {p.aqi} (Particulates)</p>
                <p><strong>Status Level:</strong> <span className="font-bold text-amber-600">MODERATE EXPOSURE</span></p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* 3. Waste Containers */}
        {showWaste && wasteBins.map((bin, idx) => (
          <Marker 
            key={idx} 
            position={bin.pos}
            icon={createDivIcon('#EAB308', iconPaths.trash)}
          >
            <Popup>
              <div className="font-sans text-xs text-slate-800 space-y-1">
                <p className="font-bold text-sm text-primary mb-1">{bin.name}</p>
                <p><strong>Bin capacity:</strong> {bin.load}</p>
                <p><strong>Status:</strong> <span className={`font-bold ${bin.status === 'WARNING' ? 'text-amber-600 animate-pulse' : 'text-emerald-600'}`}>{bin.status}</span></p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 4. Municipal Stations (Hospitals/Police/Fire) */}
        {showServices && safetyServices.map((ser, idx) => (
          <Marker 
            key={idx} 
            position={ser.pos}
            icon={createDivIcon(ser.color, ser.icon)}
          >
            <Popup>
              <div className="font-sans text-xs text-slate-800 space-y-1">
                <p className="font-bold text-sm text-primary mb-1">{ser.name}</p>
                <p><strong>Utility Category:</strong> {ser.type}</p>
                {ser.beds && <p><strong>Capacity load:</strong> {ser.beds}</p>}
                {ser.patrols && <p><strong>Patrol grid:</strong> {ser.patrols}</p>}
                {ser.engines && <p><strong>Active engines:</strong> {ser.engines}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 5. Citizen Complaints */}
        {showComplaints && complaints.map((c, idx) => (
          <Marker 
            key={idx} 
            position={c.pos}
            icon={createDivIcon('#A855F7', iconPaths.complaint)}
          >
            <Popup>
              <div className="font-sans text-xs text-slate-800 space-y-1">
                <p className="font-bold text-sm text-primary mb-1">{c.name}</p>
                <p><strong>Details:</strong> {c.desc}</p>
                <p><strong>State:</strong> <span className="font-bold text-destructive">{c.status}</span></p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 6. Active Emergency Incidents */}
        {showEmergency && emergencies.map((em, idx) => (
          <Marker 
            key={idx} 
            position={em.pos}
            icon={createDivIcon('#EF4444', iconPaths.emergency, true)}
          >
            <Popup>
              <div className="font-sans text-xs text-slate-800 space-y-1">
                <p className="font-bold text-sm text-destructive mb-1">{em.name}</p>
                <p><strong>Description:</strong> {em.desc}</p>
                <p><strong>Emergency:</strong> Dispatch active</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 7. Weather Telemetry overlay */}
        {showWeather && (
          <Marker 
            position={weatherStation.pos}
            icon={createDivIcon('#06B6D4', iconPaths.weather)}
          >
            <Popup>
              <div className="font-sans text-xs text-slate-800 space-y-1">
                <p className="font-bold text-sm text-primary mb-1">{weatherStation.name}</p>
                <p><strong>Temperature:</strong> {weatherStation.temp}</p>
                <p><strong>Condition:</strong> {weatherStation.condition}</p>
                <p><strong>Humidity level:</strong> {weatherStation.humidity}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
