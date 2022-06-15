const input = document.querySelector(".file")
const container = document.querySelector(".img-content")
input.addEventListener("change",(e)=>{
	container.style.backgroundImage=`url(${URL.createObjectURL(input.files[0])})`
})