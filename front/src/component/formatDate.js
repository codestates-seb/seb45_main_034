export default function formatDate(date) {
    const now = new Date();
    const diff = now - date;
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
  
    if (years > 0) {
      return years === 1 ? "1 년 전" : `${years} 년 전`;
    } else if (months > 0) {
      return months === 1 ? "1 개월 전" : `${months} 개월 전`;
    } else if (days > 0) {
      return days === 1 ? "1 일 전" : `${days} 일 전`;
    } else if (hours > 0) {
      return hours === 1 ? "1 시간 전" : `${hours} 시간 전`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 분 전" : `${minutes} 분 전`;
    } else {
      return seconds === 1 ? "1 초 전" : `${seconds} 초 전`;
    }
  }