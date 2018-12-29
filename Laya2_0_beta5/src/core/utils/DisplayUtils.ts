import BaseClass from "../base/BaseClass";

/**
 * by yanmingjie
 */
class DisplayUtils extends BaseClass {

    private _templetCache: any;

    constructor() {
        super();
        //templet 缓存池
        this._templetCache = {};
    }

    /**
     * 创建帧动画
     * @param xPos x坐标 
     * @param yPos y坐标
     * @param aniUrl 图集url
     * @param parent 父级容器
     */
    public createAnimation(xPos: number, yPos: number, aniUrl: string, parent: Laya.Sprite = null): Laya.Animation {
        const ani: Laya.Animation = new Laya.Animation();
        ani.loadAtlas(aniUrl);
        ani.pos(xPos, yPos);
        if (parent) {
            parent.addChild(ani);
        }
        return ani;
    }

    /**
     * 创建骨骼动画
     * @param {number} xPos x坐标
     * @param {number} yPos y坐标
     * @param {string} skKey 地址key
     * @param {number} type 骨骼类型是否换装：1：换装、0：不换装
     * @param {Sprite} parent 父容器
     */
    public createSkeleton(xPos: number, yPos: number, skKey: string, type: number = 0, parent = null): Laya.Skeleton {
        let templet = this.createTemplet(skKey);
        if (templet) {
            let skeleton = templet.buildArmature(type);
            skeleton.pos(xPos, yPos);
            if (parent) {
                parent.addChild(skeleton);
            }
            return skeleton;
        }
        else {
            console.warn("动画资源未提前加载！");
        }
        return null;
    }

    /**
     * 创建骨骼动画
     * @param {string} skKey 地址key
     * @param {number} 骨骼类型是否换装：1：换装、0：不换装
     * @param {Function} 回调函数
     * @param {any} 回调函数this对象
     */
    public createAsynSkeleton(skKey: string, type: number, callback = null, thisObj = null): void {
        let templet = this.createTemplet(skKey);
        if (templet) {
            compleSk();
        }
        else {
            let res = [
                {"type": Laya.Loader.BUFFER, "url": skKey + ".sk"},
                {"type": Laya.Loader.IMAGE,  "url": skKey + ".png"}
            ];
            Laya.loader.load(res, Laya.Handler.create(this, compleSk), null, null);
        }

        function compleSk(){
            templet = this.createTemplet(skKey);
            let skeleton = templet.buildArmature(type);
            (callback) && ( callback.apply(thisObj, [skeleton]) );
        }
    }

    /**
     * 获取templet对象
     * @param {string} key
     */
    public createTemplet(key: string): Laya.Templet {
        if (!this._templetCache[key]) {
            let templet = new Laya.Templet();
            let pngData = Laya.loader.getRes(key + ".png");
            let skData = Laya.loader.getRes(key + ".sk");
            if (pngData && skData) {
                templet.parseData(pngData, skData);
                this._templetCache[key] = templet;
            }
            else {
                return null;
            }
        }
        return this._templetCache[key];
    }

}

export const displayUtils: DisplayUtils = DisplayUtils.getIns<DisplayUtils>();