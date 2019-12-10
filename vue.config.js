module.exports = {
  pwa: {
    //默认值为packag.json中的“name”
    name: 'v-chat',
    //manifest主题颜色
    themeColor: '#000',
    //PWA app默认背景色
    msTileColor: '#000000',
    //这默认为“no”，因为11.3之前的iOS没有适当的PWA支持。
    appleMobileWebAppCapable: 'yes',
    //默认webApp状态栏颜色为黑色
    appleMobileWebAppStatusBarStyle: 'black-translucent',

    //允许您在底层的注入workbox-webpack-plugin插件的时候支持的两种模式之间进行选择。
    //GenerateSW: (默认)，每次重新构建web应用程序时都会创建一个新的server-worker文件。
    //InjectManifest: 允许您从现有的server-worker.js文件中，并创建该文件的副本，并将“预缓存清单”注入其中。
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      //在InjectManifest模式中需要使用swSrc。
      swSrc: 'src/registerServiceWorker.ts',
    }
  }
}