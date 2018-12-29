import BaseClass from "../../../core/base/BaseClass";

/**
 * by yanmingjie
 */

export enum AniType {
    BONE = 0,
    FRAME
}

class MainData extends BaseClass {

    public mapId: number;
    public aniNum: number;
    public aniType: number;

    public constructor() {
        super()
        this.init();
    }

    private init(): void {
        this.mapId = 1000;
        this.aniNum = 100;
        this.aniType = AniType.BONE;
    }

}

export const mainData: MainData = MainData.getIns<MainData>();