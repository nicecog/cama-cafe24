import menus from 'constants/menus';
import { Breadcrumb } from 'interfaces/menu';

const getBreadcrumbData = (link?: string) => {
  const result: Array<Breadcrumb> = [];

  menus.forEach((menu) => {
    if (link && link.indexOf(menu.link) !== -1) {
      if (menu.sub) {
        result.push({ title: menu.title });
      } else {
        result.push({ title: menu.title, link: menu.link });
      }
    }
    menu.sub?.forEach((sub) => {
      if (link && link.indexOf(sub.link) !== -1) {
        result.push({ title: sub.title, link: sub.link });
      }
    });
  });

  return result;
};

const getTitleData = (link?: string) => {
  let result = ``;

  menus.forEach((menu) => {
    if (link && link === menu.link) {
      result = menu.title;
    }

    menu.sub?.forEach((sub) => {
      if (link && link === sub.link) {
        result = sub.title;
      }
    });
  });

  return result;
};

export { getBreadcrumbData, getTitleData };
