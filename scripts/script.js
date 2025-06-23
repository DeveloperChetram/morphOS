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
