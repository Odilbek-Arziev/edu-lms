import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Badge, Button, Input, Label} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useDispatch} from "react-redux";
import {homeworkCriteriaThunk} from "../../../../slices/homeworkCriteria/reducer";

function CriteriaPicker({value, onChange}: { value: string[]; onChange: (v: string[]) => void }) {
    const {t} = useTranslation();
    const dispatch = useDispatch<any>();

    const [existing, setExisting] = useState<string[]>([]);
    const [draft, setDraft] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(homeworkCriteriaThunk.fetch()).then((res: any) => {
            const texts = (res?.results || []).map((c: any) => c.text);
            setExisting(Array.from(new Set(texts)));
        });
    }, []);

    const add = (text: string) => {
        const v = text.trim();
        if (!v || value.includes(v)) return;
        onChange([...value, v]);
    };

    const remove = (text: string) => onChange(value.filter(c => c !== text));

    const suggestions = useMemo(() => {
        const q = query.trim().toLowerCase();
        return existing
            .filter(c => !value.includes(c))
            .filter(c => !q || c.toLowerCase().includes(q))
            .slice(0, 8);
    }, [existing, value, query]);

    const handleDraftKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
            setDraft("");
        }
    };

    return (
        <div className="mb-3">
            <Label className="form-label">{t('criteria')}</Label>

            {value.length > 0 ? (
                <div className="d-flex flex-wrap gap-2 mb-2">
                    {value.map((c, i) => (
                        <Badge key={i} color="primary"
                               className="bg-primary-subtle text-primary d-flex align-items-center gap-1 py-2 px-2"
                               style={{fontSize: 13, fontWeight: 500}}>
                            {c}
                            <FeatherIcon icon="x" size={13} style={{cursor: 'pointer'}}
                                         onClick={() => remove(c)}/>
                        </Badge>
                    ))}
                </div>
            ) : (
                <div className="text-muted small mb-2">{t('no_criteria_yet')}</div>
            )}

            <div className="d-flex gap-2 mb-2">
                <Input
                    type="text"
                    placeholder={t('enter_criterion')}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleDraftKey}
                />
                <Button type="button" color="success" className="flex-shrink-0 d-flex align-items-center gap-1"
                        onClick={() => {
                            add(draft);
                            setDraft("");
                        }}>
                    <FeatherIcon icon="plus" size={14}/>
                    {t('add')}
                </Button>
            </div>

            {existing.length > 0 && (
                <div>
                    <Input
                        type="text"
                        bsSize="sm"
                        className="mb-2"
                        placeholder={t('search_criteria')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="d-flex flex-wrap gap-2">
                        {suggestions.map((c, i) => (
                            <Badge key={i} color="light"
                                   className="bg-light text-body border d-flex align-items-center gap-1 py-2 px-2"
                                   style={{cursor: 'pointer', fontSize: 13, fontWeight: 400}}
                                   onClick={() => add(c)}>
                                <FeatherIcon icon="plus" size={12}/>
                                {c}
                            </Badge>
                        ))}
                        {suggestions.length === 0 && (
                            <span className="text-muted small">{t('no_matches')}</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CriteriaPicker;