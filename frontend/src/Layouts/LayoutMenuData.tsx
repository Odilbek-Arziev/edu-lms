import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

//Import Icons
import FeatherIcon from "feather-icons-react";
import {useDispatch, useSelector} from "react-redux";
import {fetchMenu} from "../slices/menu/thunk";

const Navdata = () => {
    const history = useNavigate();
    const dispatch = useDispatch<any>();

    const [menuStates, setMenuStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        dispatch(fetchMenu())
    }, [])

    const menu = useSelector((state: any) => state.Menu.items);

    const createUniqueId = (item: any, parentId: string = '') => {
        const baseId = item.title.toLowerCase().replace(/\s+/g, '_');
        return parentId ? `${parentId}_${baseId}` : baseId;
    };

    const toggleMenu = (itemId: string) => {
        setMenuStates(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    function buildSidebar(items: any[], parentId: string = ''): any[] {
        if (!items || !Array.isArray(items)) return [];

        return items.map((item: any) => {
            const uniqueId = createUniqueId(item, parentId);

            const sidebarItem: any = {
                id: uniqueId,
                label: item.title,
                icon: <FeatherIcon icon={item.icon_id || "settings"} className="icon-dual"/>,
                link: item.url_path || "/#",
                stateVariables: menuStates[uniqueId] || false,
                subItems: item.children ? buildSidebar(item.children, uniqueId) : [],
                click: item.children
                    ? (e: React.MouseEvent) => {
                        e.preventDefault();
                        toggleMenu(uniqueId);
                    }
                    : undefined
            };

            return sidebarItem;
        });
    }

    const menuItems: any = buildSidebar(menu);
    return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;