import { Ship } from '../../models/ships/ship';

const filter = (items: any[], filter: any): any[] => {
  let out = items;

  for (const key in filter) {
    console.log('key', key, filter[key]);
    if (!filter[key] || filter[key].length === 0) continue;
    if (key === 'Owner' || key === 'Faction' || key === 'Author')
      out = out.filter((item) => !filter[key].includes(item[key]));
    if (key === 'Shipwright') {
      console.log('filter[key]', filter[key]);
      out = out.filter((item) => !filter[key].includes((item as Ship).Hull.Shipwright.Name));
    }
    if (key === 'Size')
      out = out.filter((item) => !filter[key].includes(item.Size?.name || item.Hull?.Size.name));
    if (key === 'Class') out = out.filter((item) => !filter[key].includes(item.Hull?.Class));
    if (key === 'Hull') out = out.filter((item) => !filter[key].includes(item.Hull?.Name));
    if (key === 'Tags')
      out = out.filter((item) => item.Tags.some((tag) => !filter[key].includes(tag)));
    if (key === 'Type') out = out.filter((item) => !filter[key].includes(item.PoiType));
  }

  return out;
};

export default filter;
