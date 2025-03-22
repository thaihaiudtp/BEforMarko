const auth = require('./auth');
const google = require('./google');
const chat = require('./chat')
function router(app){
    app.use(`${process.env.DEFAULT_VERSION}/auth`, auth);
    app.use(`${process.env.DEFAULT_VERSION}/chat`, chat);
    app.use('/', google)
}
module.exports = router;