edgeCMS = require "../lib"

config = edgeCMS.Config "#{__dirname}/config"

edgeCMS.Log.info "Starting " + config.get("name")

cms = new edgeCMS.CMS(config)
cms.init()
cms.start()