class Scoreboard {
    static initUI() {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'stats-container';
        statsContainer.style.position = 'fixed';
        statsContainer.style.top = '75px';
        statsContainer.style.right = '10px';
        statsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statsContainer.style.color = 'white';
        statsContainer.style.padding = '10px';
        statsContainer.style.borderRadius = '5px';

        statsContainer.innerHTML = `
            <div>Balance: <span id="balance">0</span></div>
            <div>Question Accuracy: <span id="questionAccuracy">0%</span></div>
        `;

        document.body.appendChild(statsContainer);
    }

    static update({ balance, questionAccuracy }) {
        if (balance !== undefined) {
            document.getElementById("balance").textContent = balance;
            localStorage.setItem("balance", balance);
        }
        if (questionAccuracy !== undefined) {
            const percent = Math.round(questionAccuracy * 100);
            document.getElementById("questionAccuracy").textContent = `${percent}%`;
            localStorage.setItem("questionAccuracy", `${percent}%`);
        }
    }
}
export default Scoreboard;
