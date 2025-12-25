import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import FeatherIcon from "feather-icons-react";
import {useDispatch, useSelector} from "react-redux";
import {menuThunks} from "../slices/menu";
import {RootState} from "../slices";

const Navdata = () => {
    const history = useNavigate();
    const dispatch = useDispatch<any>();

    const [menuStates, setMenuStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        dispatch(menuThunks.fetch())
    }, [dispatch])

    const menu = useSelector((state: RootState) => state.Menu.items);

    const createUniqueId = (item: any, parentId: string = '') => {
        const baseId = item.title?.toLowerCase().replace(/\s+/g, '_') || 'unnamed';
        return parentId ? `${parentId}_${baseId}` : baseId;
    };

    const toggleMenu = (itemId: string) => {
        setMenuStates(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    function buildSidebar(items: any[], parentId: string = ''): any[] {
        if (!items || !Array.isArray(items)) {
            console.warn('buildSidebar received invalid items:', items);
            return [];
        }

        return items.map((item: any) => {
            const uniqueId = createUniqueId(item, parentId);

            const sidebarItem: any = {
                id: uniqueId,
                label: item.title,
                icon: <FeatherIcon icon={item.icon || "circle"} className="icon-dual"/>,
                link: item.url_path || "/#",
                stateVariables: menuStates[uniqueId] || false,
                subItems: item.children && item.children.length > 0
                    ? buildSidebar(item.children, uniqueId)
                    : [],
            };

            if (item.children && item.children.length > 0) {
                sidebarItem.click = (e: React.MouseEvent) => {
                    e.preventDefault();
                    toggleMenu(uniqueId);
                };
                sidebarItem.isChildItem = true;
                sidebarItem.childItems = sidebarItem.subItems;
            }

            return sidebarItem;
        });
    }

    const menuItems: any = buildSidebar(menu);
    return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;