function lose(){
    var loseid = sessionStorage.getItem("lostBy");
    console.log(loseid);
    var exp = document.getElementById("loseText");
    exp.innerHTML = "testttttt";
    if(loseid=="money"){
        exp.innerHTML="You ran out of money!";
    }
    if(loseid=="war"){
        exp.innerHTML="You were unprepared for war:(";
    }
    if(loseid=="sad"){
        exp.innerHTML="Your citizens were unhappy with your governance, and left the country in shambles:(";
    }
    if(loseid=="lack of people"){
        exp.innerHTML="You lost all your citizens? somehow??";
    }
}

lose();
