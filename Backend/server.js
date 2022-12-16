let express = require("express")
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Mongo_db_base:Parola@peer-to-peer-studying-s.kjmhrnm.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const sha1 = require("sha1")

function login(username, password) {
    try {
        dbClient.connect((err) => {
            if(err) throw err;
            const collection_users = dbClient.db("school").collection("users");
            collection_users.find({ username: username }).toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                try{
                    if (result[0].password === sha1(password)) {
                        //res.send(`{"status": "success", "isTeacher": "${result[0].isTeacher}"}`);
                        // session
                        console.log(`{"status": "success", "isTeacher": "${result[0].isTeacher}"}`);

                    }
                    else {
                        //res.send('{"status": "error", "msg": "Password is incorrect."}');
                        console.log('{"status": "error", "msg": "Password is incorrect."}')
                    }
                }catch(err){
                    //res.send('{"status": "error", "msg": "User does not exist."}');
                    console.log('{"status": "error", "msg": "User does not exist."}')
                }
                
                dbClient.close();
            });

        });
    }catch (err) {
        if (err) throw err;
    }
}

function register(username, password, isTeacher, email){
    try {
        dbClient.connect((err) => {
            if(err) throw err;
            let collection = dbClient.db("school").collection("users");
            collection.find({username: username}).toArray((err, result) => {
                if(err) throw err;
                try{
                    var check = result[0].password;
                    //res.send('{"status": "error", "msg": "This user already exists."}');
                    console.log('{"status": "error", "msg": "This user already exists."}');
                    dbClient.close();
                }catch(err){
                    collection.insertOne({ username: username, password: sha1(password), isTeacher: isTeacher, email: email }, function (err, res) {
                        if (err) throw err;
                        //res.send('{"status": "success"}');
                        console.log('{"status": "success"}');
                        dbClient.close();
                    });
                }
            });
        });
    } catch (err) {
       if(err) throw err;
    }
}





app.post('/login', function (req, res) {
    let full_data = "";
    req.on("data", function (data) {
        full_data += data;
    }).on("end", () => {
        let user = JSON.parse(full_data);
        login(user.username, user.password);
        res.end();
        return;
    });
});


app.post('/register', function (req, res) {
    let full_data = "";
    req.on("data", function (dat) {
        full_data += dat
    }).on("end", function () {
        let info = JSON.parse(full_data);
        register(info.username, info.password, "0", "");
        res.end()
        return;
    })
});



const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



