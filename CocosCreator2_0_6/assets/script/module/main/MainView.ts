import { mainData } from "./MainData";
import MainEvent from "./MainEvent";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainView extends cc.Component {

    @property(cc.TiledMap)
    public tiledMap: cc.TiledMap = null;

    @property(cc.Node)
    public roleLayer: cc.Node = null;

    @property(cc.ToggleContainer)
    public toggleContainer: cc.ToggleContainer = null;

    @property(cc.EditBox)
    public editBox: cc.EditBox = null;

    @property(cc.Prefab)
    public animation: cc.Prefab = null;

    @property(cc.Prefab)
    public bone: cc.Prefab = null;

    public start(): void {
        // 启用动画
        cc.systemEvent.emit(MainEvent.ANI_TYPE_CHANGE);
        // 初始化
        const toggleItems: Array<cc.Toggle> = this.toggleContainer.toggleItems;
        for (let i = 0, len = toggleItems.length; i < len; i++) {
            if (i === mainData.aniType) {
                toggleItems[i].check();
            }
            else {
                toggleItems[i].uncheck();
            }
        }
    }

    public onEnable(): void {
        const toggleItems: Array<cc.Toggle> = this.toggleContainer.toggleItems;
        for (let i = 0, len = toggleItems.length; i < len; i++) {
            toggleItems[i].node.on('toggle', this.onChangeAni, this);
        }
        this.editBox.node.on('editing-did-ended', this.onChangeNum, this);
    }

    public onDisable(): void {
        const toggleItems: Array<cc.Toggle> = this.toggleContainer.toggleItems;
        for (let i = 0, len = toggleItems.length; i < len; i++) {
            toggleItems[i].node.off('toggle', this.onChangeAni, this);
        }
        this.editBox.node.off('editing-did-ended', this.onChangeNum, this);
    }

    private onChangeAni(): void {
        const toggleItems: Array<cc.Toggle> = this.toggleContainer.toggleItems;
        let type: number = void 0;

        for (let i = 0, len = toggleItems.length; i < len; i++) {
            if (toggleItems[i].isChecked) {
                type = i;
                break;
            }
        }
        if (type === void 0) {
            cc.warn('请选择动画类型！');
            return;
        }

        if (mainData.aniType != type) {
            mainData.aniType = type;
            cc.systemEvent.emit(MainEvent.ANI_TYPE_CHANGE);
        }
    }

    private onChangeNum(): void {
        if (!this.editBox.string) return;
        const num: number = Number(this.editBox.string);
        if (num != mainData.aniNum) {
            this.editBox.string = `${num}`;
            cc.systemEvent.emit(MainEvent.ANI_NUM_CHANGE);
        }
    }

}
