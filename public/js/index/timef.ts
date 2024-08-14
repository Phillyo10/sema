function formatTime(milliseconds: number) {
    if (milliseconds < 1000) return "few moments ago"

    const seconds = Math.floor(milliseconds/1000)
    if (seconds < 60) return `${seconds}s ago`

    const minutes = Math.floor(seconds/60)
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes/60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours/24)
    if (days < 7) return `${days}d ago`
    
    const weeks = Math.floor(days/7)
    if (weeks < 4) return `${weeks}w ago`
    
    const months = Math.floor(weeks/4)
    if (months < 12) return `${months} ${(months>1)?'months':'month'} ago`
    
    const years = Math.floor(months/12)
    return `${years} ${(years>1)?'years':'year'} ago`
}