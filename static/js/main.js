const enableJoinButton = (input) => {
    if (/\S/.test(input.value)) {
        document.querySelector("#btn-join-match").classList.remove("disabled")
    }
    else {
        document.querySelector("#btn-join-match").classList.add("disabled")
    }
}


const setup = () => {
    const playerNameInput = document.querySelector("#input-player-name")
    playerNameInput.addEventListener("input", e => enableJoinButton(e.target))
    enableJoinButton(playerNameInput)

    
}

setup()