const {ccclass} = cc._decorator;

@ccclass
export default class App extends cc.Component {

    public start(): void {
        // 异步加载prefab
        // let urls: Array<string> = cc.loader.getDependsRecursively('prefabs/roleAnimation.prefab');
        // urls = urls.concat(cc.loader.getDependsRecursively('prefabs/roleDragonBone.prefab'));

        // cc.loader.load(urls, function(errors: Array<string>, results: cc.LoadingItems) {
        //     if (errors) {
        //         cc.error('加载错误！');
        //     }
        //     cc.director.loadScene('MainScene');
        // });

        cc.director.loadScene('MainScene');
    }

}