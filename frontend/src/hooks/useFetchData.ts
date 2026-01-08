import {useCallback, useState} from "react";
import {useDispatch} from "react-redux";


export const useFetchData = (
    thunk: any,
    dataType: string,
    additionalParamsGetter?: () => Record<string, any>
) => {
    const [localData, setLocalData] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const dispatch = useDispatch();

    const fetchData = useCallback(async (baseParams: any = {}) => {
        setIsSearching(true);
        try {
            const params: any = {
                skipReduxUpdate: true,
                ...baseParams
            };

            if (additionalParamsGetter) {
                Object.assign(params, additionalParamsGetter());
            }

            const response = await dispatch(thunk(params));

            if (response) {
                const data = response.results || response.data || response;
                setLocalData(Array.isArray(data) ? data : []);

                const total = response.count || response.total || (Array.isArray(data) ? data.length : 0);
                setTotalCount(total);
            }
        } catch (error) {
            console.error(`Error fetching ${dataType}:`, error);
        } finally {
            setIsSearching(false);
        }
    }, [thunk, dataType, additionalParamsGetter, dispatch]);

    return {localData, totalCount, isSearching, fetchData};
};