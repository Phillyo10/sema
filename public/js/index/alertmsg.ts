
type status = 'good' | 'bad'

const AlertMsg = {
    show: (status: status, text: string) => {
        const alertmsgdiv = document.getElementById("alertmsg") as HTMLDivElement
        if (alertmsgdiv == null || text.length >= 100 || text.split(" ").length > 10) return
        const icon = (status == "good") ? `<i class="fa-regular fa-circle-check"></i>` : `<i class="bi bi-x-octagon"></i>`;
        alertmsgdiv.innerHTML = `${icon} ${text}`;
        alertmsgdiv.classList.add("show");
        setTimeout(() => alertmsgdiv.classList.remove("show"), 3000);
    }
}