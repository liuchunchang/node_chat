const app = require('http').createServer(handler);
const fs = require('fs');
const io = require('socket.io')(app);
//记录人数
var renshu = 0;
// 保存用户连上的socket.id,具有唯一性
var userid = {};
//保存用户名
var users = {};
//保存连上的socket对象
var socketobj = {};
//http和socket.io的端口为80
app.listen(80);
function handler(req, res) {
    res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
    if (req.url == "/" || req.url == "/index.html") {
        fs.readFile('./wangzhan/index.html', function (err, data) {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
                res.end(data);
            } else {
                console.log(err);
            }
        });
    }
    else if (req.url == "/qunliao.html") {
        fs.readFile('./wangzhan/qunliao.html', function (err, data) {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
                res.end(data);
            } else {
                console.log(err);
            }
        });
    } 
    else {
        fs.readFile('wangzhan' + req.url, function (err, data) {
            if (!err) {
                res.end(data);
            } else {
                console.log(err);
            }
        })
    }
}

//监听connect事件
io.on('connection', socket => {
    //监听new user事件
    socket.on('new user', function (user) {
        if (!users.hasOwnProperty(user.username)) {
            renshu++;
            users[user.username] = user.username;
            socketobj[user.username] = socket;
            userid[socket.id] = user.username;
            console.log(user.username + "上线了");
            io.emit('messages', '用户' + user.username + '上线了');
            //执行连上操作
            socket.emit('lianshang');
            io.emit('renshu',renshu);
        } else {
            //执行断开操作
            socket.emit('duankai');
        }
    });

    //监听chat事件
    socket.on('chat', function (data) {
        if (socketobj.hasOwnProperty(data.to)) {
            socketobj[data.to].emit('messages', '来自用户' + data.form + '的信息：' + data.messages);
        } else {
            socketobj[data.form].emit('messages', data.form + ',你好，你要发送的用户还没上线');
        }
    });
    //监听disconnect事件
    socket.on('disconnect', () => {
        if (!userid[socket.id] == "") {
            renshu--;
            console.log(userid[socket.id] + '下线了');
            io.emit('messages', userid[socket.id] + '下线了');
            delete socketobj[userid[socket.id]]; //删除对象
            delete users[userid[socket.id]];//删除对象
            delete userid[socket.id];//删除对象
        }
    });
});


