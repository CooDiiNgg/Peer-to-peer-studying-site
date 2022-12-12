let express = require("express")
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Mongo_db_base:Parola@peer-to-peer-studying-s.kjmhrnm.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





app.post('/login', function (req, res) {
    let full_data = "";
    req.on("data", function (data) {
        full_data += data;
    }).on("end", () => {
        let user = JSON.parse(full_data);
        try {
            dbClient.connect((err) => {
                const collection_users = dbClient.db("school").collection("users");
                collection_users.find({ username: user.username }).toArray(function (err, result) {
                    if (err) {
                        throw err;
                    }
                    try{
                        if (result[0].password === user.password) {
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
        } catch (err) {
            if (err) throw err;
        }

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
        try {
            dbClient.connect((err) => {
                let collection = dbClient.db("school").collection("users");
                collection.find({username: info.username}).toArray((err, result) => {
                    if(err) throw err;
                    try{
                        var check = result[0].password;
                        //res.send('{"status": "error", "msg": "This user already exists."}');
                        console.log('{"status": "error", "msg": "This user already exists."}');
                    }catch(err){
                        collection.insertOne({ username: info.username, password: info.password, isTeacher: "0", email: "" }, function (err, res) {
                            if (err) throw err;
                            //res.send('{"status": "success"}');
                            console.log('{"status": "success"}');
                            dbClient.close();
                        });
                    }
                });
                
            });
        } catch (err) {
            throw err;
        }
        res.end()
        return;
    })
});



const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



