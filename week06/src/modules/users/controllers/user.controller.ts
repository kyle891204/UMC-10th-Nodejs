import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { UserSignUpRequest } from "../dtos/user.dto.js";
import { listUserReviewsService } from "../services/user.service.js";

export const handleUserSignUp = async (req: Request, res: Response, next: NextFunction ) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
 
	//서비스 로직 호출 
    // req.body를 UserSignUpRequest 타입으로 '강제' (Type Assertion) 해줍니다. 
    const user = await userSignUp(bodyToUser({
      email: req.body.email,
      name: req.body.name,
      gender: req.body.gender,
      birth: req.body.birth,
      address: req.body.address,
      detailAddress: req.body.detailAddress,
      phoneNumber: req.body.phoneNumber,
      preferences: req.body.preferences,
    }));
  
  //성공 응답 보내기
  res.status(StatusCodes.OK).json({ result: user });
};

export const handleListUserReviews = async(req:Request, res:Response) => {
  try{
    const {userId} = req.params;
    console.log("===사용자의 리뷰 조회 요청===");
    console.log("요청 유저 번호:",userId);

    const cursor = typeof req.query.cursor === "string" ? Number(req.query.cursor) : undefined;
    const reviews = await listUserReviewsService(Number(userId), cursor);
    res.status(StatusCodes.OK).json({
      isSuccess: true,
      message: "리뷰 목록 조회 성공",
      data: reviews
    });
  } catch(error: any){
    console.error("리뷰 목록 조회 중 에러:",error);
    res.status(400).json({
      isSuccess:false,
      message:error.message||"리뷰 목록 조회 실패"
    });
  }
}