(function() {
  var multiViews;

  multiViews = function(viewName) {
    var context, i, match, _i, _ref;
    context = null;
    match = null;
    if (this.root instanceof Array) {
      for (i = _i = 0, _ref = this.root.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        context = {
          root: this.root[i]
        };
        match = lookup_proxy.call(context, viewName);
        if (match) {
          return match;
        }
      }
      return null;
    }
    return lookup_proxy.call(this, viewName);
  };

  module.exports = function(app) {
    var lookup_proxy;
    lookup_proxy = app.get("view").prototype.lookup;
    return app.get("view").prototype.lookup = multiViews;
  };

}).call(this);
