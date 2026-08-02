import LeafletMap from './LeafletMap';
import type { MapLocation } from './LeafletMap';

export default function AgricultureMap() {
  const centerPosition: [number, number] = [36.7783, -119.4179];

  const locations: MapLocation[] = [
    { 
      id: 1, 
      pos: [36.7820, -119.4200], 
      name: 'Sector 1A (Wheat Field)', 
      details: { 'Moisture Level': '68%', 'Health Status': 'Optimal' }, 
      risk: 'LOW', 
      riskStatus: 'LOW' 
    },
    { 
      id: 2, 
      pos: [36.7750, -119.4120], 
      name: 'Sector 4B (Corn Field)', 
      details: { 'Moisture Level': '54%', 'Health Status': 'Dry Warning' }, 
      risk: 'MEDIUM', 
      riskStatus: 'MEDIUM' 
    },
    { 
      id: 3, 
      pos: [36.7840, -119.4080], 
      name: 'Sector 3C (Soybean Field)', 
      details: { 'Moisture Level': '62%', 'Health Status': 'Optimal' }, 
      risk: 'LOW', 
      riskStatus: 'LOW' 
    }
  ];

  return <LeafletMap centerPosition={centerPosition} locations={locations} />;
}
