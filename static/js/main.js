import { GameHandler } from "./game-handler.js";

let board = []

const gameStartHandler = () => {
    console.log("New game")
    clearBoard()
}

const moveHandler = (player, result, boardState, newestMove) => {
    addPlayerIcon(board[newestMove], player)
}

const gameHandler = new GameHandler(gameStartHandler, moveHandler)

const enableJoinButton = (input) => {
    if (/\S/.test(input.value)) {
        document.querySelector("#btn-join-match").classList.remove("disabled")
    }
    else {
        document.querySelector("#btn-join-match").classList.add("disabled")
    }
}

const joinGame = (playerName) => {
    gameHandler.joinQueue(playerName)
}

const addPlayerIcon = (elem, type) => {
    const icons = {
        "X": document.querySelector("#img-x"),
        "O": document.querySelector("#img-o"),
    }

    const img = icons[type].cloneNode()
    img.removeAttribute("id")
    img.classList.remove("d-none")
    elem.appendChild(img)
}

const clearBoard = () => {
    board.forEach(elem => { 
        while (elem.firstChild) elem.removeChild(elem.lastChild)
    })
}

const setupBoard = () => {
    board = []
    document.querySelectorAll(".tictactoe-cell").forEach((elem, i) => {
        board.push(elem)
        elem.addEventListener("click", () => gameHandler.makeMove(i))
    })
}

const setup = () => {
    gameHandler.connectToAPI()

    const playerNameInput = document.querySelector("#input-player-name")
    playerNameInput.addEventListener("input", e => enableJoinButton(e.target))
    enableJoinButton(playerNameInput)

    document.querySelector("#btn-join-match").addEventListener("click", _ => joinGame(playerNameInput.value))

    setupBoard()

    console.log("Hello")
}

setup()