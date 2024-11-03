import React from "react";
import ReactDOM from "react-dom";
const pg = require('pg');
const express = require('express');
const axios = require('axios');
const app = express();

const port = 3000;


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blogdata",
    password: "h92hd73bdj01auof",
    port: 5432,
});
db.connect();

app.get("/", (req, res) => {
    res.render("home.ejs");
})


app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try {
        const getResult = await db.query("SELECT * FROM users WHERE email = $1", [ email, ]);
        if (getResult.rows.length > 0) {
            res.send("Email already exists. Try logging in.");
        }else{
            const result = await db.query(
                "INSERT INTO users (email, password) VALUES ($1, $2)",
                [email, password]
            );
            console.log(result);
            res.render("blog.ejs");
        }
    } catch (err) {
        console.log(err);
    }
});


app.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    
    try { 
        const result = await db.query("SELECT * FROM users WHERE email = $1", [ email, ]);
    if(result.rows.length > 0) {
        const user = result.rows[0];
        const storedPassword = user.password;

        if (password === storedPassword) {
            res.render("blog.ejs");

        }else {
            res.send("Incorrect password");
        }
    } else {
        res.send("User not found, try again");
    }
    } catch (err) {
        console.log(err);
    }
});


app.post("/add", (req, res) => {
    var timeOfPost = new Date();
    const userName = req.body.userName;
    const title = req.body.title;
    const postSpace = req.body.postSpace;
    var post = {
        timeOfPost, userName, title, postSpace
    }


    blogPosts.push(post);
    

    console.log(blogPosts);
    res.render( 'index.ejs', {
        blogPosts: blogPosts
      });
});


app.listen(port, () => {
    console.log(`Server is running`);
});

