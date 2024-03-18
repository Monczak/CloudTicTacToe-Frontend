export class GameHandler {
    socket

    isInGame = false

    handleMessage = e => {
        switch (e.intent) {
            case "info":
                console.log(`API Info: ${e.description}`)
                break

            case "error":
                console.error(`API Error: ${e.description}`)

                if (e.description == "Opponent disconnected")
                    this.isInGame = false
                break
        
            case "game_start":
                console.log(`API Game started, playing as ${e.player}, opponent name is ${e.opponentName}`)
                this.isInGame = true
                break

            case "move_result":
                console.log(`API Move result: player ${e.player}, result ${e.moveResult}, board state ${e.boardState}`)
                break

            default:
                console.error(`Unrecognized intent: ${e.intent}`)
                break
        }
    }

    joinQueue = () => {
        const url = new URL("/ws", window.location.href)
        url.protocol = url.protocol.replace("http", "ws")

        this.socket = new WebSocket(url)
        console.log(this.socket)
        this.socket.addEventListener("message", e => handleMessage(JSON.parse(e.data)))
    }

    makeMove = cellIdx => {

    }
}