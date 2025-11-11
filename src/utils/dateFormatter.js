export const formatDate = (timestamp) => {
  if (!timestamp) return "";

  // Clean microseconds (remove part after '.')
  const cleanTimestamp = timestamp.split(".")[0];
  const date = new Date(cleanTimestamp);

  if (isNaN(date)) return timestamp; // invalid date

  const now = new Date();

  // Check if it's today
  const isToday = date.toDateString() === now.toDateString();

  // Check if it's yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    // Format like "10:45 AM"
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // ✅ ensures AM/PM
    });
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    // Format like "12/03/2025, 10:45 AM"
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  }
};
