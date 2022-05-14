let serveStatic = require("serve-static");
let connect = require("connect");
let path = require("path");
let app = connect();
console.log(__dirname)
let root_dir = path.join(__dirname, "../");
let serve = serveStatic(root_dir, {
})
function logger(req, res, next){
    console.log(req.method + " " + req.url)
    next();
}
console.log(root_dir, serve);
app.use(serve).use(logger);
app.listen(5000);
console.log("Server running on port 5000");
