import LeafletMap from './LeafletMap';
import type { MapLocation } from './LeafletMap';

export default function HospitalMap() {
  const centerPosition: [number, number] = [36.7783, -119.4179];

  const locations: MapLocation[] = [
    { 
      id: 1, 
      pos: [36.7820, -119.4200], 
      name: 'IntelliSphere Central Medical Center', 
      details: { 'Total Capacity': '150 Beds', 'Current Bed Occupancy': '84% Occupied' }, 
      risk: 'HIGH LOAD', 
      riskStatus: 'HIGH LOAD' 
    },
    { 
      id: 2, 
      pos: [36.7750, -119.4120], 
      name: 'East Fresno Emergency Clinic', 
      details: { 'Total Capacity': '60 Beds', 'Current Bed Occupancy': '65% Occupied' }, 
      risk: 'STABLE', 
      riskStatus: 'STABLE' 
    },
    { 
      id: 3, 
      pos: [36.7840, -119.4080], 
      name: 'Clovis Pediatric & General', 
      details: { 'Total Capacity': '80 Beds', 'Current Bed Occupancy': '40% Occupied' }, 
      risk: 'STABLE', 
      riskStatus: 'STABLE' 
    }
  ];

  return <LeafletMap centerPosition={centerPosition} locations={locations} />;
}
