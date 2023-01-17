"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let express = require("express");
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Mongo_db_base:Parola@peer-to-peer-studying-s.kjmhrnm.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const sha1 = require("sha1");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: dbClient })
}));
function register(username, password, isTeacher, email) {
    try {
        dbClient.connect((err) => {
            if (err)
                throw err;
            let collection = dbClient.db("school").collection("users");
            collection.find({ username: username }).toArray((err, result) => {
                if (err)
                    throw err;
                try {
                    var check = result[0].password;
                    console.log('{"status": "error", "msg": "This user already exists."}');
                    dbClient.close();
                }
                catch (err) {
                    collection.insertOne({ username: username, password: sha1(password), isTeacher: isTeacher, email: email }, function (err, res) {
                        if (err)
                            throw err;
                        console.log('{"status": "success"}');
                        dbClient.close();
                    });
                }
            });
        });
    }
    catch (err) {
        if (err)
            throw err;
    }
}
app.post('/login', function (req, res) {
    let full_data = "";
    req.on("data", function (data) {
        full_data += data;
    }).on("end", () => {
        let user = JSON.parse(full_data);
        console.log("test");
        res.send("Hello");
        res.end();
        return;
    });
});
app.post('/register', function (req, res) {
    let full_data = "";
    req.on("data", function (data) {
        full_data += data;
    }).on("end", function () {
        let info = JSON.parse(full_data);
        register(info.username, info.password, false, "");
        res.end();
        return;
    });
});
const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
