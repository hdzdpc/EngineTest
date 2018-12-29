/**
 * by yanmingjie
 */
export enum AniType {
    BONE = 0,
    FRAME
}

class MainData {

    private static _instance: MainData;

    public mapId: number;
    public aniNum: number;
    public aniType: number;

    public static getInstance(): MainData {
        if (!this._instance) {
            this._instance = new MainData();
        }
        return this._instance;
    }

    public constructor() {
        this.init();
    }

    private init(): void {
        this.mapId = 1000;
        this.aniNum = 100;
        this.aniType = AniType.BONE;
    }

}

export const mainData: MainData = MainData.getInstance();