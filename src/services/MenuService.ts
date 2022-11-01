import { MenuInfo } from '../interfaces/menu/MenuInfo';
import Menu from '../models/Menu';

const getAllMenu = async (): Promise<MenuInfo[]> => {
  try {
    const menuList = await Menu.find();

    const data = await Promise.all(
      menuList.map(async (menu) => {
        const result: MenuInfo = {
          menuId: menu._id,
          menuName: menu.menuName,
          image: menu.image,
        };

        return result;
      }),
    );

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const MenuService = {
  getAllMenu,
};

export default MenuService;
