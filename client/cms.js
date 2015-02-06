// https://github.com/gocardless/es6-angularjs

import cmsConfig from "./config/index";
import cmsPage from "./page/page.route";

var cms = angular.module("cms.module", [
    cmsConfig.name,
    cmsPage.name
]);

cms.run();

export default cms;



/**

 cms.page.PageCtrl
 */
