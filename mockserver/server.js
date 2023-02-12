const PROTO_AUTH = "protocol" + "/authorize.proto";
const PROTO_EVENT = "protocol" + "/event.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const Timestamp = require("google-protobuf/google/protobuf/timestamp_pb");
const Duration = require("google-protobuf/google/protobuf/duration_pb");

const packageAuthDefinition = protoLoader.loadSync(PROTO_AUTH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const packageEventDefinition = protoLoader.loadSync(PROTO_EVENT, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptorAuth = grpc.loadPackageDefinition(packageAuthDefinition);
const serviceAuth = protoDescriptorAuth.geekCamp;

const protoDescriptorEvent = grpc.loadPackageDefinition(packageEventDefinition);
const serviceEvent = protoDescriptorEvent.geekCamp;

function doGetToken(call, callback) {
  callback(null, {
    token: "Hello world!",
    status: 200,
  });
}
// string                   id       = 1;  // イベントid
// string                   name     = 2;  // イベント名
// bool                     owner    = 3;  // イベント所有者か
// google.protobuf.Duration timeUnit = 4;  // 時間単位(秒)
// google.protobuf.Duration duration = 5;  // 所要時間
// repeated Answer          answers  = 6;  // 参加者の解答
function doGetEvent(call, callback) {
  // const d = new Duration();
  // d.getSeconds(60 * 30);
  callback(null, {
    id: "hoge",
    name: "イベントモック",
    owner: false,
    timeUnit: null,
    duration: null,
    answers: [],
    proposedStartTime: [...Array(5)].map((_, v) => {
      const date = new Date();
      date.setDate(date.getDate() - v);
      return Timestamp.Timestamp.fromDate(date);
    }),
  });
}

function doCreateEvent(call, callback) {
  callback(null, {
    eventId: "test create event",
  });
}

function doRegisterAnswer(call, callback) {
  callback(null, {});
}

function getServer() {
  const server = new grpc.Server();
  server.addService(serviceAuth.Authorize.service, {
    GetToken: doGetToken,
  });
  server.addService(serviceEvent.Event.service, {
    GetEvent: doGetEvent,
    RegisterAnswer: doRegisterAnswer,
    CreateEvent: doCreateEvent,
  });
  return server;
}

if (require.main === module) {
  const server = getServer();
  server.bind("0.0.0.0:9090", grpc.ServerCredentials.createInsecure());
  server.start();
}

exports.getServer = getServer;
