const HTTP = new WeakMap();

class PageService {
    static pageFactory($http) {
        return new PageService($http);
    }

    constructor($http) {
        HTTP.set(this, $http);
    }

    getPages(pageNum) {
        return HTTP.get(this).get("/api/page").then(result => result.data);
    }
}

PageService.pageFactory.$inject = ["$http"];

export default PageService.pageFactory;


//angular.module(moduleName, [])
//    .factory("pageSvc", PageService.pageFactory);
//
//export default moduleName;
