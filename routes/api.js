/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB;


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if(err){ throw err }
        const dbo = db.db('freecodecamp');
        
        dbo.collection(project).find({}).toArray((err, data) => {
          if(err){ throw err }
          res.json(data);
          db.close();
        });
      });
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) throw err;
        const dbo = db.db('freecodecamp');
        const newIssue = { issue_title: req.body.issue_title,
                           issue_text: req.body.issue_text,
                           created_by: req.body.created_by,
                           assigned_to: req.body.assigned_to,
                           status_text: req.body.status_text,
                           created_on: Date(),
                           updated_on: Date(),
                           open: true };
        dbo.collection(project).insertOne(newIssue, (err, data) => {
          if (err) throw err;
          res.json(data.ops[0])
          db.close();
        });
      });
    
    })
    
    .put(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) throw err;
        const dbo = db.db('freecodecamp');
        
        if (!req.body._id) {
          res.end('could not update');
        }
        const query = { _id: ObjectId(req.body._id)};
        const newValues = { $set: { updated_on: Date() }};
        
        if(req.body.issue_title) { newValues['$set']['issue_title'] = req.body.issue_title }
        if(req.body.issue_text) { newValues['$set']['issue_text'] = req.body.issue_text }
        if(req.body.created_by) { newValues['$set']['created_by'] = req.body.created_by }
        if(req.body.assigned_to) { newValues['$set']['assigned_to'] = req.body.assigned_to }
        if(req.body.status_text) { newValues['$set']['status_text'] = req.body.status_text }
        if(req.body.open) { newValues['$set']['open'] = req.body.open }
        
        dbo.collection(project).updateOne(query, newValues, (err, data) => {
          if(err) {
            res.end('could not update ' + req.body._id);
          }
          
          if (data.result.nModified == 0) {
            res.end('no updated field sent');
          }
          res.end('successfully updated');
          db.close();
        });
      });
      
    })
    
    .delete(function (req, res){
      console.log("Delete1");
      var project = req.params.project;
      if(req.body._id == '') {
        res.end('_id error');
      }
      console.log(req.body._id);
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) { throw err; }
        const dbo = db.db('freecodecamp');
        const query = { _id: ObjectId(req.body._id)};
        
        dbo.collection(project).deleteOne(query, (err, data) => {
          if (err) { 
            res.end('could not delete ' + req.body._id);
          }
          res.end('deleted ' + req.body._id);
          db.close();
        });
      });
    
    });
    
};