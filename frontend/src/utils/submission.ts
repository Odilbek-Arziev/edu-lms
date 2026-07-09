import {QueueFilter} from "../types/HomeworkSubmission";

export function getExtension(url: string): string {
    const clean = url.split('?')[0]
    const parts = clean.split('.')

    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

export function getFileName(url: string): string {
    const clean = url.split('?')[0]
    const parts = clean.split('/')

    return decodeURIComponent(parts[parts.length - 1] || url)
}

export const FILTERS: { key: QueueFilter; label: string; icon: string, color: string }[] = [
    {key: 'open', label: 'unchecked', icon: 'inbox', color: 'warning'},
    {key: 'approved', label: 'approved', icon: 'check-circle', color: 'success'},
    {key: 'rejected', label: 'rejected', icon: 'x-circle', color: 'danger'},
]