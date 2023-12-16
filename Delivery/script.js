let show = true;
const menuContent = document.querySelector('.content');
const menuToggle = menuContent.querySelector('.menu-toggle')

menuToggle.addEventListener('click', () => {

    menuContent.classList.toggle('on', show);
    show = !show;
})

/*    Passar para o lado sosinho     */

let count = 1
document.getElementById("radio1").checked = true

setInterval(function(){
    nextImage()
},3000)

function nextImage() {
    count++;
    if(count>4){
        count = 1
    }

    document.getElementById("radio"+count).checked = true

}