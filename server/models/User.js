const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; // salt가 몇글자인지 - 10자리인 salt를 만들어서 비밀번호를 암호화한다
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //space 바를 없애주는 역할
    unique: 1, //똑같은 이메일 못쓰게함
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number, //0이 일반 사용자, 1이 관리자
    default: 0,
  },
  image: String,
  token: {
    //유효성 관리를 위한
    type: String,
  },
  tokenExp: {
    //토큰 유효기간
    type: Number,
  },
});

//mongodb method ,  user정보를 save하기 전에 함수 실행
userSchema.pre("save", function (next) {
  var user = this;

  //비밀번호를 암호화 시킨다

  if (user.isModified("password")) {
    //비밀번호 변경할 때만 실행
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//비밀번호 확인 메서드 만들기(comparePassword)
userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567   암호화된 비밀번호 "$2b$10$hpTVD8xBRU5EFGYsNjENqON.EG6BiYAdj74jJqvfwYy/qYCDKQOIC"

  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

//토큰 생성 메서드 만들기 (generateToken)
userSchema.methods.generateToken = function (cb) {
  let user = this;

  //jsonwebtoken을 이용해서 token 생성
  var token = jwt.sign(user._id.toHexString(), "dkanthflsk");
  //user._id 와 "dkanthflsk" 를 합쳐서 토큰을 인코딩하는데
  //나중에 서버에서 "dkanthflsk" 를 이용해서 디코딩해서 user._id를 얻어냄

  user.token = token;
  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  //statics에서 this는 모델 자체를 가리킴
  //methods에서 this는 데이타 인스턴스를 가리킴

  jwt.verify(token, "dkanthflsk", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, (err, user) => {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

//schema를 model로 감쌈
const User = mongoose.model("User", userSchema); //모델의 이름 : User

module.exports = { User };
