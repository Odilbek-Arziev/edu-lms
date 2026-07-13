import React from "react";
import {Badge, Button, Card, CardBody} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import {formatFullDate} from "../../../utils/date";

type HomeworkRowProps = {
    hw: any;
    color: string;
    canManage?: boolean;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
};

const HomeworkRow: React.FC<HomeworkRowProps> = ({hw, color, canManage, onEdit, onDelete}) => {
    const {t} = useTranslation();

    return (
        <Card className="mb-2 overflow-hidden">
            <div className="d-flex">
                <div style={{width: 4, background: `var(--vz-${color})`}}/>
                <CardBody className="py-3">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div className="flex-grow-1" style={{minWidth: 0}}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h5 className="fs-15 mb-0 text-truncate" title={hw.title}>{hw.title}</h5>
                                <Badge color={color} className={`bg-${color}-subtle text-${color}`}>
                                    <FeatherIcon size={11} icon="calendar" className="me-1"/>
                                    {formatFullDate(hw.deadline)}
                                </Badge>
                            </div>

                            <div className="text-muted small d-flex align-items-center gap-3 flex-wrap">
                                <span className="d-flex align-items-center gap-1">
                                    <FeatherIcon size={12} icon="book-open"/>
                                    {hw.lesson?.title}
                                </span>
                                <span className="d-flex align-items-center gap-1">
                                    <FeatherIcon size={12} icon="repeat"/>
                                    {t('max_attempts')}: {hw.max_attempts}
                                </span>
                                {hw.criteria?.length > 0 && (
                                    <span className="d-flex align-items-center gap-1">
                                        <FeatherIcon size={12} icon="check-square"/>
                                        {t('criteria')}: {hw.criteria.length}
                                    </span>
                                )}
                            </div>

                            {hw.description && (
                                <p className="text-muted small mb-0 mt-1"
                                   style={{
                                       display: '-webkit-box',
                                       WebkitLineClamp: 2,
                                       WebkitBoxOrient: 'vertical',
                                       overflow: 'hidden',
                                   }}>
                                    {hw.description}
                                </p>
                            )}

                            {hw.criteria?.length > 0 && (
                                <div className="d-flex flex-wrap gap-1 mt-2">
                                    {hw.criteria.map((c: any) => (
                                        <Badge key={c.id} color="light"
                                               className="bg-light text-body border d-flex align-items-center gap-1"
                                               style={{fontWeight: 400, fontSize: 12}}>
                                            <FeatherIcon size={10} icon="check"/>
                                            {c.text}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {canManage && (
                            <div className="d-flex gap-1 flex-shrink-0">
                                <Button className="btn btn-info btn-sm" onClick={() => onEdit?.(hw.id)}>
                                    <FeatherIcon color="white" size={12} icon="edit"/>
                                </Button>
                                <Button className="btn btn-danger btn-sm" onClick={() => onDelete?.(hw.id)}>
                                    <FeatherIcon color="white" size={12} icon="trash"/>
                                </Button>
                            </div>
                        )}
                    </div>
                </CardBody>
            </div>
        </Card>
    );
};

export default HomeworkRow;