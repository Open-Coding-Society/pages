import Multiplayer from './Multiplayer.js';
import createSound from './Sound.js';

class Chat {
    constructor(wordsToAdd){
        this.prohibitedWords = ['westview', 'pee', 'poo', 
        'multiplayer', 'multi', 'leaderboard', 'enemies', 
        'gamelevels', 'interactions', 'sass', 'sassy', 'sas', 
        '911', 'die', 'luigi', 'peach', 'bowser', 'mario', 
        'mr.mortensen', 'mr. mortensen', 'mortensen', 'lopez', 
        'mr.lopez', 'mr. lopez','mister mortensen', 'mister lopez', 
        'aws', 'amazonwebservices', 'amazon', 'amazonweb',
        'shit', 'fuck', 'bitch', 'ass', 'asshole',
        'piss', 'penis', 'kill yourself', 'kys'];

        this.prohibitedWords = this.prohibitedWords.concat(wordsToAdd);
    }

    soundSource = "/game_levels_mp/assets/audio/discord-ping.mp3";
    soundArray = [];

    sendMessage(message, color = "black"){
        message = this.parseMessage(message);  
        Multiplayer.sendData("message", { message, color });
    }

    parseMessage(message){
        this.prohibitedWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            message = message.replace(regex, 'Erm...you can\'t say that here! This is a safe space! o_o ');
        });
        return message;
    }

    get chatBoxContainer(){
        const div = document.createElement("div");
        div.className = "";
        div.id = "chatBoxContainer";

        const div2 = document.createElement("div");
        div2.id = "chatBox";

        const input = document.createElement("input");
        input.id = "chatInput";
        input.type = "text";
        input.placeholder = "Type your message...";

        const colorSelect = document.createElement("select");
        colorSelect.id = "colorSelect";
        colorSelect.innerHTML = `
            <option value="black">Black</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
            <option value="purple">Purple</option>
            <option value="pink">Pink</option>
            <option value="yellow">Yellow</option>
            <option value="orange">Orange</option>
        `;

        const button = document.createElement("button");
        button.id = "chatButton";
        button.innerText = "Send";

        function addMessage(message, name, color){
            const div3 = document.createElement("div");
            const para = document.createElement("p");
            para.innerHTML = `<b style="color:${color};">${name}:</b> ${message}`;
            div3.append(para);
            div2.append(div3);
        }

        const onMessage = () => {
            Multiplayer.removeListener("onMessage");
            Multiplayer.createListener("onMessage", (data) => {
                const message = this.parseMessage(data.message.message);
                addMessage(message, data.name ? data.name : data.id, data.message.color);
                this.soundArray.forEach((d) => {
                    if (d[1] == true) { 
                        d[0].play();
                        d[1] = false;
                        return;
                    }
                });
                const sound = createSound(this.soundSource);
                const arrayToAdd = [sound, true];
                this.soundArray.push(arrayToAdd);
                sound.addEventListener("ended", () => {
                    arrayToAdd[1] = true;
                });
                sound.play();
            });

            let message = input.value;
            const color = colorSelect.value;
            message = this.parseMessage(message);
            addMessage(message, "you", color);
            this.sendMessage(message, color);

            input.value = '';
        };

        button.addEventListener("click", onMessage);

        const keyCheck = (e) => {
            if (e.key == "Enter") {
                onMessage();
            }
        };

        window.addEventListener("keypress", keyCheck);

        div.append(div2);
        div.append(input);
        div.append(colorSelect);
        div.append(button);
        return div;
    }
}

export default Chat;