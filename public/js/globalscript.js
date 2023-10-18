

document.body.addEventListener("pointerup",PointerAndTouchUp)
document.body.addEventListener("touchend",PointerAndTouchUp)

function PointerAndTouchUp(e){
    document.querySelectorAll(".highlightEffect").forEach(n=>{n.classList.remove("highlightEffect")})

}

$("#userMessageModal").addEventListener("click", (e) => {closeModalOnOutsideClick(e, $("#userMessageModal"))})
$("#profileModal").addEventListener("click", (e) => {closeModalOnOutsideClick(e, $("#profileModal"))})

function closeModalOnOutsideClick(e,elem){
    const dialogDimensions = elem.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
        elem.close()
    }

}