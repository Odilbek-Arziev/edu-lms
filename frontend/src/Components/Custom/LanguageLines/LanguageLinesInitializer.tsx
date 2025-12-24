import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../../slices';
import i18n from '../../../i18n';
import {fetchLanguageLines} from "../../../slices/languageLines/thunk";

interface Props {
    children: React.ReactNode;
}

const LanguageLinesInitializer: React.FC<Props> = ({children}) => {
    const dispatch = useDispatch()
    const {translations, currentLanguage, loading, items} = useSelector(
        (state: RootState) => state.LanguageLines
    )

    useEffect(() => {
        dispatch(fetchLanguageLines() as any)
    }, [dispatch])

    useEffect(() => {
        const languages = Object.keys(translations)
        languages.forEach((lang) => {
            const translationForLang = translations[lang]

            if (Object.keys(translationForLang).length > 0) {
                i18n.addResourceBundle(
                    lang,
                    'translation',
                    translationForLang,
                    true,
                    true
                )
            }
        })
    }, [translations])

    return <>{children}</>
}

export default LanguageLinesInitializer;