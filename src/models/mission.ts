import { useMapStore } from '../stores/mapStore';
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
    useMapStore().pois.forEach((poi) => {
      if (poi.ID === data.destination_id) {
        this.Destination = poi;
        return;
      }
      if (poi.Subitems) {
        poi.Subitems.forEach((subitem) => {
          if (subitem.ID === data.destination_id) {
            this.Destination = subitem;
            return;
          }
        });
      }
    });
    this.Mission = data.mission_type;
  }
}

export { Mission, missionData };
