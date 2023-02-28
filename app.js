const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const Day =  require("./date_handler");
const my_utils = require("./mongoose_schema");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Root route.
app.get("/", function(req, res){
    var day = Day.getDay;

    // Find...
    my_utils.Item.find({}, function(err, items){
        if(err){
            console.log(`There was an error: ${err}`);
        }

        else{            
            if(items.length === 0){
                my_utils.Item.insertMany(my_utils.defaultItems, function(err){
                    if(err){
                        console.log(`There was an error: ${err}`);
                    }
                    else{
                        console.log("Defaults inserted.");
                    }
                });
            }

            console.log("Found successfully");

            my_utils.List.find({}, function(err, foundLists){
                if(err){
                    console.log(`There was an error: ${err}`);
                }
        
                else{
                    res.render("list", {listTitle: day, listCollection: foundLists});
                }
            });
        }
    });
});

// Dynamic routing using Express.
app.get("/:customListName/open", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    my_utils.List.findOne({name: customListName}, function(err, foundList){      // foundList is an object from DB.
        if(err){
            console.log(`There was an error: ${err}`);
        }

        else{
            if(foundList){
                console.log("List exists...");
                res.render("listOne", {listTitle: customListName, newListItems: foundList.items});
            }
        
            else{
                console.log("Creating new list...");
                const list = new my_utils.List({
                    name: customListName,
                    items: my_utils.defaultItems
                });
                list.save();
                res.render("listOne", {listTitle: customListName, newListItems: list.items});
            }
        }
    });
});



// Add new tasks to lists.
app.post("/", function(req, res){
    // Add newly created task to DB.
    const itemName = req.body.newTask;
    const listName = req.body.listBtn;
    const item = new my_utils.Item({task: itemName});

    // Find the customList in DB and update it by adding the new item to its items array.
    my_utils.List.findOne({name: listName}, function(err, foundList){
        if(err){
            console.log(`There was an error: ${err}`);

        }
        else{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/");
        }
    });
});

// Delete a task.
app.post("/delete", function(req, res){
    const checked_id = req.body.id_checked;     // Id of the checked my_utils.Item
    const checked_listName = req.body.listName_checked;

    // Delete from customList.
    // Using MongoDB docs
    my_utils.List.findOneAndUpdate(
        {name: checked_listName},               // Conditions to find on.
        {$pull: {items: {_id: checked_id}}},    // Update query.
        function(err, foundList){               // Callback function.
            if(err){
                console.log(`There was an error: ${err}`);
            }
            else{
                console.log("Task removed successfully.");
                res.redirect("/");
            }
        }
        );
});

// Delete a list.
app.post("/deleteList", function(req, res){
    const del_listName = req.body.listDel;

    // Delete from List collection.
    // Using MongoDB docs
    my_utils.List.deleteOne({name: del_listName}, function(err){
        if(err){
            console.log(`There was an error: ${err}`);
        }
        else{
            console.log(`List ${del_listName} deleted.`);
            res.redirect("/");
        }
    });
});

app.listen(3000, function(){
    console.log("Server listening on port 3000.");
});
