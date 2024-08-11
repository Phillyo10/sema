

const signupButton = document.getElementById("signunbtn") as HTMLButtonElement
const errorAlert1 = document.querySelector<HTMLDivElement>("#alert")

signupButton.addEventListener("click", () => {
    const displayname = document.querySelector<HTMLInputElement>("#displayname")
    const username = document.querySelector<HTMLInputElement>("#username")
    const password = document.querySelector<HTMLInputElement>("#password")
    const passwordagain = document.querySelector<HTMLInputElement>("#password-again")

    if (displayname?.value == "" || displayname?.value == null) return
    if (username?.value == "" || username?.value == null) return
    if (password?.value == "" || password?.value == null) return
    if (passwordagain?.value == "" || passwordagain?.value == null) return
    if (!errorAlert1) return

    if (passwordagain.value !== password.value) {
        errorAlert1.innerHTML = "Passwords don't match"
    } else if (password.value.length < 4) {
        errorAlert1.innerHTML = "Password must be at least 4 characters"
    } else if (!/[0-9]/.test(password.value)) {
        errorAlert1.innerHTML = "Password must contain at least 1 number"
    } else {
        $.post("/signupreq", {
            dname: displayname.value,
            username: username.value,
            pwd: password.value
        }, (data, status) => {
            if (data !== "granted") errorAlert1.innerHTML = "Error: There was a problem while creating your account"; else window.location.assign("/")
        })
    }

})