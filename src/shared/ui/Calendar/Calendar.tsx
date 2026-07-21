import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import View from '../View/View.tsx';
import Typography from '../Typography/Typography.tsx';
import Box from '../Box/Box.tsx';
import SmallArrowRightIcon from '../icons/SmallArrowRightIcon.tsx';
import ArrowLeftIcon from '../icons/ArrowLeftIcon.tsx';
import CalendarIcon from '../icons/CalendarIcon.tsx';
import styles from './Calendar.module.scss';

type CalendarProps = {
    value?: Date | string;
    onChange?: (date: Date) => void;
    placeholder?: string;
    name?: string;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar({ value, onChange, placeholder, name }: CalendarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [currentMonth, setCurrentMonth] = useState<Date>(value ? new Date(value) : new Date());
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'year' | 'month'>('year');
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            const newDate = new Date(value);
            setSelectedDate(newDate);
            setCurrentMonth(newDate);
        }
    }, [value]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        onChange?.(date);
        setIsOpen(false);
    };

    const resetPickerState = useCallback(() => {
        setShowMonthYearPicker(false);
        setPickerMode('year');
        const inputDate = value ? new Date(value) : new Date();
        setCurrentMonth(inputDate);
    }, [value]);

    const handleToggle = () => {
        if (isOpen) {
            resetPickerState();
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                resetPickerState();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, resetPickerState]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    const handleYearSelect = (year: number) => {
        setCurrentMonth(new Date(year, currentMonth.getMonth()));
        setPickerMode('month');
    };

    const handleMonthSelect = (month: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), month));
        setShowMonthYearPicker(false);
        setPickerMode('year');
    };

    const today = useMemo(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }, []);

    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const currentMonthIndex = useMemo(() => new Date().getMonth(), []);

    const years = useMemo(() => {
        const result = [];
        for (let i = currentYear; i <= currentYear + 11; i++) {
            result.push(i);
        }
        return result;
    }, [currentYear]);

    const isSelected = (date: Date) => {
        return selectedDate?.toDateString() === date.toDateString();
    };

    const isDisabled = (date: Date) => {
        return date < today;
    };

    const isYearDisabled = (year: number) => {
        return year < currentYear;
    };

    const isMonthDisabled = (month: number) => {
        if (currentMonth.getFullYear() === currentYear) {
            return month < currentMonthIndex;
        }
        return false;
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <Box rg={8}>
            <div className={styles.container} ref={calendarRef}>
                <button type='button' className={styles.trigger} onClick={handleToggle} name={name}>
                    <CalendarIcon />
                    <Typography variant='button__forms16_book'>
                        {selectedDate ? formatDate(selectedDate) : placeholder || 'Choose date'}
                    </Typography>
                </button>

                {isOpen && (
                    <div className={styles.calendar}>
                        <View className={styles.header}>
                            <button type='button' className={styles.navButton} onClick={() => navigateMonth('prev')}>
                                <SmallArrowRightIcon direction='left' width={6} height={10} />
                            </button>
                            <button
                                type='button'
                                className={styles.monthYearButton}
                                onClick={() => {
                                    setShowMonthYearPicker(!showMonthYearPicker);
                                    setPickerMode('year');
                                }}>
                                <Typography variant='button__forms16_book'>
                                    {MONTH_NAMES[currentMonth.getMonth()].substring(0, 3)} {currentMonth.getFullYear()}
                                </Typography>
                                <SmallArrowRightIcon direction='down' width={5} height={8} color='#000' />
                            </button>
                            <button type='button' className={styles.navButton} onClick={() => navigateMonth('next')}>
                                <SmallArrowRightIcon direction='right' width={6} height={10} />
                            </button>
                        </View>

                        {showMonthYearPicker && (
                            <View className={styles.monthYearPicker}>
                                <View className={styles.pickerHeader}>
                                    <button
                                        type='button'
                                        className={styles.backButton}
                                        onClick={() => {
                                            if (pickerMode === 'month') {
                                                setPickerMode('year');
                                            } else {
                                                setShowMonthYearPicker(false);
                                            }
                                        }}>
                                        <ArrowLeftIcon width={24} height={24} showBackground={false} />
                                    </button>
                                    <Typography variant='button__forms14_book' className={styles.pickerTitle}>
                                        {pickerMode === 'year' ? 'Select Year' : 'Select Month'}
                                    </Typography>
                                </View>

                                {pickerMode === 'year' ? (
                                    <View className={styles.yearsGrid}>
                                        {years.map(year => (
                                            <button
                                                key={year}
                                                type='button'
                                                className={`${styles.yearButton} ${
                                                    year === currentMonth.getFullYear() ? styles.selected : ''
                                                } ${isYearDisabled(year) ? styles.disabled : ''}`}
                                                onClick={() => !isYearDisabled(year) && handleYearSelect(year)}
                                                disabled={isYearDisabled(year)}>
                                                <Typography variant='button__forms14_book'>{year}</Typography>
                                            </button>
                                        ))}
                                    </View>
                                ) : (
                                    <View className={styles.monthsGrid}>
                                        {MONTH_NAMES.map((month, index) => (
                                            <button
                                                key={month}
                                                type='button'
                                                className={`${styles.monthButton} ${
                                                    index === currentMonth.getMonth() ? styles.selected : ''
                                                } ${isMonthDisabled(index) ? styles.disabled : ''}`}
                                                onClick={() => !isMonthDisabled(index) && handleMonthSelect(index)}
                                                disabled={isMonthDisabled(index)}>
                                                <Typography variant='button__forms14_book'>
                                                    {month.substring(0, 3)}
                                                </Typography>
                                            </button>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}

                        <View className={styles.weekdays}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                <Typography
                                    key={`${day}-${index}`}
                                    variant='button__forms12_book'
                                    className={styles.weekday}>
                                    {day}
                                </Typography>
                            ))}
                        </View>

                        <View className={styles.days}>
                            {days.map((day, index) => (
                                <button
                                    key={index}
                                    type='button'
                                    className={`${styles.day} ${day ? styles.dayActive : styles.dayEmpty} ${
                                        day && isSelected(day) ? styles.selected : ''
                                    } ${day && isDisabled(day) ? styles.disabled : ''}`}
                                    onClick={() => day && !isDisabled(day) && handleDateSelect(day)}
                                    disabled={!day || isDisabled(day)}>
                                    {day && <Typography variant='button__forms14_book'>{day.getDate()}</Typography>}
                                </button>
                            ))}
                        </View>
                    </div>
                )}
            </div>
        </Box>
    );
}
