import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {homeworkSubmissionsThunk} from "../slices/HomeworkSubmissions";
import {submissionCriterionResultsThunk} from "../slices/submissionCriterionResults";
import {submissionReviewsThunk} from "../slices/submissionReviews";
import {showConfirm, showError, showSuccess} from "../utils/swal";
import {HomeworkSubmission} from "../types/HomeworkSubmission";
import {CriterionResultDraft} from "../Components/Custom/Submissions/CriterionResultRow";

export const isSubmissionOverdue = (submission: HomeworkSubmission | null): boolean => {
    const deadline = submission?.homework?.deadline;
    if (!deadline || !submission?.submitted_at) return false;
    const d = new Date(deadline).getTime();
    const s = new Date(submission.submitted_at).getTime();
    return !isNaN(d) && !isNaN(s) && s > d;
};

export function useSubmissionReview(id: number) {
    const dispatch = useDispatch<any>();
    const {t} = useTranslation();

    const [submission, setSubmission] = useState<HomeworkSubmission | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<'accept' | 'reject' | null>(null);
    const [generalFeedback, setGeneralFeedback] = useState('');
    const [drafts, setDrafts] = useState<CriterionResultDraft[]>([]);

    async function loadSubmission() {
        setLoading(true);

        try {
            const data = await dispatch(homeworkSubmissionsThunk.getById(id));

            if (!data) {
                setLoading(false);
                return;
            }

            setSubmission(data);
            setGeneralFeedback(data.review?.general_feedback || '');

            const criteria = data.homework?.criteria || [];
            let existingResults: any[] = [];

            if (data.review?.id) {
                const response = await dispatch(
                    submissionCriterionResultsThunk.fetch({review: data.review.id, skipReduxUpdate: true})
                );
                existingResults = Array.isArray(response) ? response : (response?.results || []);
            }

            setDrafts(criteria.map((c: any) => {
                const existing = existingResults.find((r: any) => r.criterion?.id === c.id);
                return {
                    criterionId: c.id,
                    criterionText: c.text,
                    is_met: existing ? existing.is_met : false,
                    feedback: existing?.feedback || '',
                };
            }));
        } catch (e) {
            await showError(t('error'), t('failed_to_load_submission'));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSubmission();
    }, [id]);

    const isReviewed = !!submission?.is_checked;
    const metCount = drafts.filter(d => d.is_met).length;
    const allMet = drafts.length > 0 && metCount === drafts.length;
    const progressPct = drafts.length ? Math.round((metCount / drafts.length) * 100) : 0;
    const progressColor = allMet ? 'success' : metCount > 0 ? 'warning' : 'secondary';

    const updateDraft = (idx: number, next: CriterionResultDraft) => {
        setDrafts(prev => prev.map((d, i) => i === idx ? next : d));
    };

    const toggleAllCriteria = () => {
        const target = !allMet;
        setDrafts(prev => prev.map(d => ({...d, is_met: target})));
    };

    async function submitReview(isAccepted: boolean): Promise<boolean> {
        if (!submission) return false;

        if (!isAccepted) {
            const confirmResult = await showConfirm(
                t('reject_confirm_title'),
                t('reject_confirm_text')
            );
            if (!confirmResult.isConfirmed) return false;
        }

        if (isAccepted && drafts.length > 0 && !allMet) {
            const confirmResult = await showConfirm(
                t('accept_unmet_confirm_title'),
                t('accept_unmet_confirm_text')
            );
            if (!confirmResult.isConfirmed) return false;
        }

        setSaving(isAccepted ? 'accept' : 'reject');

        try {
            const review = await dispatch(submissionReviewsThunk.create({
                submission: submission.id,
                is_accepted: isAccepted,
                general_feedback: generalFeedback,
            }));

            if (!review?.id) {
                await showError(t('error'), t('failed_to_save_review'));
                return false;
            }

            for (const draft of drafts) {
                await dispatch(submissionCriterionResultsThunk.create({
                    criterion: draft.criterionId,
                    review: review.id,
                    is_met: draft.is_met,
                    feedback: draft.feedback,
                }));
            }

            await showSuccess(
                isAccepted ? t('submission_approved') : t('submission_rejected')
            );
            return true;
        } catch (e: any) {
            const data = e?.response?.data;
            const message = data?.non_field_errors?.[0]
                || (data ? Object.entries(data).map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n') : null)
                || t('failed_to_save_review');
            await showError(t('error'), message);
            return false;
        } finally {
            setSaving(null);
        }
    }

    return {
        submission,
        loading,
        saving,
        generalFeedback,
        setGeneralFeedback,
        drafts,
        updateDraft,
        toggleAllCriteria,
        isReviewed,
        metCount,
        allMet,
        progressPct,
        progressColor,
        submitReview,
    };
}