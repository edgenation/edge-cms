// https://github.com/gocardless/es6-angularjs

import cmsConfig from "./config/index";
import cmsPage from "./page/index";

var cms = angular.module("cms", [
    cmsConfig.name,
    cmsPage.name
]);

cms.run();

export default cms;
