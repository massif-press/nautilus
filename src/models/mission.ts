import { useMapStore } from '../mapStore';
import { Poi } from './poi';

const missionTypes = [
  'Patrol',
  'Resupply',
  'Redeploy',
  'Repair',
  'Deploy',
  'Transit',
  'Local Survey',
  'In Transit',
  'Awaiting Orders',
];

type missionData = {
  status: string;
  destination_id: string;
  mission_type: string;
};

class Mission {
  public readonly Status: string;
  public DestinationID: string;
  public Destination: Poi | null;
  public Mission: string;

  constructor(data: missionData) {
    this.Status = data.status;
    this.DestinationID = data.destination_id;
    const dest = useMapStore().pois.find((poi) => poi.ID === data.destination_id);
    this.Destination = dest || null;
    this.Mission = data.mission_type;
  }
}

export { Mission, missionData };
