
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/taskAPI",  { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = {
    task: String,
    date_created: String,
    date_due: String,
    completed: Boolean
}

const Task = mongoose.model("Task", taskSchema);
//TODO

app.route("/api/v1/tasks")
    .get(function(req,res){

        Task.find(function(err, tasksList){
            if(!err) {
                res.send(tasksList);
            } else {
                res.send('Unable to find any tasks');
            }
        });

    })  

    .post(function(req,res){

        const newTask = new Task({
            task: req.body.task,
            date_created: req.body.date_created,
            date_due: req.body.date_due,
            completed: false
        });

        newTask.save(function(err){
            if(!err){
                res.send("Tasks successfully completed");
            } else {
                res.send(err);
            }
        });



    })

    .delete(function(req,res){

        Task.deleteMany(function(err){
            if(!err){
                res.send("Tasks deleted successfuly");
            } else {
                res.send(err);
            }
        });

    });

// Individual Task Routes

app.route("/api/v1/tasks/:taskName")
    .get(function(req,res){

        Task.findOne({task: req.params.taskName}, function(err, singleTask) {
            if(!err){
                res.send(singleTask);
            } else {
                res.send(err);
            }
        });

    })

    .patch(function(req, res){

        Task.updateOne(
            {task: req.params.taskName},
            {$set: req.body},
            function(err){
                if(!err) {
                    res.send("Task Updated Successfully");
                } else {
                    res.send(err);
                }
        });

    })

    .delete(function(req, res){

        Task.deleteOne({task: req.params.taskName}, function(err){
            if(!err) {
                res.send("Task Deleted Successfully");
            } else {
                res.send(err);
            }
        });
    });



app.listen(3000, function() {
  console.log("Server started on port 3000");
});