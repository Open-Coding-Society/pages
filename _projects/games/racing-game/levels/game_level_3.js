class GameLevel3 {
    constructor(gameEnv = {}) {
        this.path = gameEnv.path || "/_projects/games/racing-game";
        this.imageData = {
            name: "level3",
            greeting: "Welcome to the 3rd Annual Spring Grand Prix!",
            src: `${this.path}/images/spring_track_level_3.jpg`,
            pixels: { height: 360, width: 643 }
        };
    }
}
