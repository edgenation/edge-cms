import cmsConfigModule from "./config/index";
import cmsErrorModule from "./error/index";
import cmsHomeModule from "./home/index";
import cmsPageModule from "./page/index";

angular.bootstrap(document.querySelector("[data-cms-app]"), [
    cmsConfigModule.name,
    cmsErrorModule.name,
    cmsHomeModule.name,
    cmsPageModule.name
], {strictDi: true});
