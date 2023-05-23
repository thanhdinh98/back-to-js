"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewRabbitMqProducer = exports.Producer = exports.NewRabbitMqConsumer = exports.Consumer = void 0;
var amqplib_1 = __importDefault(require("amqplib"));
var locks_1 = __importDefault(require("locks"));
var meta_1 = require("./meta");
var conn;
var mutex = locks_1.default.createMutex();
function InitializeMqBroker() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(conn == null)) return [3, 5];
                    mutex.lock();
                    if (!(conn == null)) return [3, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, amqplib_1.default.connect("")];
                case 2:
                    conn = _a.sent();
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    throw new Error("Initialize RabbitMQ failed!");
                case 4:
                    mutex.unlock();
                    _a.label = 5;
                case 5: return [2];
            }
        });
    });
}
var Consumer = (function () {
    function Consumer(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    Consumer.prototype.ConsumeMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rMsg_1, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.channel.assertQueue(this.queue, {
                            durable: true
                        });
                        this.channel.prefetch(1, true);
                        rMsg_1 = null;
                        return [4, this.channel.consume(this.queue, function (msg) {
                                var _a, _b;
                                if (!msg) {
                                    throw new Error("No msg found!");
                                }
                                _this.currentMsg = msg;
                                rMsg_1 = new meta_1.Msg((_a = _this.currentMsg) === null || _a === void 0 ? void 0 : _a.content, (_b = _this.currentMsg) === null || _b === void 0 ? void 0 : _b.fields.routingKey);
                            }, {
                                noAck: true,
                            })];
                    case 1:
                        _a.sent();
                        return [2, rMsg_1];
                    case 2:
                        err_2 = _a.sent();
                        throw new Error("Fetch message failed!");
                    case 3: return [2];
                }
            });
        });
    };
    Consumer.prototype.CommitMessage = function () {
        try {
            this.channel.assertQueue(this.queue);
            if (!this.currentMsg) {
                throw new Error("No msg found!");
            }
            this.channel.ack(this.currentMsg);
            this.currentMsg = null;
        }
        catch (err) {
            throw new Error("Commit message failed|");
        }
    };
    return Consumer;
}());
exports.Consumer = Consumer;
function NewRabbitMqConsumer(queue) {
    return __awaiter(this, void 0, void 0, function () {
        var consumer, _a, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = Consumer.bind;
                    return [4, conn.createChannel()];
                case 1:
                    consumer = new (_a.apply(Consumer, [void 0, _b.sent(), queue]))();
                    return [2, consumer];
                case 2:
                    err_3 = _b.sent();
                    throw new Error("Create consumer failed!");
                case 3: return [2];
            }
        });
    });
}
exports.NewRabbitMqConsumer = NewRabbitMqConsumer;
var Producer = (function () {
    function Producer(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    Producer.prototype.Publish = function (msg) {
        try {
            this.channel.assertQueue(this.queue, {
                durable: true
            });
            this.channel.sendToQueue(this.queue, msg);
        }
        catch (err) {
            throw new Error("Publish msg failed!");
        }
    };
    return Producer;
}());
exports.Producer = Producer;
function NewRabbitMqProducer(queue) {
    return __awaiter(this, void 0, void 0, function () {
        var producer, _a, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = Producer.bind;
                    return [4, conn.createChannel()];
                case 1:
                    producer = new (_a.apply(Producer, [void 0, _b.sent(), queue]))();
                    return [2, producer];
                case 2:
                    err_4 = _b.sent();
                    throw new Error("Create producer failed!");
                case 3: return [2];
            }
        });
    });
}
exports.NewRabbitMqProducer = NewRabbitMqProducer;
