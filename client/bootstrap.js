import cms from "./cms";

angular.element(document).ready(function () {
    console.log("Bootstrap Ready!", cms.name);
    angular.bootstrap(document.querySelector("[data-cms-app]"), [
        cms.name
    ], {strictDi: true});
});
