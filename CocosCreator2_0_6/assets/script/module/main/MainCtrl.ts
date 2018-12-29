import MainView from "./MainView";
import MainEvent from "./MainEvent";
import { AniType, mainData } from "./MainData";
import { mathUtils } from "../../core/utils/MathUtils";
const {ccclass} = cc._decorator;

interface RoleDict {
    [type: string]: Array<cc.Node>
}

@ccclass
export default class MainCtrl extends cc.Component {

    // 界面
    private _view: MainView;
    // 缓存
    private _roleCache: RoleDict;
    // 当前角色
    private _roles: RoleDict;

    // 地图
    private _addX: boolean;
    private _addY: boolean;

    public onLoad(): void {
        this._view = this.node.getComponent(MainView);
        this._roleCache = {};
        this._roles = {};
        this._addX = true;
        this._addY = true;
    }

    public onEnable(): void {
        cc.systemEvent.on(MainEvent.ANI_TYPE_CHANGE, this.onChangeAni, this);
        cc.systemEvent.on(MainEvent.ANI_NUM_CHANGE, this.onChangeNum, this);
    }

    public onDisable(): void {
        cc.systemEvent.off(MainEvent.ANI_TYPE_CHANGE, this.onChangeAni, this);
        cc.systemEvent.off(MainEvent.ANI_NUM_CHANGE, this.onChangeNum, this);
    }

    public update(dt: number): void {
        this.moveMap(dt);
    }

    private onChangeAni(): void {
        let len: number;
        let roles: Array<cc.Node>;
        for (let type in this._roles) {
            roles = this._roles[type];
            len = roles.length
            for (let i = 0; i < len; i++) {
                this.recycleRole(Number(type), roles[i]);
            }
        }

        this._roles = {};
        this.onChangeNum();
    }

    private onChangeNum(): void {
        const num: number = mainData.aniNum;
        let currNum: number = 0;
        for (let type in this._roles) {
            currNum += this._roles[type].length;
        }

        let changeNum: number = Math.abs(num - currNum);
        const isAdd: boolean = num - currNum ? true : false;
        const aniType: number = mainData.aniType;
        const roleLayer: cc.Node = this._view.roleLayer;
        let role: cc.Node;
        for (let i = 0; i < changeNum; i++) {
            if (isAdd) {
                role = this.getRole(aniType, roleLayer);
                this.addMap(aniType, role);
            }
            else {
                role = this._roles[aniType].pop();
                this.recycleRole(aniType, role);
                --i;
                --changeNum;
            }
        }
    }

    private addMap(aniType: number, role: cc.Node): void {
        if (!this._roles[aniType]) {
            this._roles[aniType] = [];
        }
        this._roles[aniType].push(role);
    }

    private moveMap(dt: number): void {
        const preMoveNum: number = 1.6;
        const tiledMap: cc.TiledMap = this._view.tiledMap;
        const currX: number = tiledMap.node.x;
        const currY: number = tiledMap.node.y;
        const wX: number = 720;
        const hY: number = 432;

        if (currX >= wX) { this._addX = false; }
        else if (currX <= -wX) { this._addX = true; }
        if (currY >= hY) { this._addY = false; }
        else if (currY <= -hY) { this._addY = true; }

        const changeNumX: number = this._addX ? preMoveNum : -preMoveNum;
        const changeNumY: number = this._addY ? preMoveNum : -preMoveNum;
        let toX: number = currX + changeNumX;
        let toY: number = currY + changeNumY;

        if (toX > wX) { toX = wX; }
        else if (toX < -wX) { toX = -wX; }
        if (toY > hY) { toY = hY; }
        else if (toY < -hY) { toY = -hY; }

        tiledMap.node.setPosition(toX, toY);
    }

    private getRole(aniType: number, parent: cc.Node): cc.Node {
        let role: cc.Node;

        if (this._roleCache[aniType]) {
            role = this._roleCache[aniType].pop();
        }

        if (!role) {
            if (aniType === AniType.BONE) {
                role = cc.instantiate(this._view.bone);
            }
            else if (aniType === AniType.FRAME) {
                role = cc.instantiate(this._view.animation);
            }
        }

        if (parent) {
            const _x: number = mathUtils.random(-320, 320);
            const _y: number = mathUtils.random(-568, 568);

            role.parent = parent;
            role.setPosition(_x, _y);
            // 播放
            if (role.getComponent(cc.Animation)) {
                const animation: cc.Animation = role.getComponent(cc.Animation);
                animation.on(cc.Animation.EventType.STOP, () => {
                    animation.play('Swordsman_attack1', 0);
                }, this);
                animation.play('Swordsman_attack1', 0);
            }
            else if (role.getComponent(dragonBones.ArmatureDisplay)) {
                const bone: dragonBones.ArmatureDisplay = role.getComponent(dragonBones.ArmatureDisplay);
                bone.playAnimation('attack1', 0);
            }
        }

        return role;
    }

    private recycleRole(aniType: number, role: cc.Node): void {
        if (!this._roleCache[aniType]) {
            this._roleCache[aniType] = [];
        }
        this._roleCache[aniType].push(role);
        // 停止动画播放
        if (role.getComponent(cc.Animation)) {
            const animation: cc.Animation = role.getComponent(cc.Animation);
            animation.off(cc.Animation.EventType.STOP);
            animation.stop();
        }
        else if (role.getComponent(dragonBones.ArmatureDisplay)) {
            const bone: dragonBones.ArmatureDisplay = role.getComponent(dragonBones.ArmatureDisplay);
            bone.playAnimation('attack1', 1);
        }
        role.removeFromParent();
    }

}