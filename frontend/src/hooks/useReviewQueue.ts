import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {homeworkSubmissionsThunk} from "../slices/HomeworkSubmissions";
import {HomeworkSubmission} from "../types/HomeworkSubmission";

export function useReviewQueue(currentId: number) {
    const dispatch = useDispatch<any>();
    const [queue, setQueue] = useState<HomeworkSubmission[]>([]);

    async function loadQueue() {
        try {
            const response = await dispatch(homeworkSubmissionsThunk.fetch({
                page: 1,
                perPage: 50,
                status: 'open',
                skipReduxUpdate: true,
            }));
            const list = Array.isArray(response) ? response : (response?.results || []);
            setQueue(list);
        } catch (e) {
        }
    }

    useEffect(() => {
        loadQueue();
    }, []);

    const currentIdx = queue.findIndex(s => s.id === currentId);
    const prevSubmission = currentIdx > 0 ? queue[currentIdx - 1] : null;
    const nextSubmission = currentIdx >= 0 && currentIdx < queue.length - 1 ? queue[currentIdx + 1] : null;

    return {
        queue,
        currentIdx,
        prevSubmission,
        nextSubmission,
        refresh: loadQueue,
    };
}