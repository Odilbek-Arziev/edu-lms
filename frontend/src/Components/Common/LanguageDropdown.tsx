import React, {useState} from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {get, map} from "lodash";
import languages from "../../common/languages";

import {changeLanguage} from '../../slices/languageLines/thunk';
import type {RootState} from '../../slices';


const LanguageDropdown = () => {
    const dispatch = useDispatch()
    const selectedLang = useSelector((state: RootState) => state.LanguageLines.currentLanguage)
    const [isLanguageDropdown, setIsLanguageDropdown] = useState<boolean>(false)

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdown(!isLanguageDropdown)
    }

    const changeLanguageAction = async (lang: string) => {
        try {
            await dispatch(changeLanguage(lang) as any)
        } catch (error) {
            console.error('Error changing language: ', error)
        }
    }

    return (
        <React.Fragment>
            <Dropdown
                isOpen={isLanguageDropdown}
                toggle={toggleLanguageDropdown}
                className="ms-1 topbar-head-dropdown header-item"
            >
                <DropdownToggle className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" tag="button">
                    <img
                        src={get(languages, `${selectedLang}.flag`)}
                        alt="Header Language"
                        height="20"
                        className="rounded"
                    />
                </DropdownToggle>
                <DropdownMenu className="notify-item language py-2">
                    {map(Object.keys(languages), key => (
                        <DropdownItem
                            key={key}
                            onClick={() => changeLanguageAction(key)}
                            className={`notify-item ${selectedLang === key ? "active" : "none"}`}
                        >
                            <img
                                src={get(languages, `${key}.flag`)}
                                alt="Skote"
                                className="me-2 rounded"
                                height="18"
                            />
                            <span className="align-middle">
                                {get(languages, `${key}.label`)}
                            </span>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default LanguageDropdown;