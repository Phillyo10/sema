
type PUserAuth = {
    userid: string,
    username: string,
    dname: string,
    password: string,
    pfp: string,
    verified: boolean
}

type UserStat = {
    posts: number,
    followers: number,
    following: number
}

function element(id=""): HTMLElement | undefined {
    if (id == "") return
    const elmnt = document.getElementById(`${id}`) as HTMLElement | null
    if (elmnt == null) return
    return elmnt
}

async function getuserpfp() {
    return new Promise((resolve) => {
        $.post("/getuserpfp", {}, (data: string, status) => {
            if (data !== "") {
                resolve(data)
            }
        })
    })
}

async function getuser() {
    return new Promise((resolve) => {
        $.post("../getuserc", {}, (data, status) => {
            if (data !== "fail") {
                let userdata = JSON.parse(data)
                user.dname = userdata.dname
                user.username = userdata.username
                resolve([userdata.dname, userdata.username, userdata.verified])
            }
        })
    })
}

async function updateprofilenames(dname: string, username: string) {
    return new Promise((resolve) => {
        $.post("../updateprofilenames", {
            dname: dname,
            username: username
        }, (data, status) => {
            if (data !== "fail") resolve("Updated")
        })
    })
}

let user = {dname: "", username: ""}

const mainDisplayName = document.querySelector<HTMLDivElement>("#main-dname")
const mainUserName = document.querySelector<HTMLDivElement>("#main-username")

const displaynameinput = document.querySelector<HTMLInputElement>("#display-name")
const usernameinput = document.querySelector<HTMLInputElement>("#user-name")
const saveProfileButton = document.querySelector<HTMLButtonElement>("#save-changes-btn")
saveProfileButton?.addEventListener("click", async () => {
    if (displaynameinput?.value == null || usernameinput?.value == null) return
    if (user.dname == "" || user.username == "") return
    if (displaynameinput.value == user.dname && usernameinput.value == user.username) return
    await updateprofilenames(displaynameinput.value, usernameinput.value).then(async (data) => {
        if (data == "Updated") AlertMsg.show("good", `${data}`);
        await loadUserStats()
    })
})

const editProfilePictureButton = document.querySelector<HTMLDivElement>("#editpfp")
editProfilePictureButton?.addEventListener("click", async () => {
    await getuserpfp().then((data: any) => {
        let modal = new ProfilePictureModal(data).show((value: string) => {
            $.post("/updatepfp", { image: value }, async (data, status) => {
                if (data !== "fail") AlertMsg.show("good", "Updated Profile Picture!"); else AlertMsg.show("bad", "Failed to update profile picture")
                await loadUserStats()
            })
        })
    })
})

const backToHomeButton = document.querySelector<HTMLButtonElement>("#back-to-home")
backToHomeButton?.addEventListener("click", () => {
    window.location.assign("/")
})

const logoutButton = document.querySelector<HTMLButtonElement>("#logout-btn");
logoutButton?.addEventListener("click", () => {
    let alertmodal = new AlertModal();
    alertmodal.show({ title: "Logout?", text: "Are you sure you want to log out of your SEMA account?" }, () => {
        window.location.assign("/logout")
    })
})

async function loadUserStats() {
    $.post("/userstats", {}, (data, status) => {
        const profilestats = JSON.parse(data);
        const labels = [((parseInt(profilestats[0]) < 2) ?  "Post" : "Posts"), "Followers", "Following"]
        const statselement = element("stats")
        if (statselement == null || statselement == undefined) return
        statselement.innerHTML = ""
        for (let i = 0; i < profilestats.length; i++) {
            statselement.innerHTML += `<div class="stat"><span class="value">${profilestats[i]}</span> ${labels[i]}</div>`
        }
    })

    await getuserpfp().then((data: any) => {
        const pfpsElements = document.querySelectorAll("#pfp")
        pfpsElements.forEach((pfpelement) => {
            pfpelement.setAttribute("src", data)
        })
    })

    await getuser().then((data: any) => {
        if (mainDisplayName == null || mainUserName == null) return
        if (displaynameinput?.value == null || usernameinput?.value == null) return
        if (data == null) return
        displaynameinput.value = data[0]
        usernameinput.value = data[1]
        mainDisplayName.innerHTML = `${data[0]} ${(data[2] == true) ? `<i class="bi bi-patch-check-fill"></i>` : ""}`
        mainUserName.innerHTML = `@${data[1]}`
    })
}
loadUserStats()