/**
 * by yanmingjie
 */
class MathUtils {

    private static _instance: MathUtils;
    public static getInstance(): MathUtils {
        if (!this._instance) {
            this._instance = new MathUtils();
        }
        return this._instance;
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

export const mathUtils: MathUtils = MathUtils.getInstance();