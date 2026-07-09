import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import FeatherIcon from "feather-icons-react";
import {getExtension, getFileName} from "../../../utils/submission";

interface Props {
    fileUrl: string | null
}

const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg']

function SubmissionFilePreview({fileUrl}: Props) {
    const {t} = useTranslation()

    const ext = useMemo(() => (fileUrl ? getExtension(fileUrl) : ''), [fileUrl])
    const isImage = IMAGE_EXT.includes(ext)
    const isPdf = ext === 'pdf'

    if (!fileUrl) {
        return (
            <div className="text-muted small d-flex align-items-center gap-2 py-2">
                <FeatherIcon icon="file-minus" size={14}/>
                {t('no_file_attached')}
            </div>
        )
    }

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                <div className="d-flex align-items-center gap-2 text-truncate">
                    <FeatherIcon icon="paperclip" size={14} className="flex-shrink-0"/>
                    <span className="text-truncate small">{getFileName(fileUrl)}</span>
                </div>
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="btn btn-soft-primary btn-sm d-flex align-items-center gap-1 flex-shrink-0"
                >
                    <FeatherIcon icon="download" size={12}/>
                    {t('download')}
                </a>
            </div>

            {isImage && (
                <img
                    src={fileUrl}
                    alt={t('submitted_file')}
                    className="img-fluid rounded border"
                    style={{maxHeight: 480, objectFit: 'contain', width: '100%', background: '#f8f9fa'}}
                />
            )}

            {isPdf && (
                <iframe
                    src={fileUrl}
                    title={t('submitted_file')}
                    className="w-100 rounded border"
                    style={{height: 480}}
                />
            )}

            {!isImage && !isPdf && (
                <div className="text-muted small d-flex align-items-center gap-2 py-2">
                    <FeatherIcon icon="file" size={14}/>
                    {t('preview_not_available')}
                </div>
            )}
        </div>
    );
}

export default SubmissionFilePreview