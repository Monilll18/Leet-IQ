export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const generateRoomId = () => {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

export const getDifficultyColor = (difficulty) => {
    const colors = {
        Easy: 'text-green-400 bg-green-500/10 border-green-500/20',
        Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
    };
    return colors[difficulty] || colors.Easy;
};

export const getDifficultyBadgeClass = (difficulty) => {
    const classes = {
        Easy: 'badge-success',
        Medium: 'badge-warning',
        Hard: 'badge-error',
    };
    return classes[difficulty] || classes.Easy;
};

export const getLanguageExtension = (language) => {
    const extensions = {
        javascript: 'js',
        python: 'py',
        java: 'java',
        cpp: 'cpp',
    };
    return extensions[language] || 'txt';
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
