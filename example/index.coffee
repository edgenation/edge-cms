edgeCMS = require "../lib"

###
config = edgeCMS.Config "#{__dirname}/config"
config.set "views", "#{__dirname}/view"

edgeCMS.Log.info "Starting " + config.get("name")

cms = new edgeCMS.CMS(config)
cms.init()
cms.start()
###


# Load the config
config = edgeCMS.Config "#{__dirname}/config"
config.set "views", "#{__dirname}/view"
config.set "public", "#{__dirname}/public"

edgeCMS.Log.info "Starting " + config.get("name")

# Create the CMS
cms = new edgeCMS.CMS()

# Set the CMS config
cms.setConfig config

# Use the CMS express helper to create an app
# (You could also just use any existing app)
app = edgeCMS.App.create config

# Start the app as we just created it - this may not be
# needed on an existing app if has already started
edgeCMS.App.start app

# Tell the CMS to use our express app
cms.setApp app
