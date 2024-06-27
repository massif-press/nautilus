import { useDataStore } from '../stores/dataStore';
import { Poi } from './maps/poi';
import { Ship } from './maps/ship';

type missionData = {
  mission_type: string;
  status: string;
  destination_id: string;
};

class Mission {
  public Status: string;
  public DestinationID: string;
  public Mission: string;

  constructor(data: missionData) {
    this.Status = data.status;
    this.DestinationID = data.destination_id;
    this.Mission = data.mission_type;
  }

  public get Destination(): Poi | Ship | null {
    if (!this.DestinationID || this.DestinationID === 'unknown') return null;
    let d = useDataStore().getShipById(this.DestinationID);
    if (!d) d = useDataStore().getPoiById(this.DestinationID);
    if (!d)
      d = useDataStore()
        .pois.flatMap((p) => p.Submaps.flatMap((s) => s.Subitems))
        .find((s) => s.ID === this.DestinationID);

    return d || null;
  }

  public set Destination(destination: Poi | Ship | null) {
    this.DestinationID = destination?.ID || '';
  }
}

export { Mission, missionData };
