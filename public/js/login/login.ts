
const loginButton = document.getElementById("signinbtn") as HTMLButtonElement
const errorAlert = document.querySelector<HTMLDivElement>("#alert")

loginButton.addEventListener("click", () => {
    const username = document.querySelector<HTMLInputElement>("#username")
    const password = document.querySelector<HTMLInputElement>("#password")

    if (username?.value == "" || username?.value == null) return
    if (password?.value == "" || password?.value == null) return
    if (!errorAlert) return

    $.post("/loginreq", {
        username: username.value,
        pwd: password.value
    }, (data, status) => {
        if (data !== "granted") errorAlert.innerHTML = "Incorrect Username and Password"; else window.location.assign("/")
    })
})