"use strict";

import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import _ from "lodash"

const { Schema } = mongoose;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoDB = "mongodb://localhost:27017/WikiDB";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`CONNECTED TO MONGO!`);
    })
    .catch((err) => {
        console.log(`OH NO! MONGO CONNECTION ERROR!`);
        console.log(err);
    })

const articleSchema = {
    // _id: ObjectID,
    title: String,
    content: String,
    wikipedia_link: String
};

const Article = mongoose.model("Article", articleSchema)


app.route("/articles")
    .get((req, res) => {
        Article.find()
            .then(articles => {
                console.log(articles);
                res.send(articles);
            })
            .catch(err => {
                console.log("Something went wrong");
                res.send(err);
            })
    })
    .post((req, res) => {
        Article.create({
            title: req.body.title,
            content: req.body.content,
            wikipedia_link: req.body.wikipedia_link
        })
            .then(res => { res.send("Article added\n", res) })
            .catch(err => {
                res.send("Something went wrong. Article not added\n", err);
            })
    })
    .delete((req, res) => {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfully deleted all articles")
                console.log("Successfully deleted all articles");
            } else {
                res.send("Something went wrong")
                res.send(err)
            };
        })
    });


//express parameters
app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle })
            .then(foundArticle => {
                res.send(foundArticle);
            })
            .catch(err => {
                res.send(err)
            })
    })
    .put((req, res) => {
        Article.replaceOne(
            //condition
            { title: req.params.articleTitle },
            //update
            { title: req.body.title, content: req.body.content, wikipedia_link: req.body.wikipedia_link })
            .then(
                res.send("Successfully updated"),
            )
            .catch(err =>
                res.send(err))
    })
    .patch((req, res) => {
        Article.updateOne(
            //condition
            { title: req.params.articleTitle },
            //update
            { $set: req.body })
            .then(
                res.send("Successfully updated"),
            )
            .catch(err =>
                res.send(err))
    })
    .delete((req, res) => {
        Article.deleteOne(
            { title: req.params.articleTitle }, function (err) {
                if (!err) {
                    res.send("Successfully deleted requested article")
                } else {
                    res.send("Something went wrong")
                    res.send(err)
                };
            });
    });


app.listen(3000, function () {
    console.log("Server started on port 3000");
});