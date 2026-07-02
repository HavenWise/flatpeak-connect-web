export const TIME_OPTIONS: string[] = Array.from({ length: 24 * 60 }, (_, index) => {
    const hours = Math.floor(index / 60);
    const minutes = index % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});
