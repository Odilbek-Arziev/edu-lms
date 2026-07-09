import FeatherIcon from "feather-icons-react";

export const SectionHeader = ({title, icon, open, onToggle, right}: {
    title: string,
    icon?: string,
    open: boolean,
    onToggle: () => void,
    right?: React.ReactNode,
}) => (
    <div
        className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom"
        style={{cursor: 'pointer', userSelect: 'none'}}
        onClick={onToggle}
    >
        <h6 className="mb-0 d-flex align-items-center gap-2 fs-14">
            {icon && <FeatherIcon icon={icon} size={14}/>}
            {title}
        </h6>
        <div className="d-flex align-items-center gap-2">
            {right}
            <FeatherIcon icon={open ? 'chevron-up' : 'chevron-down'} size={14} className="text-muted"/>
        </div>
    </div>
);