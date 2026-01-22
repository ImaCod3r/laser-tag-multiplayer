export const gameState = {
    players: [],
    lasers: [],
};

export function bindState(socket) {
    socket.on("stateUpdate", (state) => {
        gameState.players = state.players;
        gameState.lasers = state.lasers;
    });
}