const content = document.querySelector(".contacts")
content.addEventListener("click",(e)=>{
	if(e.target!=container){
		if(e.target.className=="btn edit"){
			const parent = e.target.parentElement.parentElement.parentElement
			const form = document.createElement("form")
			form.innertHTML=`
				<input type="text" value=${parent.children[1].children[0].textContent}>
				<input type="email" value=${parent.children[1].children[2].textContent}>
			`
			parent.children[1].replaceWith(form)
		}	
	}
})