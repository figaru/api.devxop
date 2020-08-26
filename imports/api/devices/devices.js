import { Mongo } from 'meteor/mongo';

Devices = new Mongo.Collection('devices');
Files = new Mongo.Collection('files');

Pings = new Mongo.Collection('pings');

Pings.rawCollection().createIndex( { "create_stamp": 1 }, { expireAfterSeconds: 30 } )