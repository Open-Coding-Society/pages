import GameControl from './GameControl.js';

function startCutstory() {
    var y = document.getElementById("cut-story");
    y.style.display = "none";
    document.getElementById('startGame’).addEventListener(‘click', () => {
        GameControl.startTimer();
        var x = document.getElementById("container");
        if (x.style.display === "none") {
            x.style.display = "block";
        }
        else {
            x.style.display = "none";
        }
        if (y.style.display === "none") {
            y.style.display = "block";
        }
        else {
            y.style.display = "none";
        }
        let cutStory = document.getElementById('cut-story');
        let messages = ["Hi! My name is Mario, and I wish...",
            "I wish I could be just as cool as this guy, Mr. Lopez.",
            "Help me get to the next level to become him!", 
            "Do you want a speed boost?   [Y/N]", 
            "This game was provided by CompSci Inc.", 
            "Turn on multiplayer from the settings tab to play with others."];
        console.log("Message length: " + messages.length);
        function showMessage() {
            var x = cutStory;
            x.className = 'show'; // change class name to show
            //only want to last 3 secs
            setTimeout(function () { x.className = x.className.replace("show", " "); }, 2000); //replace show with an empty string
            setTimeout(function () { x.className = x.className.replace(" ", "hide"); }, 2000);
            console.log("class name after: " + x.className);
        }
        let i = 0;
        let interval = setInterval(() => {
            cutStory.innerText = messages[i];
            showMessage();
            i++;
            if (i == messages.length) {
                clearInterval(interval)
            }
        }, 3000);
    });
}
export default startCutstory;