auth =
    # Show the login form
    view: (req, res, next) ->
        res.render "admin/login"

    login: (req, res, next) ->
        # Log the user in
        
    logout: (req, res, next) ->
        # Log the user out


module.exports = auth