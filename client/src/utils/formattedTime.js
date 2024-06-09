export const formattedTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const formattedhours = padZero(hours % 12 || 12);
    const minutes = padZero(date.getMinutes());
    const suffix = hours >= 12 ? 'PM' : 'AM';

    return `${formattedhours}:${minutes} ${suffix}`;
}

const padZero = (number) => {
    return number < 10 ? '0' + number : number.toString();
}

