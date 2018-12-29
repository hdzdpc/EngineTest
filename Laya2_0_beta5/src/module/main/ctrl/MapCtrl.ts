import { eventManage } from "../../../core/manage/EventManage";
import MainEvent from "../const/MainEvent";
import { mainData, AniType } from "../const/MainData";
import { displayUtils } from "../../../core/utils/DisplayUtils";
import { mathUtils } from "../../../core/utils/MathUtils";

export type Sk_Ani = Laya.Skeleton | Laya.Animation;

/**
 * by yanmingjie
 */
export default class MapCtrl extends Laya.Script {
    // 地图
    private _tiled: Laya.TiledMap;
    // 动画数组
    private _aniArr: Array<Sk_Ani>;

    private _x: number = 0;
    private _y: number = 0;
    private _addX: boolean = true;
    private _addY: boolean = true;

    public constructor() {
        super();
    }

    public onAwake(): void {
        this._tiled = new Laya.TiledMap();

        this.createMap();
        this._aniArr = [];
    }

    public onEnable(): void {
        eventManage.on(MainEvent.ANI_NUM_CHANGE, this, this.onNumChange);
        eventManage.on(MainEvent.ANI_TYPE_CHANGE, this, this.onTypeChange);
    }

    public onDisable(): void {
        Laya.timer.clear(this, this.moveMap);
        Laya.Tween.clearAll(this);

        eventManage.off(MainEvent.ANI_NUM_CHANGE, this, this.onNumChange);
        eventManage.off(MainEvent.ANI_TYPE_CHANGE, this, this.onTypeChange);
    }

    private onNumChange(): void {
        if (!this._aniArr) return;

        const chageNum: number = mainData.aniNum - this._aniArr.length;
        const isAdd: boolean = chageNum > 0 ? true : false;
        const len: number = Math.abs(chageNum);
        const roleLayer: Laya.Sprite = this.owner.getChildByName('roleLayer') as Laya.Sprite;
        const aniType: number = mainData.aniType;

        let role: Sk_Ani;
        for (let i = 0; i < len; i++) {
            if (isAdd) {
                role = this.getRole(aniType, roleLayer);
                this._aniArr.push(role);
            }
            else {
                if (this._aniArr.length <= 0) break;

                role = this._aniArr.pop();
                this.recycleRole(role, aniType);
            }
        }
    }

    private onTypeChange(): void {
        let len: number = this._aniArr.length;
        let role: Sk_Ani;

        for (let i = 0; i < len; i++) {
            role = this._aniArr[i];
            if (role instanceof Laya.Skeleton) {
                this.recycleRole(role, AniType.BONE);
            }
            else if (role instanceof Laya.Animation) {
                this.recycleRole(role, AniType.FRAME);
            }
            this._aniArr.splice(i, 1);
            --i;
            --len;
        }

        // 添加动画
        this.onNumChange();
    }

    private recycleRole(role: Sk_Ani, aniType: number): void {
        const sign: string = `role${aniType}`;

        role.stop();
        role.removeSelf();
        Laya.Pool.recover(sign, role);
    }

    private getRole(aniType: number, parent: Laya.Sprite): Sk_Ani {
        const sign: string = `role${aniType}`;
        let role: Sk_Ani = Laya.Pool.getItem(sign);
        const _x: number = mathUtils.random(0, 640);
        const _y: number = mathUtils.random(0, 1136);

        if (!role) {
            if (aniType === AniType.BONE) {
                role = displayUtils.createSkeleton(_x, _y, 'res/ani/SwordsMan', 0);
            }
            else if (AniType.FRAME) {
                role = displayUtils.createAnimation(_x, _y, 'res/ani/Swordsman_attack1.json');
                role.pivot(94, 172);
                role.interval = 60;
            }
        }

        if (role instanceof Laya.Skeleton) {
            role.play('attack1', true);
        }
        else if (role instanceof Laya.Animation) {
            role.play();
        }
        parent && parent.addChild(role);

        return role;
    }

    private createMap(mapId: number = mainData.mapId): void {
        const url: string = `res/map/${mapId}.json`;
        const rectangle: Laya.Rectangle = new Laya.Rectangle(0, 0, 640, 1136);
        const mapLayer: Laya.Sprite = this.owner.getChildByName('mapLayer') as Laya.Sprite;

        this._tiled.createMap(url, rectangle, Laya.Handler.create(this, () => {
            mapLayer.addChild(this._tiled.mapSprite());
            this.x = this._tiled.viewPortX;
            this.y = this._tiled.viewPortY;
            Laya.timer.loop(3000, this, this.moveMap);
        }));
    }

    private moveMap(): void {
        const wX: number = 1440;
        const hY: number = 864;
        const changNum: number = 200;

        if (this.x >= wX) { this._addX = false; }
        else if (this.x <= 0) { this._addX = true; }
        if (this.y >= hY) { this._addY = false; }
        else if (this.y <= 0) { this._addY = true; }

        const changeNumX: number = this._addX ? changNum : -changNum;
        const changeNumY: number = this._addY ? changNum : -changNum;
        let toX: number = this.x + changeNumX;
        let toY: number = this.y + changeNumY;

        if (toX > wX) { toX = wX; }
        else if (toX < 0) { toX = 0; }
        if (toY > hY) { toY = hY; }
        else if (toY < 0) { toY = 0; }

        Laya.Tween.to(this, {x: toX, y: toY}, 2000);
    }

    public get x(): number {
        return this._x;
    }
    public set x(_x: number) {
        this._x = _x;
        if (this._tiled) {
            this._tiled.moveViewPort(_x, this.y);
        }
    }

    public get y(): number {
        return this._y;
    }
    public set y(_y: number) {
        this._y = _y;
        if (this._tiled) {
            this._tiled.moveViewPort(this.x, _y);
        }
    }

}