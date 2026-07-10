import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useFetchData} from "./useFetchData";
import {useCascadeSelect} from "./useCascadeSelect";
import {homeworkSubmissionsThunk} from "../slices/HomeworkSubmissions";
import {closeLoading, showLoading} from "../utils/swal";
import {PER_PAGE} from "../constants";
import {SubmissionFilters} from "../types/SubmissionFIlters";

export const DEFAULT_FILTERS: SubmissionFilters = {
    student: '',
    submittedFrom: '',
    submittedTo: '',
    checked: 'no',
    approved: '',
    reworked: '',
    checkedFrom: '',
    checkedTo: '',
};

export function useSubmissionsList() {
    const {t} = useTranslation();

    const [filters, setFilters] = useState<SubmissionFilters>(DEFAULT_FILTERS);
    const [page, setPage] = useState<number>(1);

    const cascade = useCascadeSelect();
    const cascadeKey = `${cascade.courseId || ''}|${cascade.lessonId || ''}`;
    const prevCascadeRef = useRef(cascadeKey);

    const updateFilter = <K extends keyof SubmissionFilters>(key: K, value: SubmissionFilters[K]) => {
        setFilters(prev => {
            const next = {...prev, [key]: value};
            if (key === 'checked' && value === 'no') next.approved = '';
            return next;
        });
        setPage(1);
    };

    const resetFilters = () => {
        setFilters({...DEFAULT_FILTERS, checked: ''});
        cascade.reset();
        setPage(1);
    };

    const activeCount = [
        cascade.courseId,
        cascade.lessonId,
        filters.student,
        filters.submittedFrom,
        filters.submittedTo,
        filters.checked,
        filters.approved,
        filters.reworked,
        filters.checkedFrom,
        filters.checkedTo,
    ].filter(v => v !== '' && v !== null && v !== undefined).length;

    const {localData: submissions, totalCount, isSearching, fetchData} = useFetchData(
        homeworkSubmissionsThunk.fetch,
        'homework_submissions',
        () => ({
            page,
            perPage: PER_PAGE,
            ...(filters.checked === 'yes' && {status: 'checked'}),
            ...(filters.checked === 'no' && {status: 'open'}),
            ...(filters.approved === 'yes' && {state: 'approved'}),
            ...(filters.approved === 'no' && {state: 'rejected'}),
            ...(filters.reworked && {reworked: filters.reworked === 'yes'}),
            ...(filters.student && {student: filters.student}),
            ...(cascade.courseId && {course: cascade.courseId}),
            ...(cascade.lessonId && {lesson: cascade.lessonId}),
            ...(filters.submittedFrom && {submitted_from: filters.submittedFrom}),
            ...(filters.submittedTo && {submitted_to: filters.submittedTo}),
            ...(filters.checkedFrom && {checked_from: filters.checkedFrom}),
            ...(filters.checkedTo && {checked_to: filters.checkedTo}),
        })
    );

    useEffect(() => {
        if (prevCascadeRef.current !== cascadeKey) {
            prevCascadeRef.current = cascadeKey;
            if (page !== 1) {
                setPage(1);
                return;
            }
        }
        fetchData();
    }, [filters, page, cascadeKey]);

    useEffect(() => {
        if (isSearching) showLoading(t('loading'), t('wait'));
        else closeLoading();
    }, [isSearching]);

    return {
        filters,
        updateFilter,
        resetFilters,
        activeCount,
        cascade,
        page,
        setPage,
        submissions,
        totalCount,
        isSearching,
        refresh: fetchData,
    };
}