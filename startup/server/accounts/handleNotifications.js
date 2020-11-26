import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../../../api/Documents/Documents';

Meteor.methods({
  checkTaskStatus: (taskId) => {
    check(taskId, String);
    //   if(!Roles.userIsInRole(Meteor.userId(), 'admin'))
    //     throw new Error('Sorry, you need to be an hyper_admin to remove this Result.');

    const doc = Documents.findOne(taskId);
    console.log(doc);
    return doc;
  },
});
