

export default function randomPostId () {
    const numbers = "1234567890"
    const letters = "abcdefghijklmnopqrstuvwxyz"
    const idlength = 12

    let id = ""

    for (let i = 0; i < idlength; i++) {
        if (i%2 == 0) {
            id += `${letters[Math.floor(Math.random() * letters.length)]}`
        } else if ((idlength - i)%3 == 1) {
            id += `${letters[Math.floor(Math.random() * letters.length)].toLocaleUpperCase()}`
        } else {
            id += `${numbers[Math.floor(Math.random() * numbers.length)]}`
        }
    }

    return `POST${id}${Date.now()}`
}