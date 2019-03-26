const express = require('express');
const app = express();
const url = require('url');
const session = require('express-session');
const PORT = 8000
const {
    Pool
} = require('pg')

const connectionString = process.env.DATABASE_URL || 'postgres://iqyvbcwackuwmr:e069474f5205e9b5bc13930c44ae183469ccf6697544a548b0c9abddb6af2081@ec2-50-17-227-28.compute-1.amazonaws.com:5432/dc5kpn3rqnp126?ssl=true'

const pool = new pool({connectionString: connectionString});

app.use(express.static('public'));

/* these two allow you to get data from
 *  the body on a post     */
app.use(express.json());
app.use(express.urlencoded());

app.use(session({
    // cookieName: 'session',
    key: 'user_sid',
    secret: 'thisisarandomstringandihavenoideawhyineedit',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    cookie: {
        expires: 600000
    }
}));

app.listen(PORT, function() {
    console.log("server listening on port: "+PORT);
});

app.post("/login", loginPost);

app.post("/logout", logoutPost);

app.get("/getServerTime", verifyLogin, getServerTime);

function loginPost(req, res) {
    console.log("login post")
    let username = req.body.username;
    let password = req.body.password;
    console.log(username+", "+password);
    let json = {};
    if(username == 'admin' && password == 'password') {
        json = {success: true};
        req.session.username = username;
    } else {
        json = {success: false}
    }
    console.log(req.session.username);
    res.json(json);
}

function logoutPost(req, res) {
    let json = {};
    if (req.session.username) {
        req.session.destroy();
        json = {success: true}
    } else {
        json = {success: false};
    }
    res.json(json)
}

function getServerTime(req, res) {
    let json = {};
    var time = new Date();
    json = {success: true, time: time}
    res.json(json)
}

function verifyLogin(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        var result = {success: false, message: "Didn't work"}
        res.status(401).json(result);
    }
}