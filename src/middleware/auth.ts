import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import config from '../config';

export default (req: Request, res: Response, next: NextFunction) => {
  // request-header 에서 토큰 받아오기
  const token = req.headers['authorization']?.split(' ').reverse()[0];

  // 토큰 유무 검증
  if (!token) {
    return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }

  // 토큰 검증
  try {
    // jwt token 해독
    const decoded = jwt.verify(token, config.jwtSecret);
    // payload 꺼내오기
    req.body.userId = (decoded as JwtPayload).user.id;
    // 다음으로 넘기기
    next();
  } catch (error: any) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.EXPIRED_TOKEN));
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};
