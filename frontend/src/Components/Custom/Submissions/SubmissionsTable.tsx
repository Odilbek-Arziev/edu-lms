import React from "react";
import {Table} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import {SubmissionsTableProps} from "../../../types/HomeworkSubmission";
import SubmissionsTableRow from "./SubmissionsTableRow";


function SubmissionsTable({submissions, onOpen}: SubmissionsTableProps) {
    const {t} = useTranslation();

    if (submissions.length === 0) {
        return (
            <div className="text-center text-muted py-5">
                <FeatherIcon icon="inbox" size={36} className="mb-2"/>
                <div>{t('no_data')}</div>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <Table className="table align-middle table-hover mb-0">
                <thead className="table-light text-muted">
                <tr>
                    <th scope="col">{t('homework')}</th>
                    <th scope="col">{t('student')}</th>
                    <th scope="col">{t('answer')}</th>
                    <th scope="col">{t('checking')}</th>
                    <th scope="col" style={{width: 56}}/>
                </tr>
                </thead>
                <tbody>
                {submissions.map((submission) => (
                    <SubmissionsTableRow
                        key={submission.id}
                        submission={submission}
                        onOpen={onOpen}
                    />
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default SubmissionsTable;