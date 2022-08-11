var app = require('express')(); //express 모듈 사용
var http = require('http').createServer(app); //http라는 이름의 express 모듈 기반 http web server 객체 생성
var io = require('socket.io')(http);  //http web server에 socket.io 모듈 사용 (웹 서버에 소켓이 부착되는 느낌으로)
 
http.listen(4000, () => { //3000번 포트에서 대기 중인 http 웹 서버 생성
  console.log('listening on *:4000');
});
 
app.get('/', (req, res) => {
  //객체 app(web server)가 request(get method)를 받았을 경우
  //3000번 포트에 "누군가 들어온 경우 (=웹페이지에 누가 접속함)"
  res.sendFile(__dirname + '/index.html');  //index.html을 response(웹 브라우저가 이를 받아서 화면에 렌더링)
});


 
io.on('connection', (socket) => { //소켓이 붙어있는 http web server에 connection 발생
  socket.on('newUser',function(name){
    console.log(name + '님이 접속했습니다.')
    socket.name = name
    socket.broadcast.emit('update',{type:'connect',name:'SERVER',message: name+'님이 접속했습니다.'})
  })
  socket.on('chat message', (msg) => {
    //client가 'chat message'라는 이름의 이벤트를 보낸 경우(발생시킨 경우)
    //msg(해당 이벤트의 결과물)라는 데이터를 받아온다
    msg.name = socket.name
    io.emit('chat message', msg); //client에게 'chat message'라는 이름의 이벤트를 보낸다
  });
  socket.on('disconnect', () => {
    console.log(socket.name+' disconnected');
    socket.broadcast.emit('update',{type: 'disconnect', name:'SERVER',message: socket.name+'님이 나갔습니다.'})
  });
});