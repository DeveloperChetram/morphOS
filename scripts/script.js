

const loader = document.querySelector("#loader")
window.addEventListener("load", ()=>{
    setTimeout(()=>{
        loader.style.display="none"

    },3000)
})



document.addEventListener("DOMContentLoaded",()=>{


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
document.querySelector(".windows").addEventListener("click",()=>{
    startDiv.style.opacity = 0;
    startDiv.style.bottom = "-100vh"
    toggle2 = !toggle2;
})






})

