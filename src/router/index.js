const auth = require('./auth');
const google = require('./google');
const chat = require('./chat');
const twitter = require('./twitter');
const upload = require('./upload');
const user = require('./user')
function router(app){
    app.use(`${process.env.DEFAULT_VERSION}/auth`, auth);
    app.use(`${process.env.DEFAULT_VERSION}/chat`, chat);
    app.use(`${process.env.DEFAULT_VERSION}/upload`, upload);
    app.use(`${process.env.DEFAULT_VERSION}/user`, user);
    app.use('/auth', twitter)
    app.use('/', google)
    
}
module.exports = router;