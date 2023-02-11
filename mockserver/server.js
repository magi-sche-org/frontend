const PROTO_PATH = "protocol" + "/authorize.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const authorize = protoDescriptor.geekCamp;

function doGetToken(call, callback) {
  callback(null, {
    token: "Hello world!",
    status: 200,
  });
}

function getServer() {
  const server = new grpc.Server();
  server.addService(authorize.Authorize.service, {
    GetToken: doGetToken,
  });
  return server;
}

if (require.main === module) {
  const server = getServer();
  server.bind("0.0.0.0:9090", grpc.ServerCredentials.createInsecure());
  server.start();
}

exports.getServer = getServer;
