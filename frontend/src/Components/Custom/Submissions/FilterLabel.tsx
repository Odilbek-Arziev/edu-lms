import {Label} from "reactstrap";
import FeatherIcon from "feather-icons-react";

interface Props {
    icon: string;
    text: string;
}

export function FilterLabel({icon, text}: Props) {
    return (
        <Label className="form-label fs-12 text-muted mb-1 d-flex align-items-center gap-1">
            <FeatherIcon icon={icon} size={12}/>
            {text}
        </Label>
    );
}