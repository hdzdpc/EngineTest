import BaseClass from "../base/BaseClass";

/**
 * by yanmingjie
 */
class MathUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 获取一个区间的随机数 (from, end)
     * @param {number} from 最小值
     * @param {number} end 最大值
     * @returns {number}
     */
    public random(from: number, end: number): number {
        let min = Math.min(from, end);
        let max = Math.max(from, end);
        let range = max - min;
        return min + Math.random() * range;
    }

}

export const mathUtils: MathUtils = MathUtils.getIns<MathUtils>();