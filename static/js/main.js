import { GameHandler } from "./game-handler.js";

const gameHandler = new GameHandler()

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

const setup = () => {
    gameHandler.connectToAPI()

    const playerNameInput = document.querySelector("#input-player-name")
    playerNameInput.addEventListener("input", e => enableJoinButton(e.target))
    enableJoinButton(playerNameInput)

    document.querySelector("#btn-join-match").addEventListener("click", _ => joinGame(playerNameInput.value))

    console.log("Hello")
}

setup()