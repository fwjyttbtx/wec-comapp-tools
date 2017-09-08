let basePath = (env && env.dev) ? "http://172.16.6.27:8010/comapp-bus/system/api" : `${location.protocol}//${location.host}/system/api`;

export default {
    schools: `${basePath}/schools`,
    properties: `${basePath}/properties`,
    schoolRedisCache: `${basePath}/school-redis-cache`
}