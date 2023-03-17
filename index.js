// import React from 'react';
const express = require("express");
const cors = require("cors");
const models = require('./models');
const multer = require("multer");

const app = express();
const port = 8080;

const upload = multer({ 
    storage:multer.diskStorage({
        destination:function(req, file, cb){
            cb(null, "uploads/");
        },
        filename:function(req, file, cb){
            cb(null,file.originalname);
        }
    })
});

app.use(express.json());
app.use(cors());
app.use("/uploads",express.static("uploads"));





app.get("/products", (req, res) => {
    models.Product.findAll({
        //'참조컬럼','ASC'||'DESC'
        //'ASC':오름차순 'DESC':내림차순
        order:[['createdAt','DESC']],
        attributes:["id","name","price","seller","imageUrl","createdAt"]
    })
        .then((result) => {
            console.log("product:", result);
            res.send({ products: result });
        })
        .catch((err) => {
            console.error(err);
            res.send("에러발생");
        });
});

app.get("/products/:id", (req, res) => {
    const params = req.params;
    const { id } = params;
    models.Product.findOne({
        where: { id: id },
    }).then((result)=>{
        console.log("조회결과:",result);
        res.send({
            product:result
        });
    }).catch((error)=>{
        console.error(error);
        res.send("상품조회시 에러가 발생했습니다");
    });
});

app.post('/image', upload.single('image'), (req, res, next)=>{
    const file=req.file;
    console.log(file);
    res.send({
        imageUrl:file.path,
    })
})

//상품생성데이터를 데이터 베이스 추가
app.post("/products", (req, res) => {
    const body = req.body;
    //1. 디스트럭처링으로 상수 body 의 값을 개별적으로 할당한다
    const { name, description, price, seller } = body;
    if (!name || !description || !price || !seller) {
        res.send("모든 필드를 입력해주세요")
    }
    //2. 레코드 생성 :  Product테이블에 괄호안의 객체를 생성함
    models.Product.create({
        name, description, price, seller
    })
        //3. 데이터를 다루는 것은 기본적으로 비동기 통신을 지원하므로 promise 객체 활용
        .then((result) => {
            console.log('상품생성결과:', result);
            res.send({ result })
        })
        .catch((error) => {
            console.error(error);
            //res.send('상품 업로드에 문제가 발생했습니다.')
        });
});


//app 실행
app.listen(port, () => {
    console.log("💱망고샵의 쇼핑몰 서버가 돌아가고 있습니다💱");
    //sequelize.sync()
    models.sequelize
        .sync()
        .then(() => {
            console.log('✓ DB 연결 성공');
        })
        .catch(function (err) {
            console.error(err);
            console.log('✗ DB 연결 에러');
            //에러발생시 서버프로세스 종료
            process.exit();
        });
});


//method: post, /login 로그인이 완료되었습니다
app.post('/login', (req, res) => {
    res.send('로그인이 완료되었습니다');
});


