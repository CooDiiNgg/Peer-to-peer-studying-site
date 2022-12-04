let express = require("express")
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Mongo_db_base:<Parola>@peer-to-peer-studying-s.kjmhrnm.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




app.post('/login', function(req, res) {
    let full_data = "";
    req.on("data", function(data){
        full_data += data;
    }).on("end", () => {
        let user = JSON.parse(full_data);
        dbClient.connect((err) => {
            const collection_users = dbClient.db("school").collection("users");
            collection_users.find({username: `${user.username}`}).toArray(function(err, result){
                if(err){
                    //user does not exist
                }
                else if(result[0].password === user.password){
                    //everything fine
                }
                else{
                    //password is not the same
                }
                dbClient.close();
            });
          });
          return;
    });

  

});



const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



