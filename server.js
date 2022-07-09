"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const fs_1 = __importDefault(require("fs"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gm = require('gm').subClass({ imageMagick: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const api = require('./api/api');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const im = require('./api/images');
dotenv.config();
const app = express_1.default();
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express_fileupload_1.default({ createParentPath: true }));
app.use('/img', express_1.default.static('./api/img'));
app.get("/test", (req, res) => {
    res.writeHead(200, { "content-type": "text/html" });
    fs_1.default.createReadStream(__dirname + "/api/test.html").pipe(res);
});
app.use('/api', api);
const port = 5001;
const server = app.listen(port, () => console.log("Server listening on port " + port));
