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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("../routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const meals_1 = __importDefault(require("../routes/meals"));
const auth_2 = __importDefault(require("../routes/auth"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1/users', auth_1.default);
app.use('/api/v1/meals', meals_1.default);
app.use('/signup', auth_2.default);
app.get("/ping", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        message: "hello from Kian",
    });
}));
// app.get('/bananas', async(_req : Request, res: Response) => {
//     res.send('hello world, this is bananas');
// });
app.listen(PORT, () => {
    console.log("Server is running on port --", PORT);
});
