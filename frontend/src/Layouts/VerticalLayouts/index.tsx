import React, {useEffect, useCallback} from 'react';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import {Collapse} from 'reactstrap';
// Import Data
import navdata from "../LayoutMenuData";
//i18n
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {createSelector} from 'reselect';

const VerticalLayout = (props: any) => {
    const navData = navdata().props.children;

    /*
 layout settings
 */
    const selectLayoutState = (state: any) => state.Layout;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            leftsidbarSizeType: layout.leftsidbarSizeType,
            sidebarVisibilitytype: layout.sidebarVisibilitytype,
            layoutType: layout.layoutType
        })
    );
    // Inside your component
    const {
        leftsidbarSizeType, sidebarVisibilitytype, layoutType
    } = useSelector(selectLayoutProperties);

    //vertical and semibox resize events
    const resizeSidebarMenu = useCallback(() => {
        var windowSize = document.documentElement.clientWidth;
        if (windowSize >= 1025) {
            if (document.documentElement.getAttribute("data-layout") === "vertical") {
                document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
            }
            if (document.documentElement.getAttribute("data-layout") === "semibox") {
                document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
            }
            var hamburgerIcon = document.querySelector(".hamburger-icon");
            if ((sidebarVisibilitytype === "show" || layoutType === "vertical" || layoutType === "twocolumn") && document.querySelector(".hamburger-icon")) {
                if (hamburgerIcon !== null) {
                    hamburgerIcon.classList.remove("open");
                }
            } else {
                if (hamburgerIcon !== null) {
                    hamburgerIcon.classList.add("open");
                }
            }

        } else if (windowSize < 1025 && windowSize > 767) {
            document.body.classList.remove("twocolumn-panel");
            if (document.documentElement.getAttribute("data-layout") === "vertical") {
                document.documentElement.setAttribute("data-sidebar-size", "sm");
            }
            if (document.documentElement.getAttribute("data-layout") === "semibox") {
                document.documentElement.setAttribute("data-sidebar-size", "sm");
            }
            if (document.querySelector(".hamburger-icon")) {
                document.querySelector(".hamburger-icon")?.classList.add("open");
            }
        } else if (windowSize <= 767) {
            document.body.classList.remove("vertical-sidebar-enable");
            if (document.documentElement.getAttribute("data-layout") !== "horizontal") {
                document.documentElement.setAttribute("data-sidebar-size", "lg");
            }
            if (document.querySelector(".hamburger-icon")) {
                document.querySelector(".hamburger-icon")?.classList.add("open");
            }
        }
    }, [leftsidbarSizeType, sidebarVisibilitytype, layoutType]);

    useEffect(() => {
        window.addEventListener("resize", resizeSidebarMenu, true);
    }, [resizeSidebarMenu]);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        const initMenu = () => {
            const pathName = process.env.PUBLIC_URL + props.router.location.pathname;
            const ul: any = document.getElementById("navbar-nav");
            const items = ul.getElementsByTagName("a");
            let itemsArray = [...items]; // converts NodeList to Array
            removeActivation(itemsArray);
            let matchingMenuItem = itemsArray.find((x) => {
                return x.pathname === pathName;
            });
            if (matchingMenuItem) {
                activateParentDropdown(matchingMenuItem);
            }
        };
        initMenu();
    }, [props.router.location.pathname, props.layoutType]);

    function activateParentDropdown(item: any) {

        item.classList.add("active");
        let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

        if (parentCollapseDiv) {

            // to set aria expand true remaining
            parentCollapseDiv.classList.add("show");
            parentCollapseDiv.parentElement.children[0].classList.add("active");
            parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").classList.add("show");
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
                }
            }
            return false;
        }
        return false;
    }

    const removeActivation = (items: any) => {
        let actiItems = items.filter((x: any) => x.classList.contains("active"));

        actiItems.forEach((item: any) => {
            if (item.classList.contains("menu-link")) {
                if (!item.classList.contains("active")) {
                    item.setAttribute("aria-expanded", false);
                }
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
            }
            if (item.classList.contains("nav-link")) {
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
                item.setAttribute("aria-expanded", false);
            }
            item.classList.remove("active");
        });
    };

    return (
        <React.Fragment>
            {/* menu Items */}
            {(navData || []).map((item: any, key: number) => {
                return (
                    <React.Fragment key={key}>
                        {/* Main Header */}
                        {item['isHeader'] ?
                            <div className="menu-title"><span data-key="t-menu">{props.t(item.label.toLowerCase())}</span></div>
                            : (
                                (item.subItems ? (
                                    <div className="nav-item">
                                        <Link
                                            onClick={item.click}
                                            className="nav-link menu-link"
                                            to={item.link ? item.link : "/#"}
                                            data-bs-toggle="collapse"
                                        >
                                            {item.icon} <span data-key="t-apps">{props.t(item.label.toLowerCase())}</span>
                                        </Link>
                                        <Collapse
                                            className="menu-dropdown"
                                            isOpen={item.stateVariables}
                                            id="sidebarApps">
                                            <div className="nav nav-sm flex-column test">
                                                {/* subItms  */}
                                                {item.subItems && ((item.subItems || []).map((subItem: any, key: number) => (
                                                        <React.Fragment key={key}>
                                                            {!subItem.isChildItem ? (
                                                                <div className="nav-item">
                                                                    <Link
                                                                        to={subItem.link ? subItem.link : "/#"}
                                                                        className="nav-link"
                                                                    >
                                                                        {subItem.icon &&
                                                                        <span className="me-2">{subItem.icon}</span>}
                                                                        {props.t(subItem.label.toLowerCase())}
                                                                        {subItem.badgeName ?
                                                                            <span
                                                                                className={"badge badge-pill bg-" + subItem.badgeColor}
                                                                                data-key="t-new">{subItem.badgeName}</span>
                                                                            : null}
                                                                    </Link>
                                                                </div>
                                                            ) : (
                                                                <div className="nav-item">
                                                                    <Link
                                                                        onClick={subItem.click}
                                                                        className="nav-link"
                                                                        to="/#"
                                                                        data-bs-toggle="collapse"
                                                                    > {props.t(subItem.label.toLowerCase())}
                                                                        {subItem.badgeName ?
                                                                            <span
                                                                                className={"badge badge-pill bg-" + subItem.badgeColor}
                                                                                data-key="t-new">{subItem.badgeName}</span>
                                                                            : null}
                                                                    </Link>
                                                                    <Collapse className="menu-dropdown"
                                                                              isOpen={subItem.stateVariables}
                                                                              id="sidebarEcommerce">
                                                                        <ul className="nav nav-sm flex-column list-unstyled">
                                                                            {/* child subItms  */}
                                                                            {subItem.childItems && (
                                                                                (subItem.childItems || []).map((childItem: any, key: number) => (
                                                                                    <React.Fragment key={key}>
                                                                                        {!childItem.childItems ?
                                                                                            <div className="nav-item">
                                                                                                <Link
                                                                                                    to={childItem.link ? childItem.link : "/#"}
                                                                                                    className="nav-link">
                                                                                                    {childItem.icon &&
                                                                                                    <span
                                                                                                        className="me-2">{childItem.icon}</span>}
                                                                                                    {props.t(childItem.label.toLowerCase())}
                                                                                                </Link>
                                                                                            </div>
                                                                                            : <div className="nav-item">
                                                                                                <Link to="/#"
                                                                                                      className="nav-link"
                                                                                                      onClick={childItem.click}
                                                                                                      data-bs-toggle="collapse">
                                                                                                    {props.t(childItem.label.toLowerCase())}
                                                                                                </Link>
                                                                                                <Collapse
                                                                                                    className="menu-dropdown"
                                                                                                    isOpen={childItem.stateVariables}
                                                                                                    id="sidebaremailTemplates">
                                                                                                    <ul className="nav nav-sm flex-column list-unstyled">
                                                                                                        {childItem.childItems.map((subChildItem: any, key: number) => (
                                                                                                            <div className="nav-item"
                                                                                                                key={key}>
                                                                                                                <Link
                                                                                                                    to={subChildItem.link}
                                                                                                                    className="nav-link"
                                                                                                                    data-key="t-basic-action">{props.t(subChildItem.label.toLowerCase())} </Link>
                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </ul>
                                                                                                </Collapse>
                                                                                            </div>
                                                                                        }
                                                                                    </React.Fragment>
                                                                                ))
                                                                            )}
                                                                        </ul>
                                                                    </Collapse>
                                                                </div>
                                                            )}
                                                        </React.Fragment>
                                                    ))
                                                )}
                                            </div>

                                        </Collapse>
                                    </div>
                                ) : (
                                    <div className="nav-item">
                                        <Link
                                            className="nav-link menu-link"
                                            to={item.link ? item.link : "/#"}>
                                            {item.icon} <span>{props.t(item.label.toLowerCase())}</span>
                                            {item.badgeName ?
                                                <span className={"badge badge-pill bg-" + item.badgeColor}
                                                      data-key="t-new">{item.badgeName}</span>
                                                : null}
                                        </Link>
                                    </div>
                                ))
                            )
                        }
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
};

VerticalLayout.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));
