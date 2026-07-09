import {Button} from "reactstrap";
import {TriStateSwitchProps} from "../../../types/HomeworkSubmission";

export type TriState = '' | 'yes' | 'no';

export function TriStateSwitch({value, onChange, disabled, t}: TriStateSwitchProps) {
    return (
        <div className="btn-group btn-group-sm w-100" role="group">
            {([['', 'all'], ['yes', 'yes'], ['no', 'no']] as [TriState, string][]).map(([v, label]) => (
                <Button
                    key={v || 'all'}
                    type="button"
                    disabled={disabled}
                    className={value === v ? 'btn btn-primary' : 'btn btn-outline-primary'}
                    onClick={() => onChange(v)}
                >
                    {t(label)}
                </Button>
            ))}
        </div>
    );
}