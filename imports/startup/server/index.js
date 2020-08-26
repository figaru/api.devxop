// Import server startup through a single index entry point

import './fixtures.js';
import './register-api.js';

//WEBAPP IMports
import bodyParser from 'body-parser';
import connectRoute from 'connect-route';
import endpoints from './endpoints.js';

Meteor.startup(() => {
    console.log('***');

    /* const env = dotenv.config({path: process.cwd() + '/assets/app/.env'});

    process.env.MONGO_URL= env.parsed['MONGO_URL'];
    process.env.MONGO_OPLOG_URL= env.parsed['MONGO_URL'];
    console.log(process.env['MONGO_URL']);

 */
    var db_url = process.env.MONGO_URL.split(':');
    console.log('*** DB:  ' + db_url[db_url.length - 1]);
    //console.log('[SYS] Server started @ ' + moment().utc().toISOString() + '\n***');
});



//make sure body and content is parsed.
WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }))

//connect route handled by api imported script -> contains all api routes
WebApp.connectHandlers.use(connectRoute(endpoints));