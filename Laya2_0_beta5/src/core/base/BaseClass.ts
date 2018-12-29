/**
 * by yanmingjie
 */

export default class BaseClass {

    private static _ins: BaseClass;

    public static getIns<T>(): T {
        if (!this._ins) {
            this._ins = new this();
        }
        return  this._ins as T;
    } 

}