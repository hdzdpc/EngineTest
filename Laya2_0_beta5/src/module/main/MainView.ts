import { ui } from "../../ui/layaMaxUI";
import MainCtrl from "./ctrl/MainCtrl";

/**
 * by yanmingjie
 */
export default class MainView extends ui.scenes.MainSceneUI {
    /**单例 */
    public static instance: MainView;

    /**游戏控制脚本引用，避免每次获取组件带来不必要的性能开销 */
    private _control: MainCtrl;

    public constructor() {
        super();
    }
    
    public onEnable(): void {
        // this._control = this.getComponent(MainCtrl);
    }

}