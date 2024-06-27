import { Ship } from '../../models/maps/ship';
import { poiSizeClasses } from '../../models/maps/poi';

const filter = (items: any[], filter: any): any[] => {
  let out = items;

  for (const key in filter) {
    if (!filter[key] || filter[key].length === 0) continue;
    if (key === 'Owner' || key === 'Faction' || key === 'Author')
      out = out.filter((item) => !filter[key].includes(item[key]));
    if (key === 'Shipwright') {
      out = out.filter((item) => !filter[key].includes((item as Ship).Hull.Shipwright));
    }
    if (key === 'Size')
      if (items[0].ItemType === 'poi') {
        const sizeFilter = filter[key]
          .map((size) => poiSizeClasses.find((s) => s.name === size))
          .map((s) => s?.id);
        out = out.filter((item) => !sizeFilter.includes(item.Size));
      } else
        out = out.filter((item) => !filter[key].includes(item.Size?.name || item.Hull?.Size.name));
    if (key === 'Class') out = out.filter((item) => !filter[key].includes(item.Hull?.Class));
    if (key === 'Hull') out = out.filter((item) => !filter[key].includes(item.Hull?.Name));
    if (key === 'Tags')
      out = out.filter(
        (item) =>
          !item.Tags.length ||
          (item.Tags.length && !item.Tags.some((tag) => filter[key].includes(tag.Name)))
      );
    if (key === 'Type') out = out.filter((item) => !filter[key].includes(item.PoiType));
    if (key === 'Role') out = out.filter((item) => !filter[key].includes(item.Role));
    if (key === 'Background') out = out.filter((item) => !filter[key].includes(item.Background));
    if (key === 'Assignment')
      out = out.filter(
        (item) =>
          !item.Assignment || (item.Assignment && !filter[key].includes(item.Assignment.Name))
      );
    if (key === 'Author') out = out.filter((item) => !filter[key].includes(item.Author.Name));
  }

  return out;
};

export default filter;
