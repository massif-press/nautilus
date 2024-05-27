type itemHistoryData = {
  date: string;
  event: string;
};

class ItemHistory {
  public readonly Date: string;
  public Event: string;

  constructor(data: itemHistoryData) {
    this.Date = data.date;
    this.Event = data.event;
  }
}

export { ItemHistory, itemHistoryData };
