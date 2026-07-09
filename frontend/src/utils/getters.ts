export const AVATAR_COLORS = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];

export const getInitials = (first?: string, last?: string) => {
    const initials = `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();
    return initials || '?';
};

export const getAvatarColor = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
