import { mainData } from "../const/MainData";
import { eventManage } from "../../../core/manage/EventManage";
import MainEvent from "../const/MainEvent";

/**
 * by yanmingjie
 */
export default class MainUiCtrl extends Laya.Script {

    private _aniComBox: Laya.ComboBox;
    private _numTI: Laya.TextInput;

    public constructor() {
        super();
    }

    public onAwake(): void {
        this._aniComBox = this.owner.getChildByName('aniComBox') as Laya.ComboBox;
        this._numTI = this.owner.getChildByName('numTI') as Laya.TextInput;

        this._aniComBox.selectedIndex = mainData.aniType;
        this._numTI.changeText(`${mainData.aniNum}`);
    }

    public onEnable(): void {
        this._aniComBox.on(Laya.Event.CHANGE, this, this.onChangeAni);
        this._numTI.on(Laya.Event.BLUR, this, this.onChangeTI);
    }

    public onDisable(): void {
        this._aniComBox.off(Laya.Event.CHANGE, this, this.onChangeAni);
        this._numTI.off(Laya.Event.BLUR, this, this.onChangeTI);
    }

    private onChangeAni(): void {
        const index: number = this._aniComBox.selectedIndex;
        if (index !== mainData.aniType) {
            mainData.aniType = index;
            eventManage.event(MainEvent.ANI_TYPE_CHANGE);
        }
    }

    private onChangeTI(): void {
        const numStr: string = this._numTI.text;
        const num: number = Number(numStr);

        if (mainData.aniNum !== num) {
            mainData.aniNum = num;
            eventManage.event(MainEvent.ANI_NUM_CHANGE);
        }
        
        this._numTI.changeText(`${num}`);
    }

}