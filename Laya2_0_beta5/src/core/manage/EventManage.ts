import BaseClass from "../base/BaseClass";

/**
 * by yanmingjie
 */

class MainEvent extends Laya.EventDispatcher {

    public constructor() {
        super();
    }

}

class EventManage extends BaseClass {

    private _event: MainEvent;

    public constructor() {
        super();
        this.init();
    }

    public init(): void {
        this._event = new MainEvent();
    }

    public on(eventName: string, caller: any, listener: Function, args?: any[]): void {
        this._event.on.apply(this._event, arguments);
    }

    public once(eventName: string, caller: any, listener: Function, args?: any[]): void {
        this._event.once.apply(this._event, arguments);
    }

    public off(eventName: string, caller: any, listener: Function): void {
        this._event.off.apply(this._event, arguments);
    }

    public event(eventName: string, data?: any): void {
        this._event.event.apply(this._event, arguments);
    }

}

export const eventManage: EventManage = EventManage.getIns<EventManage>();