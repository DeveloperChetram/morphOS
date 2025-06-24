

const loader = document.querySelector("#loader")
window.addEventListener("load", () => {
    setTimeout(() => {
        loader.style.display = "none"

    }, 3000)
})



document.addEventListener("DOMContentLoaded", () => {


    const navBtn = document.querySelector(".nav-icons")
    const cPenel = document.querySelector(".control-panel-div")

    let toggle = false;

    navBtn.addEventListener('click', () => {
        if (toggle) {
            // cPenel.style.display = "none";
            cPenel.style.opacity = 0;
            cPenel.style.top = "-500px"

        } else {
            // cPenel.style.display = "block";
            cPenel.style.opacity = 1;
            cPenel.style.top = " calc(20px + 1.9rem)"
        }
        toggle = !toggle;
    })

    const searchBtn = document.querySelector(".search")
    const startBtn = document.querySelector("#start")
    const startDiv = document.querySelector(".start-div")

    let toggle2 = false;
    startBtn.addEventListener('click', () => {
        if (toggle2) {

            startDiv.style.opacity = 0;
            startDiv.style.bottom = "-100vh"

        } else {

            startDiv.style.opacity = 1;
            startDiv.style.bottom = " 5rem"
        }
        toggle2 = !toggle2;
    })
    searchBtn.addEventListener('click', () => {
        if (toggle2) {
            // cPenel.style.display = "none";
            // startDiv.style.opacity = 0;
            // startDiv.style.bottom = "-100vh"

        } else {
            // cPenel.style.display = "block";
            startDiv.style.opacity = 1;
            startDiv.style.bottom = " 5rem"
            toggle2 = !toggle2;
        }
    })
    document.querySelector(".windows").addEventListener("click", () => {
        startDiv.style.opacity = 0;
        startDiv.style.bottom = "-100vh"
        toggle2 = !toggle2;
    })
    // date and time system 

    const time = document.querySelector(".time")
    const date = document.querySelector(".date")
    // Tue Jun 24 2025 17:16:26 GMT+0530 (India Standard Time)
    setInterval(() => {
        let currentDate = new Date
        time.innerHTML = `<span class="time">${currentDate.getHours()}:${currentDate.getMinutes()}</span>`
        date.innerHTML = `<span class="date">${currentDate.getDate() < 9 ? "0" : ""}${currentDate.getDate()}:${currentDate.getMonth() < 9 ? "0" : ""}${currentDate.getMonth()}:${currentDate.getFullYear()}</span>`
        // console.log()
    }, 5000)

    // dynamic apps 
    let appsHTML=``;
    const app =
        [
            "chatgpt.svg",
            "chrome.svg",
            "discord.svg",
            "figma.svg",
            "File Explorer.svg",
            "github.svg",
            "Microsoft Photos.svg",
            "npm.svg",
            "Recycle Bin.svg",
            "start.svg",
            "terminal.svg",
            "This Pc.svg",
        
            
        ]

app.forEach((appName)=>{
appsHTML += `<div class="start-apps-perticular"> <img class="${appName.split(".")[0]}" src="./assets/icons/${appName}" alt=""> <span>${appName.split(".")[0]}</span></div>`
})
document.querySelector(".start-apps").innerHTML=appsHTML
})

