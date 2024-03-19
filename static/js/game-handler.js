export class GameHandler {
    socket

    isInGame = false
    
    playerType
    opponentName

    onGameStart
    onMove

    constructor(onGameStart, onMove) {
        this.onGameStart = onGameStart
        this.onMove = onMove
    }

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
                this.playerType = e.player
                this.opponentName = e.opponentName
                this.isInGame = true

                this.onGameStart()
                break

            case "move_result":
                console.log(`API Move result: player ${e.player}, result ${e.moveResult}, board state ${e.boardState}, newest move ${e.newestMove}`)

                if (e.moveResult == "winO" || e.moveResult == "winX") {
                    this.isInGame = false
                }

                this.onMove(e.player, e.moveResult, e.boardState, e.newestMove)
                break

            case "pingpong":
                console.log(`Keep alive worked`)
                break

            default:
                console.error(`Unrecognized intent: ${e.intent}`)
                break
        }
    }

    connectToAPI = () => {
        const url = new URL("/ws", window.location.href)
        url.protocol = url.protocol.replace("http", "ws")

        this.socket = new WebSocket(url)
        console.log(this.socket)
        this.socket.addEventListener("open", e => {
            console.log("Connected to API")
            setInterval(this.keepAlive, 10000)
        })
        this.socket.addEventListener("close", e => console.error("API connection closed"))
        this.socket.addEventListener("message", e => this.handleMessage(JSON.parse(e.data)))
    }

    keepAlive = () => {
        this.sendData("pingpong")
    }

    joinQueue = (playerName) => {
        if (!this.isInGame) {
            this.sendData("join_match", {"playerName": playerName})  
        }
    }

    sendData = (intent, data) => {
        this.socket.send(JSON.stringify({"intent": intent, ...data}))
    }

    makeMove = cellIdx => {
        this.sendData("make_move", {"cellIdx": cellIdx})
    }
}