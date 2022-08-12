// var cors = require("cors")
// app.use(cors())
var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : '3.35.238.205',
  user     : 'ssafyD208',
  password : '_m2d%zytxzqR+Orif~Ui~R!L17z~MX',
  database : 'mybuddy'
});
 

var app = require('express')(); //express 모듈 사용
var http = require('http').createServer(app); //http라는 이름의 express 모듈 기반 http web server 객체 생성
var io = require('socket.io')(http,{
  cors: {
    origin: "*",
    credentials: true,
  },
});  //http web server에 socket.io 모듈 사용 (웹 서버에 소켓이 부착되는 느낌으로)


http.listen(4000, () => { //4000번 포트에서 대기 중인 http 웹 서버 생성
  console.log('listening on *:4000');
});



// app.get('/', (req, res) => {
//   //객체 app(web server)가 request(get method)를 받았을 경우
//   //3000번 포트에 "누군가 들어온 경우 (=웹페이지에 누가 접속함)"
//   res.sendFile(__dirname + '/index.html');  //index.html을 response(웹 브라우저가 이를 받아서 화면에 렌더링)
// });


var clients = [];

io.on('connection', (socket) => {
  //소켓이 붙어있는 http web server에 connection 발생
  socket.on('newUser',function(id){
    //memberID : 번호 or childrenID : 번호 json형태로받자
    var clientInfo = new Object();

    //들어온 사람이 부모님이면
    if(id && id.memberID ){
      console.log('mID' + id.memberID + '님이 접속했습니다.')
      socket.ids = id.memberID;
      socket.types = "member";
      clientInfo.id = socket.id;

    

      //db연결
      connection.connect() 
      connection.query(`SELECT childrenID, name from children where memberID = ${id.memberID}`, (error, rows, fields) => {
        if (error) throw error;
        console.log('User info is: ', rows);
        // rows를 돌면서 나온 모든 아이의 childrenID와 이름을 clientInfo에 담고 clients에 푸쉬한다. 그러면 다른정보는 모두 동일하고 아이의 id와 아이의 이름만 다른 객체가 clients에 저장된다.
        rows.forEach(element => {
          clientInfo.childrenID = element.childrenID;
          clientInfo.name = element.name;
          clients.push(clientInfo);
          //모든 clients를 돌면서 자신의 아이를 찾아서 자신이 접속했다는 정보를 전송
          for (let index = 0; index < clients.length; index++) {
            var child = clients[index];
            //현재 접속해있는 child의 부모 id와 현재 새로 들어온 사람(부모) id가 같다면
            if(child.memberID == id.memberID){
              //아이의 socketid로 이름을 불러준다.
              io.sockets.connected[child.id].emit('newUser',{message : `안녕 ${child.name} 야~!!!`});
            }
          }
        });
      });
      connection.query(`SELECT name from member where memberID = ${id.memberID}`, (error, rows, fields) => {
        rows.forEach(element => {
          socket.name = element.name;
        });
      });
      connection.end();


      
    }
    //----------------------------------------------------------------------------------------------

    //들어온 사람이 아이면
    else if(id && id.childrenID){
      console.log('cID' + id.childrenID + '님이 접속했습니다.')
      socket.ids = id.childrenID;
      socket.types = "children";
      clientInfo.id = socket.id;
      
      //부모님은 하나만 나옴
      connection.connect() 
      connection.query(`SELECT memberID, name from children where childrenID = ${id.childrenID}`, (error, rows, fields) => {
        if (error) throw error;
        console.log('User info is: ', rows);
        
        rows.forEach(element => {
          clientInfo.memberID = element.memberID;
          clientInfo.name = element.name;
        });
        
      });
      clients.forEach(element => {
        if(id.childrenID == element.childrenID){
          io.sockets.connected[element.id].emit('newUser',{message : `${clientInfo.name}님이 접속했습니다.`});
        }
      });
      connection.query(`SELECT name from children where childrenID = ${id.childrenID}`, (error, rows, fields) => {
        rows.forEach(element => {
          socket.name = element.name;
        });
      });

      clients.push(clientInfo);

      connection.end();

      


    }
  })

  //msg에는 부모면 부모의 id와 아이에게 보낼 msg가 들어있다.
  //아이면 아이의 id와 부모에게 보낼 msg가 들어있다.
  socket.on('chat message', (msg) => {

    //부모가 아이에게
    if(socket.types == "member"){
      clients.forEach(element => {
        if(element.memberID == socket.ids){
          io.sockets.connected[element.id].emit('chat message',{message: msg.message});
        }
      });
    }
    //아이가 부모에게
    else if(socket.types == "children"){
      clients.forEach(element => {
        if(element.childrenID == socket.ids){
          io.sockets.connected[element.id].emit('chat message',{message : msg.message});
        }
      });
    }
  });
  socket.on('disconnect', () => {
    console.log('disconnected');
    let name = null;

    //전체를 돌면서
    clients.forEach(element => {

      //만약 나간사람이 부모라면
      if(socket.types =="member" && element.memberID==socket.ids){
        connection.connect();
        connection.query(`SELECT name from member where memberID = ${socket.ids}`, (error, rows, fields) => {
        if (error) throw error;
        
        
        rows.forEach(element => {
           name = element.name;
        });
        
        });
        connection.end();

        //지금 나가는 사람이 부모고 존재하는것들중에 부모의 id와 현재 나가는 부모의 id가 동일하면
        io.sockets.connected[element.id].emit('disconnect',{message : name+"님이 나갔습니다."});
      }
      //나간사람이 아이라면 전체를 돌면서 아이아이디를 가지고있는 부모를 찾아서
      else if(socket.types =="children" && element.childrenID==socket.ids){
        io.sockets.connected[element.id].emit('disconnect',{message : element.name+"님이 나갔습니다."});
      }

    });




  });
});