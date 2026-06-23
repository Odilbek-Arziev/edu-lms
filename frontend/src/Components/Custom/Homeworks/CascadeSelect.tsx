import React from "react";
import {useTranslation} from "react-i18next";
import {Label} from "reactstrap";
import CustomSelect from "../../Common/CustomSelect";

function CascadeSelect({cascade, layout = "row", lessonError}: any) {
    const {t} = useTranslation();
    const {
        courseId, moduleId, lessonId, setCourseId, setModuleId, setLessonId,
        coursesOptions, modulesOptions, lessonsOptions,
    } = cascade;

    const stacked = layout === "column";
    const wrapClass = stacked ? "mb-3 w-100" : "";
    const wrapStyle = stacked ? undefined : {minWidth: 200};

    return (
        <>
            <div className={wrapClass} style={wrapStyle}>
                {stacked && <Label className="form-label">{t('course')}</Label>}
                <CustomSelect
                    placeholder={t('select_course')}
                    value={courseId} width={'100%'}
                    options={coursesOptions}
                    onChange={setCourseId}
                    isClearable
                />
            </div>
            <div className={wrapClass} style={wrapStyle}>
                {stacked && <Label className="form-label">{t('module')}</Label>}
                <CustomSelect
                    placeholder={t('select_module')}
                    value={moduleId} width={'100%'}
                    options={modulesOptions}
                    onChange={setModuleId}
                    isClearable
                    isDisabled={!courseId}
                />
            </div>
            <div className={wrapClass} style={wrapStyle}>
                {stacked && <Label className="form-label">{t('lesson')}</Label>}
                <CustomSelect
                    placeholder={t('select_lesson')}
                    value={lessonId} width={'100%'}
                    options={lessonsOptions}
                    onChange={setLessonId}
                    isClearable
                    isDisabled={!moduleId}
                />
                {lessonError && <div className="invalid-feedback d-block">{lessonError}</div>}
            </div>
        </>
    );
}

export default CascadeSelect;