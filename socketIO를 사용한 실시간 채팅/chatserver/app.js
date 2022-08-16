// var cors = require("cors")
// app.use(cors())
var mysql = require("mysql2");
var connection = mysql.createPool({
  host: "3.35.238.205",
  user: "ssafyD208",
  password: "_m2d%zytxzqR+Orif~Ui~R!L17z~MX",
  database: "mybuddy",
});

var app = require("express")(); //express 모듈 사용
var http = require("http").createServer(app); //http라는 이름의 express 모듈 기반 http web server 객체 생성
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
}); //http web server에 socket.io 모듈 사용 (웹 서버에 소켓이 부착되는 느낌으로)

http.listen(4000, () => {
  //4000번 포트에서 대기 중인 http 웹 서버 생성
  // console.log("listening on *:4000");
});

// app.get('/', (req, res) => {
//   //객체 app(web server)가 request(get method)를 받았을 경우
//   //3000번 포트에 "누군가 들어온 경우 (=웹페이지에 누가 접속함)"
//   res.sendFile(__dirname + '/index.html');  //index.html을 response(웹 브라우저가 이를 받아서 화면에 렌더링)
// });

var clients = [];

io.on("connection", (socket) => {
  //소켓이 붙어있는 http web server에 connection 발생
  socket.on("newUser", function (id) {
    // console.log(typeof id);
    //memberID : 번호 or childrenID : 번호 json형태로받자
    var clientInfo = new Object();
    // console.log(clients);

    //들어온 사람이 부모님이면
    let flag = 0;
    let flag_childern = 0;

    if (id && id.memberID) {
      clients.forEach((element) => {
        if (element.mid == id.memberID) {
          flag = 1;
          return;
        }
      });

      //db연결
      // connection.connect()
      connection.query(
        `SELECT c.childrenID, c.name, m.name as Pname from children as c join member as m on c.memberID = m.memberID where m.memberID = ${id.memberID}`,
        (error, rows, fields) => {
          if (error) throw error;
          // console.log("User info is: ", rows);
          // rows를 돌면서 나온 모든 아이의 childrenID와 이름을 clientInfo에 담고 clients에 푸쉬한다. 그러면 다른정보는 모두 동일하고 아이의 id와 아이의 이름만 다른 객체가 clients에 저장된다.
          rows.forEach((element) => {
            // socket.ids = id.memberID;
            clientInfo.types = "member";
            clientInfo.mid = id.memberID;
            // console.log(clientInfo.types);
            clientInfo.id = socket.id;
            clientInfo.Pname = element.Pname;
            // console.log(element.Pname + "님이 접속했습니다.");
            clientInfo.childrenID = element.childrenID;
            clientInfo.name = element.name;
            clients.push(clientInfo);
            clients = [...new Set(clients.map(JSON.stringify))].map(JSON.parse);
            // _.uniqBy(clients, "id");
            // console.log(clientInfo);
            //모든 clients를 돌면서 자신의 아이를 찾아서 자신이 접속했다는 정보를 전송
            for (let index = 0; index < clients.length; index++) {
              var child = clients[index];
              //현재 접속해있는 child의 부모 id와 현재 새로 들어온 사람(부모) id가 같다면
              if (child.memberID == id.memberID) {
                //아이의 socketid로 이름을 불러준다.
                socket.to(child.id).emit("newUser", {
                  message: `안녕 ${child.name}야 ${element.Pname} 이란다`,
                });
              }
            }
            clientInfo = new Object();
          });
        }
      );

      // connection.query(`SELECT name from member where memberID = ${id.memberID}`, (error, rows, fields) => {
      //   console.log(rows);
      //   rows.forEach(element => {
      //     socket.name = element.name;
      //     console.log(element.name + '님이 접속했습니다.')
      //   });
      // });
    }
    //----------------------------------------------------------------------------------------------

    //들어온 사람이 아이면
    else if (id && id.childrenID) {
      clients.forEach((element) => {
        if (element.cid == id.childrenID) {
          flag_childern = 1;
          return;
        }
      });

      // socket.ids = id.childrenID;
      clientInfo.types = "children";
      clientInfo.id = socket.id;
      clientInfo.cid = id.childrenID;

      //부모님은 하나만 나옴
      // connection.connect();
      connection.query(
        `SELECT memberID, name from children where childrenID = ${id.childrenID}`,
        (error, rows, fields) => {
          if (error) throw error;
          // console.log("User info is: ", rows);

          rows.forEach((element) => {
            clientInfo.memberID = element.memberID;
            clientInfo.name = element.name;
            // console.log(element.name + "님이 접속했습니다.");
            clients.forEach((element2) => {
              if (id.childrenID == element2.childrenID) {
                socket.to(element2.id).emit("newUser", {
                  message: `${element.name}님이 접속했습니다.`,
                });
              }
            });
          });
          // console.log(clientInfo);
          clients.push(clientInfo);
          clients = [...new Set(clients.map(JSON.stringify))].map(JSON.parse);
          // _.uniqBy(clients, "id");
          clientInfo = new Object();
        }
      );

      // connection.query(`SELECT name from children where childrenID = ${id.childrenID}`, (error, rows, fields) => {
      //   rows.forEach(element => {
      //     socket.name = element.name;
      //   });
      // });

      // connection.end();
    }
    if (flag) return;
    if (flag_childern) return;
  });

  //msg에는 부모면 부모의 id와 아이에게 보낼 msg가 들어있다.
  //아이면 아이의 id와 부모에게 보낼 msg가 들어있다.
  socket.on("chat message", (msg) => {
    //부모라면?
    if (msg && msg.memberID) {
      clients.forEach((element) => {
        if (element.memberID == msg.memberID) {
          clients.forEach((element2) => {
            if (element2.mid == msg.memberID) {
              console.log(clients);
              // console.log(element2.Pname);
              socket
                .to(element.id)
                .emit("chat message", { type: 0, message: msg.message });
            }
          });
        } else if (element.mid == msg.memberID) {
          console.log(clients);
          socket
            .to(element.id)
            .emit("chat message", { type: 0, message: msg.message });
        }
      });
    } else if (msg && msg.childrenID) {
      clients.forEach((element) => {
        if (element.childrenID == msg.childrenID) {
          clients.forEach((element2) => {
            if (element2.cid == msg.childrenID) {
              console.log(clients);
              socket
                .to(element.id)
                .emit("chat message", { type: 1, message: msg.message });
            }
          });
        } else if (element.cid == msg.childrenID) {
          console.log(clients);
          socket
            .to(element.id)
            .emit("chat message", { type: 1, message: msg.message });
        }
      });
    }

    // //부모가 아이에게
    // if(socket.types == "member"){
    //   console.log("부모가 아이에게");
    //   clients.forEach(element => {
    //     if(element.memberID == socket.ids){
    //       socket.to(element.id).emit('chat message',{message: socket.name+' : '+ msg.message});
    //     }
    //   });
    // }
    // //아이가 부모에게
    // else if(socket.types == "children"){
    //   clients.forEach(element => {
    //     if(element.childrenID == socket.ids){
    //       socket.to(element.id).emit('chat message',{message : socket.name+' : '+msg.message});
    //     }
    //   });
    // }
  });
  socket.on("disconnect", () => {
    // console.log(socket.id);
    // console.log(clients);
    clients.forEach((element) => {
      //나간사람을 찾았다
      if (element.id == socket.id) {
        clients.forEach((element2) => {
          //나간사람이 자식이면
          if (element.memberID && element.memberID == element2.mid) {
            socket.to(element2.id).emit("disconnected", {
              message: element.name + "님이 나갔습니다.",
            });
            // console.log(element.name + "님이 나갔습니다.");
            //나간사람이 부모라면
          } else if (element.childrenID && element.childrenID == element2.cid) {
            socket.to(element2.id).emit("disconnected", {
              message: element.Pname + "님이 나갔습니다.",
            });
            // console.log(element.Pname + "님이 나갔습니다.");
          }
        });
        // console.log("splice 이후", clients);
      }
    });
    for (let index = 0; index < clients.length; index++) {
      if (clients[index].id == socket.id) {
        clients.splice(index, 1);
      }
    }

    // console.log('disconnected');
    // let name = null;
    // clients.forEach(element => {
    //   if(element.memberID == socket.ids){
    //     socket.to(element.id).emit('disconnected',{message : socket.name+"님이 나갔습니다."});
    //   }

    // });
    // for (let index = 0; index < clients.length; index++) {
    //   if(clients[index].id == socket.id){
    //     clients.splice(index,1);
    //     break;
    //   }
    // }
  });
});
