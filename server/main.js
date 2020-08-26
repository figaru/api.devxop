import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
  // code to run on server at startup
  console.log("Devxop API Startup");
});


const getJson = (req, options = {}) =>
  new Promise((resolve, reject) => {
    try {
      // use a lib body-parser/busboy etc
      return resolve();
    } catch (e) {
      // handle error from body parsing lib etc.
      return reject(e)
    }
  })

WebApp.connectHandlers.use('/hello', async (req, res, next) => {

  const data = await getJson(req)

  // do something with json/body

  console.log(data;

  res.writeHead(200);
  res.end(`Hello world from: ${Meteor.release}`);
})