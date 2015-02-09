const SERVICE = new WeakMap();

class PageController {
    constructor(pageSvc) {
        SERVICE.set(this, pageSvc);
    }

    loadPages(pageNum) {
        return SERVICE.get(this).loadPages(pageNum);
    }
}

PageController.$inject = ["PageService"];
