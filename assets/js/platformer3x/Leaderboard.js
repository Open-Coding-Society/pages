import GameControl from "./GameControl.js";
import GameEnv from "./GameEnv.js";
import Socket from "./Multiplayer.js";

const Leaderboard = {
    currentKey: "localTimes",
    currentPage: 1,
    rowsPerPage: 10,
    isOpen: false,
    detailed: false,
    dim: false,
    currentSort: "time-l",

    getTimeSortedLeaderboardData (slowestFirst) {
        const localData = JSON.parse(localStorage.getItem(this.currentKey))
        if (!localData) {
            console.log("NO DATA")
            return []
        }
        localData.sort((a, b) => a.time - b.time);
        if (slowestFirst) {
            localData.reverse()
        }
        
        return localData
    }, 

    getCoinScoreSortedLeaderboardData (highestFirst) {
        const localData = JSON.parse(localStorage.getItem(this.currentKey))
        if (!localData) {
            console.log("NO DATA")
            return []
        }
        localData.sort((a, b) => a.coinScore - b.coinScore);
        if (highestFirst) {
            localData.reverse()
        }

        return localData
    }, 

    getDateSortedLeaderboardData (newestFirst) {
        const localData = JSON.parse(localStorage.getItem(this.currentKey))
        if (!localData) {
            console.log("NO DATA")
            return []
        }

        localData.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)

            return dateA - dateB
        })
        //defaults to oldest first
        if (newestFirst) {
            localData.reverse()
        }
        console.log(localData)
        return localData
    },

    backgroundDim: {
        create () {
            this.dim = true // sets the dim to be true when the leaderboard is opened
            console.log("CREATE DIM")
            const dimDiv = document.createElement("div");
            dimDiv.id = "dim";
            dimDiv.style.backgroundColor = "black";
            dimDiv.style.width = "100%";
            dimDiv.style.height = "100%";
            dimDiv.style.position = "absolute";
            dimDiv.style.opacity = "0.8";
            document.body.append(dimDiv);
            dimDiv.style.zIndex = "9998"
            dimDiv.addEventListener("click", Leaderboard.backgroundDim.remove)
        },
        remove () {
            this.dim = false
            console.log("REMOVE DIM");
            const dimDiv = document.getElementById("dim");
            dimDiv.remove();
            Leaderboard.isOpen = false
            leaderboardDropDown.style.width = this.isOpen?"70%":"0px";
            leaderboardDropDown.style.top = this.isOpen?"15%":"0px";
            leaderboardDropDown.style.left = this.isOpen?"15%":"0px";
        },
    },

    createDetailToggle() {
        document.getElementById("detail-toggle-section")?.remove()

        const buttonSection = document.createElement("div")
        buttonSection.style.width = "100%"
        buttonSection.id = "detail-toggle-section"
        buttonSection.style.display = "flex"
        buttonSection.style.alignItems = "center"
        buttonSection.style.justifyContent = "end"

        const toggleButton = document.createElement("button")
        toggleButton.style.width = "20%"
        toggleButton.innerText = Leaderboard.detailed ? "[Close]":"[Expand]"
        buttonSection.append(toggleButton)
        
        toggleButton.addEventListener("click", this.toggleDetails)

        return buttonSection
    },

    createSortToggle (parent) {
        const toggleBtn = document.createElement("button")
        const columnTitle = document.createElement("div")

        columnTitle.innerText = parent.innerText

        toggleBtn.innerText = "sort" //default text

        if (Leaderboard.currentSort.slice(0, -2) == columnTitle.innerText.toLowerCase()) {
            toggleBtn.innerText = "greatest" // currentlly sorted with greatest first
            if (Leaderboard.currentSort.slice(-1) == "l") {
                toggleBtn.innerText = "least" //currently sorted with least first
            }
        }

        toggleBtn.id = `${columnTitle.innerText.toLowerCase()}-toggle-sort`
        toggleBtn.style.width = "100%"

        parent.innerText = ""
        parent.style.justifyContent = "center"

        toggleBtn.addEventListener("click", () => {
            if (Leaderboard.currentSort == `${columnTitle.innerText.toLowerCase()}-l`) {
                Leaderboard.currentSort = `${columnTitle.innerText.toLowerCase()}-g` //if the current sort is this one, and it is on least change it to greatest
            } else {
                Leaderboard.currentSort = `${columnTitle.innerText.toLowerCase()}-l` //if it reaches here, the current sort is on greatest, and needs to change to least
            }
        })

        toggleBtn.addEventListener("click", Leaderboard.updateLeaderboardDisplay) //refresh display after 

        parent.append(columnTitle, toggleBtn)
    },

    sortData () {
        if (Leaderboard.currentSort == "time-l") {
            return Leaderboard.getTimeSortedLeaderboardData()
        }
        if (Leaderboard.currentSort == "date-l") {
            return Leaderboard.getDateSortedLeaderboardData()
        }
        if (Leaderboard.currentSort == "score-l") {
            return Leaderboard.getCoinScoreSortedLeaderboardData()
        }
        if (Leaderboard.currentSort === "time-g") {
            return Leaderboard.getTimeSortedLeaderboardData(true)
        }
        if (Leaderboard.currentSort === "date-g") {
            return Leaderboard.getDateSortedLeaderboardData(true)
        }
        if (Leaderboard.currentSort === "score-g") {
            return Leaderboard.getCoinScoreSortedLeaderboardData(true)
        }
    },

    createLeaderboardDisplayTable () {
        const table = document.createElement("table");
        table.className = "table scores"
        const header = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.innerText = "Name";
        header.append(th1);
        const th2 = document.createElement("th");
        th2.innerText = "Time";
        this.createSortToggle(th2)
        header.append(th2);
        const th3 = document.createElement("th");
        th3.innerText = "Score";
        this.createSortToggle(th3)
        header.append(th3);
        const th4 = document.createElement("th");
        th4.innerText = "Difficulty";
        th4.hidden = !Leaderboard.detailed
        header.append(th4);
        const th5 = document.createElement("th");
        th5.innerText = "Game Speed";
        th5.hidden = !Leaderboard.detailed
        header.append(th5);
        const th6 = document.createElement("th");
        th6.innerText = "Date";
        th6.hidden = !Leaderboard.detailed
        this.createSortToggle(th6)
        header.append(th6);

        table.append(header);

        return table
    },

    toggleDetails() {
        Leaderboard.detailed = !Leaderboard.detailed

        Leaderboard.updateLeaderboardDisplay()
    },

    createPagingButtonsRow() {
        const data = Leaderboard.getTimeSortedLeaderboardData()

        const pagingButtonsRow = document.createElement("div")
        pagingButtonsRow.id = "paging-buttons-row"
        pagingButtonsRow.style.display = "grid"
        pagingButtonsRow.style.gridTemplateColumns = "auto auto auto"
        pagingButtonsRow.style.textAlign = "center"
        pagingButtonsRow.style.width = "100%"

        const backButton = document.createElement("button")
        backButton.innerText = "<"
        backButton.style.width = "100%"
        pagingButtonsRow.append(backButton)

        const pageDisplay = document.createElement("span")
        pageDisplay.textContent = `${this.currentPage} of ${Math.ceil(data.length/Leaderboard.rowsPerPage)}`
        pagingButtonsRow.append(pageDisplay)
        // pagingButtonsRow.innerText = `${this.currentPage} of ${Math.ceil(data.length/Leaderboard.rowsPerPage)}`

        const frontButton = document.createElement("button")
        frontButton.innerText = ">"
        frontButton.style.width = "100%"
        pagingButtonsRow.append(frontButton)

        backButton.addEventListener("click", this.backPage)
        frontButton.addEventListener("click", this.frontPage)

        return pagingButtonsRow
    },

    createClearLeaderboardButton() {
        const clearButtonRow = document.createElement("div")
        clearButtonRow.id = "clear-button-row"
        clearButtonRow.style.textAlign = "center"
        const clearButton = document.createElement("button")
        clearButton.innerText = "CLEAR TABLE"
        clearButton.style.width = '50%'
        clearButtonRow.append(clearButton)

        clearButton.addEventListener("click", this.clearTable)

        return clearButtonRow
    },

    clearTable () {
        const table = document.getElementsByClassName("table scores")[0]

        localStorage.removeItem(Leaderboard.currentKey)

        Leaderboard.currentPage = 1

        if (table) {
            table.remove() //remove old table if it is there
        }
        Leaderboard.updateLeaderboardDisplay()
    },
    
    updateLeaderboardTable () {
        const table = this.createLeaderboardDisplayTable()
        const startPage = (this.currentPage-1)*this.rowsPerPage
        const data = Leaderboard.sortData()
        const displayData = data.slice(startPage, startPage+this.rowsPerPage)
        
        displayData.forEach(score => {
            const row = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.innerText = score.userID;
            row.append(td1);
            const td2 = document.createElement("td");
            td2.innerText = (score.time/1000);
            row.append(td2);
            const td3 = document.createElement("td");
            td3.innerText = score.coinScore;
            row.append(td3);
            table.append(row);
            const td4 = document.createElement("td");
            if (score.difficulty) {
                td4.innerText = score.difficulty;
            }
            td4.hidden = !this.detailed
            row.append(td4);
            table.append(row);
            const td5 = document.createElement("td");
            if (score.gameSpeed) {
                td5.innerText = score.gameSpeed;
            }
            td5.hidden = !this.detailed
            row.append(td5);
            const td6 = document.createElement("td");
            if (score.date) {
                const date = new Date(score.date)
                td6.innerText = `${date.getMonth()+1}/${date.getDate()}`
            }
            td6.hidden = !this.detailed
            row.append(td6);
            table.append(row);
        });
        
        return table
    },

    updateLeaderboardDisplay () {
        const table = document.getElementsByClassName("table scores")[0]
        const detailToggleSection = document.getElementById("detail-toggle-section")
        const clearButtonRow = document.getElementById("clear-button-row")
        const pagingButtonsRow = document.getElementById("paging-buttons-row")

        if (detailToggleSection) {
            detailToggleSection.remove()
        }

        if (table) {
            table.remove() //remove old table if it is there
        }

        if (pagingButtonsRow) {
            pagingButtonsRow.remove()
        }

        if (clearButtonRow) {
            clearButtonRow.remove()
        }

        document.getElementById("leaderboardDropDown").append(Leaderboard.createDetailToggle())
        document.getElementById("leaderboardDropDown").append(Leaderboard.updateLeaderboardTable()) //update new leaderboard
        document.getElementById("leaderboardDropDown").append(Leaderboard.createPagingButtonsRow())
        document.getElementById("leaderboardDropDown").append(Leaderboard.createClearLeaderboardButton())
    },

    backPage () {
        const table = document.getElementsByClassName("table scores")[0]

        if (Leaderboard.currentPage - 1 == 0) {
            return;
        }
    

        Leaderboard.currentPage -= 1

        Leaderboard.updateLeaderboardDisplay()
    },
    
    frontPage () {
        const data = Leaderboard.getTimeSortedLeaderboardData()

        console.log(data.length/Leaderboard.rowsPerPage)

        if (Leaderboard.currentPage + 1 > Math.ceil(data.length/Leaderboard.rowsPerPage)) {
            return
        }

        Leaderboard.currentPage += 1

        Leaderboard.updateLeaderboardDisplay()
        
    },

    openLeaderboardPanel () {
            leaderboardTitle.innerHTML = "Local Leaderboard";

            // toggle isOpen
            this.isOpen = true
            // open and close properties for sidebar based on isOpen
            const table = document.getElementsByClassName("table scores")[0]

            if (this.isOpen) {
                Leaderboard.backgroundDim.create()
                if (table) {
                    table.remove() //remove old table if it is there
                }
                Leaderboard.updateLeaderboardDisplay()
            }

            const leaderboardDropDown = document.querySelector('.leaderboardDropDown');
            leaderboardDropDown.style.width = this.isOpen?"70%":"0px";
            leaderboardDropDown.style.top = this.isOpen?"15%":"0px";
            leaderboardDropDown.style.left = this.isOpen?"15%":"0px";
    },
    
    initializeLeaderboard () {
        const leaderboardTitle = document.createElement("div");
        leaderboardTitle.id = "leaderboardTitle";
        document.getElementById("leaderboardDropDown").appendChild(leaderboardTitle);
        document.getElementById("leaderboardDropDown").append(this.updateLeaderboardTable())

        document.getElementById("leaderboard-button").addEventListener("click",Leaderboard.openLeaderboardPanel)
    },

}
    
export default Leaderboard;