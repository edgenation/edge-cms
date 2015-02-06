// https://github.com/gocardless/es6-angularjs
// http://www.michaelbromley.co.uk/blog/350/exploring-es6-classes-in-angularjs-1-x
// http://blog.thoughtram.io/angularjs/es6/2015/01/23/exploring-angular-1.3-using-es6.html


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
