/**
 * NOTE:
 * This MVP calculates streaks using UTC calendar days.
 * In production, each user's timezone should be stored
 * and used when grouping journal entries by date.
 */

function getUTCDateString(date) {
    return date.toISOString().split("T")[0];
}

function calculateStreak(entries) {

    if (!entries || entries.length === 0) {
        return 0;
    }

    // Unique writing dates
    const uniqueDates = new Set();

    for (const entry of entries) {
        uniqueDates.add(getUTCDateString(entry.createdAt));
    }

    const today = new Date();

    const todayString = getUTCDateString(today);

    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const yesterdayString = getUTCDateString(yesterday);

    let currentDate;

    // If user wrote today, streak starts today.
    if (uniqueDates.has(todayString)) {
        currentDate = new Date(today);
    }
    // Otherwise, if user wrote yesterday,
    // streak starts yesterday.
    else if (uniqueDates.has(yesterdayString)) {
        currentDate = new Date(yesterday);
    }
    // Otherwise streak is broken.
    else {
        return 0;
    }

    let streak = 0;

    while (true) {

        const dateString = getUTCDateString(currentDate);

        if (!uniqueDates.has(dateString)) {
            break;
        }

        streak++;

        currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    }

    return streak;
}

module.exports = calculateStreak;