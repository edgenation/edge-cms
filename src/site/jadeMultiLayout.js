var fs = require("fs"),
    jade = require("jade");

jade.Parser.prototype.resolvePath = function (path, purpose) {
    var p = require("path");
    var dirname = p.dirname;
    var basename = p.basename;
    var join = p.join;
    var basedir = this.options.basedir;

    if (path[0] !== "/" && !this.filename) {
        throw new Error("the 'filename' option is required to use '" + purpose + "' with 'relative' paths");
    }

    if (path[0] === "/" && !basedir) {
        throw new Error("the 'basedir' option is required to use '" + purpose + "' with 'absolute' paths");
    }

    if (basename(path).indexOf(".") === -1) {
        path += ".jade";
    }

    if (path[0] === "/" && typeof basedir === "object") {
        basedir = this.options.basedir[0];
        for (var _i = 0, _len = this.options.basedir.length; _i < _len; _i++) {
            var dir = this.options.basedir[_i];
            if (fs.existsSync(join(dir, path))) {
                basedir = dir;
                break;
            }
        }
    }

    var newPath = path[0] === "/" ? basedir : dirname(this.filename);
    path = join(newPath, path);
    return path;
};
