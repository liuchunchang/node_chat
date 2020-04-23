
function clent() {
  var a = '';
  var user = { username: username };  
  const socket = io.connect('http://localhost:80');
  //连上
  socket.on('connect', function () {
    socket.emit('new user', user);
  });
  socket.on('messages', function (messages) {
    a = a + messages + "<br>";
    document.getElementById('p').innerHTML = a;
  });
  socket.on("renshu",function(renshu){
    document.getElementById('renshu').innerHTML = renshu;
  })
  socket.on("duankai",function(){
  // 断开
   socket.disconnect();
   alert('用户名重复');
  });
  socket.on("lianshang",function(data){
    
  alert('你成功加入了群聊');
  });
}