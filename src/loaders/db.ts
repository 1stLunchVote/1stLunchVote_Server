import mongoose from 'mongoose';
import config from '../config';
import Group from '../models/Group';
import LunchTemplate from '../models/LunchTemplate';
import Menu from '../models/Menu';
import User from '../models/User';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);

    mongoose.set('autoCreate', true);

    console.log('Mongoose Connected ...');

    User.createCollection().then(function (collection) {
      console.log(`${collection.collectionName} is created!`);
    });

    Menu.createCollection().then(function (collection) {
      console.log(`${collection.collectionName} is created!`);
    });

    LunchTemplate.createCollection().then(function (collection) {
      console.log(`${collection.collectionName} is created!`);
    });

    Group.createCollection().then(function (collection) {
      console.log(`${collection.collectionName} is created!`);
    });
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
