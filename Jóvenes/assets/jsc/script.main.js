var modal = document.getElementById("myModal");
//var btn = document.getElementById("myBtn");
// var span = document.getElementsByClassName("close")[0];
var btn_close = document.getElementsByClassName("btn-close")[0];
//btn.onclick = () => modal.style.display = "block";

// span.onclick = () => modal.style.display = "none";
//btn_close.onclick = () => modal.style.display = "none";


window.onclick = (event) =>  {
    if (event.target == modal) modal.style.display = "none";
}