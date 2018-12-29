import MainView from "../MainView";
import { eventManage } from "../../../core/manage/EventManage";
import MainEvent from "../const/MainEvent";

/**
 * by yanmingjie
 */
export default class MainCtrl extends Laya.Script {

    /**
     * @prop {name:map, tips:"地图层", type:Prefab}
     */
    public map: Laya.Prefab;
    
    /**
     * @prop {name:mapUI, tips:"ui层", type:Prefab}
     */
    public mapUI: Laya.Prefab;


    private _map: Laya.Sprite;
    private _mapUI: Laya.Sprite;
    private _view: Laya.Sprite;

    public constructor() {
        super();
    }

    public onAwake(): void {
        this._map = this.map.create();
        this._mapUI = this.mapUI.create();
        this._view = this.owner as MainView;

        this._view.addChild(this._map);
        this._view.addChild(this._mapUI);
    }

    public onEnable(): void {
        eventManage.event(MainEvent.ANI_NUM_CHANGE);
    }

}