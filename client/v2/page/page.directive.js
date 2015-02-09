const Q = new WeakMap();
const SERVICE = new WeakMap();


class UniquePageUrl {
    constructor($q, pageSvc) {
        Q.set(this, $q);
        SERVICE.set(this, pageSvc);

        this.require = "ngModel";
        this.restrict = "A";
    }

    link(scope, elem, attrs, ngModelController) {
        ngModelController.$asyncValidators.uniquePageUrl = function (value) {

            return Q.get(UniquePageUrl.instance)((resolve, reject) => {
                SERVICE.get(UniquePageUrl.instance).checkIfPageExists(value).then(result => {
                    if (result) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        };
    }

    static directiveFactory($q, pageSvc) {
        UniquePageUrl.instance = new UniquePageUrl($q, pageSvc);
        return UniquePageUrl.instance;
    }
}

UniquePageUrl.directiveFactory.$inject = ["$q", "bookShelfSvc"];

export default UniquePageUrl;
