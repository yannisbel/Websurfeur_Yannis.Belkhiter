import { GraphConstructorComponent } from "src/app/components/graph-constructor/graph-constructor.component";

export class AdventureLevel {
    private graphType: string;
    private graphParams: any[];
    private collectSpeed: number;
    private aiSide: string;
    private difficulty: string;

    constructor(graphType: string, graphParams: any[], speed: number, aiSide: string, difficulty: string) {
        this.graphType = graphType;
        this.graphParams = graphParams;
        this.collectSpeed = speed;
        this.aiSide = aiSide;
        this.difficulty = difficulty;
    }

    getGraphType() { return this.graphType; }

    getGraphParams() { return this.graphParams; }

    /* getOpponentType() { return this.opponentType; } */

    getCollectSpeed() { return this.collectSpeed; }

    getAiSide() { return this.aiSide; }

    getDifficulty() { return this.difficulty;}

    getPlayerRoleName() {
        if(this.aiSide === 'cabbage') {
            return 'de la chèvre';
        } else {
            return 'du collecteur de choux';
        }
    }

}
