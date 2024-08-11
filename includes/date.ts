

export function currentDate () {
    let date = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let month = months[date.getMonth()];
    return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

export function currentTime() {
    let date = new Date();
    let hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours()
    let minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes()
    return `${hours}:${minutes} ${date.toLocaleTimeString().includes("AM") ? "am" : "pm"}`;
}