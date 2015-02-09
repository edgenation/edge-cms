var cmsPageFactory = angular.module("cms.page.factory.module", []);

cmsPageFactory.factory("cms.page.factory", [
    "$http",
    function ($http) {
        var BASE_URL = "/api/page";

        return {
            all: function () {
                return $http.get(BASE_URL);
            },
            create: function (page) {
                return $http.post(BASE_URL, page);
            },
            update: function (page) {
                return $http.put(BASE_URL + "/" + page.id, page);
            },
            delete: function (id) {
                return $http.delete(BASE_URL + "/" + id);
            }
        };
    }
]);

export default cmsPageFactory;
