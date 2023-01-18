let express = require("express")
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Mongo_db_base:Parola@peer-to-peer-studying-s.kjmhrnm.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const sha1 = require("sha1")
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

import IUser from "./interfaces/IUser";

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({ mongooseConnection: dbClient })
}));

/*
function login(input_username, input_password) {
	let result = '';
	try {
		dbClient.connect((err) => {
			if(err) throw err;
			const collection_users = dbClient.db("school").collection("users");
			collection_users.find({ username: input_username }).toArray(function (err, result) {
				if (err) {
					throw err;
				}
				if (!result[0]){
					//res.send('{"status": "error", "msg": "User does not exist."}');
					result = '{"status": "error", "msg": "User does not exist."}';
					dbClient.close();
				}
				else if (result[0].password === sha1(input_password)) {
					//res.send(`{"status": "success", "isTeacher": "${result[0].isTeacher}"}`);
					result = `{"status": "success", "isTeacher": "${result[0].isTeacher}"}`;
					dbClient.close();
				}
				else {
					//res.send('{"status": "error", "msg": "Password is incorrect."}');
					result = '{"status": "error", "msg": "Password is incorrect."}';
					dbClient.close();
				}                
			});
		});
	}catch (err) {
		if (err) throw err;
	}
	return result;
}
*/
function register(username: string, password: string, isTeacher: boolean, email: string): void {
	try {
		dbClient.connect((err: Error) => {
			if (err) throw err;
			let collection = dbClient.db("school").collection("users");
			collection.find({ username: username }).toArray((err: any, result: Array<IUser>) => {
				if (err) throw err;
				if (result[0] !== undefined) {
					console.log('{"status": "error", "msg": "This user already exists."}');
					dbClient.close();
					return
				}
				collection.insertOne({ username: username, password: sha1(password), isTeacher: isTeacher, email: email }, function (err: Error, res: any) {
					if (err) throw err;
					//res.send('{"status": "success"}');
					console.log('{"status": "success"}');
					dbClient.close();
				});

			});
		});
	} catch (err) {
		if (err) throw err;
	}
}





app.post('/login', function (req: any, res: any) {
	let full_data = "";
	req.on("data", function (data: any) {
		full_data += data;
	}).on("end", () => {
		let user = JSON.parse(full_data);
		//let status = login(user.username, user.password);
		console.log("test");
		res.send("Hello");
		res.end();
		return;
	});
});


app.post('/register', function (req: any, res: any) {
	let full_data = "";
	req.on("data", function (data: any) {
		full_data += data
	}).on("end", function () {
		let info = JSON.parse(full_data);
		register(info.username, info.password, false, "");
		res.end()
		return;
	})
});



const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



