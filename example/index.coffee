edgeCMS = require "../lib"

edgeCMS.Log.info "Starting Example App"

cms = new edgeCMS.CMS()
cms.init()
cms.start()