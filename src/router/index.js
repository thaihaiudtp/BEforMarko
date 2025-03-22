const auth = require('./auth');
const google = require('./google')
function router(app){
    app.use(`${process.env.DEFAULT_VERSION}/auth`, auth);
    app.use('/', google)
}
module.exports = router;