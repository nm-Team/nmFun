// 引入workbox,这里使用镜像缓解大陆用户的防火墙
importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/workbox-sw.js');
workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/'
});

// 设定缓存版本号,若有重大更新请务必更新此版本号
const cacheSuffixVersion = '-ver-0000-0000-0099-0000',
    // 最大缓存文件数目,防止写爆缓存
    maxEntries = 100;

self.addEventListener(
    'activate', () => {
        caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                // 删除不包含该版本号的所有缓存
                if (!key.includes(cacheSuffixVersion)) return caches.delete(key);
            }))
        });
    }
)

// 设定简易名称
const { core, precaching, routing, strategies, expiration, cacheableResponse, backgroundSync } = workbox;
const { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } = strategies;
const { ExpirationPlugin } = expiration;
const { CacheableResponsePlugin } = cacheableResponse;

//设定缓存名规则
core.setCacheNameDetails({
    prefix: 'nmfun-cache',
    suffix: cacheSuffixVersion
});

core.skipWaiting();
core.clientsClaim();
precaching.cleanupOutdatedCaches();

// 预缓存文件
workbox.precaching.precacheAndRoute([
    {
        "url": "/src/js/jquery.min.js",
        "revision": null
    }
]);


/*
 * 跨域静态资源缓存
 * 规则类型: cacheFirst
 * 缓存名: cache-static-lib
 */
routing.registerRoute(/.*cdn\.jsdelivr\.net/, new CacheFirst({
    cacheName: "cache-static-lib" + cacheSuffixVersion,
    fetchOptions: {
        mode: "cors",
        credentials: "omit"
    },
    plugins: [new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true
    })]
}));

/*
 * 跨域静态资源
 * 规则类型: cacheFirst
 * 缓存名: cache-static-img
 */
// routing.registerRoute(/.*a\.b\.c.*/, new CacheFirst({
//     cacheName: "cache-static-img" + cacheSuffixVersion,
//     fetchOptions: {
//         mode: "cors",
//         credentials: "omit"
//     },
//     plugins: [new ExpirationPlugin({
//         maxAgeSeconds: 30 * 24 * 60 * 60,
//         purgeOnQuotaError: true
//     })]
// }));

/*
 * 跨域API资源
 * 规则类型: cacheFirst
 * 缓存名: cache-static-img
 */
routing.registerRoute(/.*funapi\.nmteam\.xyz.*/, new CacheFirst({
    cacheName: "cache-static-api" + cacheSuffixVersion,
    fetchOptions: {
        mode: "cors",
        credentials: "omit"
    },
    plugins: [new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true
    })]
}));


// 不强制缓存配置文件,以免翻车
routing.registerRoute(
    '/sw.js',
    new StaleWhileRevalidate()
);

// Analytics gtag.js
routing.registerRoute(
    /.*googletagmanager\.com/,
    new StaleWhileRevalidate()
);

// Gravatar no cache
routing.registerRoute(
    /.*sdn\.geekzu\.org/,
    new StaleWhileRevalidate()
);

/*
 * 同域静态资源
 * 规则类型: cacheFirst
 * 缓存名: 无
 */
workbox.routing.registerRoute(
    new RegExp('.*\.(css|js)'),
    new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('.*\.(?:|svg|ico|webp)'),
    new workbox.strategies.StaleWhileRevalidate()
);
workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkFirst({
        // 请求超过2秒未应答则切换到本地缓存
        networkTimeoutSeconds: 2
    })
);