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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// eslint-disable-next-line @typescript-eslint/no-var-requires
var path = require("path");
var express_1 = __importDefault(require("express"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
var fileUpload = require("express-fileupload");
var sqlite3 = __importStar(require("sqlite3"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs = require("fs")
// eslint-disable-next-line @typescript-eslint/no-var-requires
, gm = require('gm').subClass({ imageMagick: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
var url = require("url");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// import * as formidable from "formidable";
// eslint-disable-next-line @typescript-eslint/no-var-requires
var im = require('./images');
var router = express_1["default"].Router();
var db = new sqlite3.Database("./api/db/boards.db", function (err) {
    if (err) {
        console.log("Unable to open database: \n" + "\t" + err.message);
    }
    else {
        console.log("Board database up");
    }
});
// const createDb = () =>
//   new Promise((resolve, reject) =>
//     fs.readFile(path.join(__dirname, "../schema.sql"), (err, data) => {
//       if (err) return reject(err);
//       db.exec(data.toString(), (err) => {
//         if (err) return reject(err);
//         resolve();
//       });
//     })
//   );
// createDb();
//
// user functions
//
var getToken = function () {
    return { token: 'test_token' };
};
var login = function (user, callback) {
    var token;
    var sql = "SELECT username FROM users \n               WHERE username = \"" + user.username + "\"\n               AND password = \"" + user.password + "\";";
    db.get(sql, function (err, row) {
        if (!row && callback)
            callback.sendStatus(500);
        else {
            token = getToken();
            callback.send(token);
        }
    });
};
//
// misc
//
var deleteImage = function (fileName) {
    var name = fileName.match(/\d+/)[0];
    var ext = fileName.match(/\..+/)[0];
    var fileThumb = name + "s" + ext;
    try {
        fs.unlinkSync(__dirname + "/img/" + fileName);
        fs.unlinkSync(__dirname + "/img/" + fileThumb);
    }
    catch (err) {
        console.log(err);
    }
};
var processImage = function (file, filePath, fileName, callback) {
    file.mv(filePath + fileName);
    im.resize(fileName);
    callback();
};
var validateFile = function (fileName) {
    var ext = fileName.match(/[^\.]+$/)[0].toUpperCase();
    var acceptedFileTypes = [
        "JPG",
        "JPEG",
        "PNG",
        "BMP",
        "GIF"
    ];
    if (acceptedFileTypes.find(function (type) { return type === ext; }))
        return true;
    else
        return false;
};
var uploadFile = function (req, res) {
    var _a;
    var file = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.img;
    var fileName = file === null || file === void 0 ? void 0 : file.name;
    var filePath = path.join(__dirname, './img/');
    validateFile(fileName) ? processImage(file, filePath, fileName, function () { return res.sendStatus(200); })
        : res.sendStatus(500);
};
var pruneThreads = function (board, callback) {
    var threadLimit = 100;
    var getCount = "SELECT COUNT(thread) from posts_" + board + " WHERE thread = post";
    var getLastThread = "SELECT thread FROM posts_" + board + " GROUP BY thread ORDER BY bump DESC LIMIT 1;";
    db.each(getCount, function (err, row) {
        var count = row['COUNT(thread)'];
        if (count > threadLimit) {
            db.each(getLastThread, function (err, row) {
                var getFile = "SELECT file FROM posts_" + board + " WHERE thread = " + row.thread + ";";
                var deleteThread = "DELETE FROM posts_" + board + " WHERE thread = " + row.thread + ";";
                db.each(getFile, function (err, row) {
                    deleteImage(row.file);
                }, function () { return db.run(deleteThread); });
            });
        }
    });
};
var deletePost = function (post, board) {
    var postDeleteLimit = 900000;
    var getPassword = "SELECT password, created FROM posts_" + board + " WHERE post = " + post.id + ";";
    var getImage = "SELECT file FROM posts_" + board + " WHERE post = " + post.id + ";";
    var deletePost = "DELETE FROM posts_" + board + " WHERE post = " + post.id + ";";
    var access = true;
    var queryAndDelete = function (getImage, deletePost) {
        return db.serialize(function () {
            db.get(getImage, function (err, row) {
                if (row.file != "null") {
                    deleteImage(row.file);
                }
            });
            db.run(deletePost);
        });
    };
    if (post.password) {
        var currentDate_1 = Date.now();
        db.get(getPassword, function (err, row) {
            if (row.password === post.password) {
                if (row.created - currentDate_1 < postDeleteLimit) {
                    queryAndDelete(getImage, deletePost);
                }
            }
        });
    }
    else {
        queryAndDelete(getImage, deletePost);
    }
};
//
// post functions
//
function newPost(post, callback) {
    var board = post.board, thread = post.thread, created = post.created, email = post.email, name = post.name, comment = post.comment, file = post.file, fileOrig = post.fileOrig, fileSize = post.fileSize, fileWidth = post.fileWidth, fileHeight = post.fileHeight, sage = post.sage;
    var filehash = null;
    var password = null;
    var ip = null;
    var bump = null;
    var sticky = null;
    var locked = null;
    var sql = "INSERT INTO posts_" + board + " \n               VALUES \n               (null,\n                " + thread + ",\n                null,\n                current_timestamp,\n                \"" + email + "\",\n                \"" + name + "\", \n                \"" + comment + "\",\n                \"" + file + "\",\n                \"" + fileOrig + "\",\n                \"" + fileSize + "\",\n                \"" + fileWidth + "\",\n                \"" + fileHeight + "\",\n                \"" + filehash + "\",\n                \"" + password + "\",\n                \"" + ip + "\",\n                \"" + bump + "\",\n                \"" + sticky + "\",\n                \"" + locked + "\",\n                \"" + sage + "\");";
    var setBump = "UPDATE posts_" + board + " SET bump = 1 where thread = " + thread + ";";
    var updateBump = "UPDATE posts_" + board + " SET bump = (bump + 1) where thread = post;";
    if (sage) {
        db.run(sql, function (err) { return err ? console.log(err) : function () { return callback.sendStatus(200); }; });
    }
    else {
        db.run(updateBump, function (ok) {
            return db.run(setBump, function (ok) {
                return db.run(sql, function (ok, err) { return err ? console.log(err) : function () { return callback.sendStatus(200); }; });
            });
        });
    }
}
function newThread(post, res) {
    var bump = post.bump, board = post.board, thread = post.thread, created = post.created, subject = post.subject, email = post.email, name = post.name, comment = post.comment, file = post.file, fileOrig = post.fileOrig, fileSize = post.fileSize, fileWidth = post.fileWidth, fileHeight = post.fileHeight;
    var filehash = null;
    var password = null;
    var ip = null;
    var sticky = null;
    var locked = null;
    var sage = null;
    var updateBump = "UPDATE posts_" + board + " SET bump = (bump + 1) WHERE post = thread;";
    var sql = "INSERT INTO posts_" + board + "\n               VALUES \n               (null,\n                \"" + thread + "\",\n                \"" + subject + "\",\n                current_timestamp,\n                \"" + email + "\",\n                \"" + name + "\", \n                \"" + comment + "\",\n                \"" + file + "\",\n                \"" + fileOrig + "\",\n                \"" + fileSize + "\",\n                \"" + fileWidth + "\",\n                \"" + fileHeight + "\",\n                \"" + filehash + "\",\n                \"" + password + "\",\n                \"" + ip + "\",\n                \"" + bump + "\",\n                \"" + sticky + "\",\n                \"" + locked + "\",\n                \"" + sage + "\");";
    var sql2 = "UPDATE posts_" + board + " SET thread = post WHERE thread = \"newthread\";";
    db.run(updateBump, function (ok, err) {
        return err ? console.log("updateBump fail: " + err) :
            db.run(sql, function (ok, err) {
                return err ? console.log("sql insert fail: " + err) :
                    db.run(sql2, function (ok, err) { return err ? console.log("sql update fail: " + err) :
                        pruneThreads(board, res); });
            });
    });
}
//
// post getters
//
function getPosts(req, res) {
    var query = req.query, board = req.board, thread = req.thread, post = req.post;
    var result = [];
    var partialThreads = {};
    var sql;
    var count;
    if (query === "post") {
        sql = "SELECT * FROM posts_" + board + " WHERE post = " + post;
        db.each(sql, function (err, row) { return result.push(row); }, function () { return res.send(result); });
    }
    if (query === "thread") {
        sql = "SELECT * FROM posts_" + board + " WHERE thread = " + thread;
        if (post != "null") {
            sql = sql + (" LIMIT " + post);
        }
        db.each(sql, function (err, row) { return result.push(row); }, function () { return res.send(result); });
    }
    if (query === "threads") {
        sql = "SELECT * FROM posts_" + board + " GROUP BY thread";
        if (post != "null") {
            var sql2_1 = "SELECT * FROM posts_" + board + " a WHERE a.RowId IN (\n                SELECT b.RowId\n                  FROM posts_" + board + " b\n                  WHERE a.thread = b.thread\n                  ORDER BY b.post DESC LIMIT " + post + " \n              ) ORDER BY thread ASC;";
            db.each(sql, function (err, row) { return partialThreads[row.thread] = [row]; }, function (ok) { return db.each(sql2_1, function (err, row) {
                if (row.post != row.thread) {
                    partialThreads[row.thread].push(row);
                }
            }, function (ok) { return res.send(partialThreads); }); });
        }
        else {
            db.each(sql, function (err, row) { return result.push(row); }, function () { return res.send(result); });
        }
    }
    if (query === "catalog") {
        sql = "SELECT * FROM posts_" + board + " GROUP BY thread ORDER BY bump;";
        db.each(sql, function (err, row) { return result.push(row); }, function () { return res.send(result); });
    }
    if (query === "omitted") {
        sql = "SELECT COUNT(thread) from posts_" + board + " WHERE thread=" + thread + ";";
        db.each(sql, function (err, row) {
            count = row['COUNT(thread)'];
        }, function () { return res.send(count.toString()); });
    }
}
var getThreadStats = function (board, res) {
    var threads = "SELECT thread FROM posts_" + board + " GROUP BY thread;";
    var threadStats = [];
    var threadCount = 0;
    db.each(threads, function (err, row) {
        var currentThread = { thread: row.thread, posts: 0, images: 0 };
        var postCount = "SELECT COUNT(post) from posts_" + board + " WHERE thread = " + row.thread + ";";
        var imageCount = "SELECT COUNT(file) from posts_" + board + " WHERE thread = " + row.thread + " and file != \"null\";";
        threadCount += 1;
        db.serialize(function () {
            db.get(postCount, function (err, row) {
                var posts = row['COUNT(post)'];
                currentThread.posts = posts;
            });
            db.get(imageCount, function (err, row) {
                var images = row['COUNT(file)'];
                currentThread.images = images;
                threadStats.push(currentThread);
                if (threadCount === threadStats.length) {
                    res.send(threadStats);
                }
            });
        });
    });
};
var getBoards = function (res) {
    var sql = "SELECT * FROM boards;";
    var result = [];
    db.each(sql, function (err, row) { return result.push(row); }, function () {
        if (res) {
            res.send(result);
        }
        else {
            return result;
        }
    });
};
var getRoutes = function (res) { return __awaiter(void 0, void 0, void 0, function () {
    function getThreads(call) {
        return new Promise(function (resolve, reject) {
            db.all(call.sql, function (err, rows) {
                resolve({ uri: call.uri, threads: rows });
                reject(function (err) { return console.log(err); });
            });
        });
    }
    var boardList, dbCalls, sql;
    return __generator(this, function (_a) {
        boardList = [];
        dbCalls = [];
        sql = 'SELECT * FROM boards';
        db.each(sql, function (err, row) {
            dbCalls.push({ uri: row.uri, sql: "SELECT * FROM posts_" + row.uri + " GROUP BY thread;" });
        }, function () {
            dbCalls.forEach(function (call) {
                getThreads(call).then(function (res) { return boardList.push(res); })
                    .then(function () { boardList.length === dbCalls.length ? res.send(boardList) : null; });
            });
        });
        return [2 /*return*/];
    });
}); };
//
// routes
//
router.post("/login", function (req, res) {
    login(req.body, res);
});
router.post("/news/newpost", function (req, res) {
    var post = req.body;
    var sql = "INSERT INTO news VALUES (\n          NULL,\n          \"" + post.subject + "\",\n          \"" + post.author + "\",\n          \"" + post.post + "\",\n          CURRENT_TIMESTAMP\n        );";
    db.run(sql, function (ok) { return res.sendStatus(200); });
});
router.post("/uploadfile", function (req, res) {
    uploadFile(req, res);
});
router.post("/newthread", function (req, res) {
    newThread(req.body, res);
});
router.post("/newpost", function (req, res) {
    newPost(req.body);
    res.sendStatus(200);
});
router.get("/getposts", function (req, res) {
    var query = url.parse(req.url, true).query;
    getPosts(query, res);
});
router.get("/news/getposts", function (req, res) {
    var posts = [];
    var sql = "SELECT * FROM news ORDER BY postId DESC;";
    db.each(sql, function (err, row) { return posts.push(row); }, function () { return res.send(posts); });
});
router.get("/getboards", function (req, res) {
    getBoards(res);
});
router.get("/getthreadstats", function (req, res) {
    var query = url.parse(req.url, true).query;
    var board = query.board;
    getThreadStats(board, res);
});
router.get("/routes", function (req, res) {
    getRoutes(res);
});
module.exports = router;
