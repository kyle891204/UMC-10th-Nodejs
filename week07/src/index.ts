import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { RegisterRoutes } from "./generated/routes";
import { AppError } from "./common/errors/app.error";

// 1. 환경 변수 설정
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 2. 미들웨어 설정
app.use(morgan('dev')); //로그포맷:dev
app.use(cookieParser());
app.use(cors());            // cors 방식 허용
app.use(express.static('public'));    // 정적 파일 접근
app.use(express.json());              // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

//테스트
app.get('/test', (req, res)=>{
    res.send('Hello');
});


// 쿠키 만드는 라우터
app.get('/setcookie', (req, res) => {
    // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
    res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
    res.send('쿠키가 생성되었습니다!');
});

// 쿠키 읽는 라우터
app.get('/getcookie', (req, res) => {
    // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
    const myCookie = req.cookies.myCookie;

    if (myCookie) {
        console.log(req.cookies); // { myCookie: 'hello' }
        res.send(`당신의 쿠키: ${myCookie}`);
    } else {
        res.send('쿠키가 없습니다.');
    }
});

//Express.js에 생성한 엔드포인트들을 register
const router = express.Router();
RegisterRoutes(router);
app.use("/api/v1", router);


app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});

