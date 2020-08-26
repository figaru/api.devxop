import { Random } from 'meteor/random'
import { type } from 'jquery';


module.exports = function (Router) {
    Router.post('/ping', function (req, res, next) {
        //recive ping from device
        //will update ping stamp and validate that sync is required
        let body = req.body;

        if ("device_id" in body || "v_id" in body) {

            Pings.insert({
                "device_id": body.device_id,
                "create_stamp": new Date()
            });

            if (typeof body.v_id == "string") {
                body.v_id = parseInt(body.v_id);
            }

            const device = Devices.findOne({ "device_id": body.device_id, "v_id": { $gt: body.v_id } });
            if (device) {
                //here we find that device needs to be updated. version id is smaller than that stored
                return resp(res, 200, { "sync_required": true });
            }

            return resp(res, 200, { "sync_required": false });
        } else {
            return resp(res, 400);
        }


    });

    Router.post('/sync', function (req, res, next) {
        //recive ping from device
        //will update ping stamp and validate that sync is required
        let body = req.body;

        if ("device_id" in body || "auth_code" in body) {

            const device = Devices.findOne({ "device_id": body.device_id, "authorization_code": auth_code });
            if (device) {

                let publishedView = device.published_view;
                let views = device.views;
                switch (publishedView) {
                    case "video":
                        // code block
                        if (typeof views.video.files != "undefined") {
                            let fileId = views.video.files[0];
                            //console.log(files);
                            Files.findOne({
                                '_id': fileId
                            }).then(file => {
                                let fileDownloadObject = FileHelper.getFileDownloadObject(file)



                                client.emit("video", JSON.stringify(fileDownloadObject));
                            });

                            //client.emit("video", )
                        }
                        break;
                    case "image":
                        // code block
                        if (typeof views.image.files != "undefined") {
                            let files = views.image.files;
                            //console.log(files);
                            Files.find({
                                '_id': {
                                    $in: files
                                }
                            }).then(filesList => {
                                /* console.log("Files list count: " + filesList.length); */
                                let data = [];

                                filesList.forEach(element => {
                                    data.push(FileHelper.getFileDownloadObject(element));
                                });


                                client.emit("image", JSON.stringify(data), views.image.interval);
                            });

                            //client.emit("video", )
                        }
                        break;
                    case "module":
                        // code block
                        if (typeof views.module.id != "undefined" && views.module.id) {
                            let moduleId = views.module.id;
                            //console.log(files);
                            Modules.find({
                                '_id': moduleId
                            }).then(module => {
                                Files.find({
                                    '_id': module.file
                                }).then(file => {
                                    /* console.log("Files list count: " + filesList.length); */
                                    let data = [];

                                    data.push(FileHelper.getFileDownloadObject(file));


                                    client.emit("image", JSON.stringify(data), views.image.interval);
                                });
                            });

                            //client.emit("video", )
                        }
                        break;
                }
            }

            return resp(res, 200);
        } else {
            return resp(res, 400);
        }


    });

    Router.post('/register', function (req, res, next) {

        let body = req.body;

        if (!body.email || !body.password || !body.device_id) {
            resp(res, "400");
        }


        let user = Accounts.findUserByEmail(body.email);
        var result = Accounts._checkPassword(user, body.password);

        if (result.userId && !result.error) {

            const auth_code = Random.secret();
            const device = Devices.findOne({ "device_id": body.device_id });

            if (device) {
                Devices.update(device._id, {
                    $set: {
                        "auth_stamp": new Date().getTime(),
                        "authorization_code": auth_code,
                    }
                });
            } else {
                Devices.insert({
                    user_id: result.userId,
                    device_id: body.device_id,
                    authorization_code: auth_code,
                    register_stamp: new Date().getTime(),
                    update_stamp: new Date().getTime(),
                    auth_stamp: new Date().getTime(),
                    published_view: "",
                    name: "New Device: " + body.device_id,
                    views: {},
                });
            }

            resp(res, 200, {
                "authorization_code": auth_code
            });
        }

        resp(res, 400);
    });
}