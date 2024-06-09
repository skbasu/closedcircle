import formatDistance from 'date-fns/formatDistance';

export const formattedDate = (dateString) => {
    const str = formatDistance(
        new Date(dateString),
        new Date()
    );
    return `${str}`;
}