import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { addReviewService, addStoreService, listStoreReviews } from "../services/store.service";

//1-1.지역에 가게 추가하기
export const addStore = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {regionId} = req.params; //url에 적힌 지역코드 가져오기
        const storeData = req.body;
        console.log("==특정 지역 가게 추가 요청==");
        console.log("요청 지역 번호 :", regionId);
        console.log("요청 가게 번호 :", req.body);

        const newStoreId = await addStoreService(Number(regionId), storeData);

        res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: `생성완료`,
            data: req.body
        });
    } catch (error) {
        console.error("가게 추가 중 에러 발생: ",error);
        res.status(400).json({
            isSuccess: false,
            message: "추가 중 오류 발생"
        });
    };
}

//1-2.가게에 리뷰 추가하기
export const addReviews = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {storeId} = req.params;
        const reviewData = req.body;
        console.log("===가게에 리뷰 추가 요청==");
        console.log("요청 가게 번호 :", storeId);
        const newReviewId = await addReviewService(Number(storeId), reviewData);
        res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: `생성완료`,
            data: req.body
        });
    } catch(error: any) {
        console.error("리뷰 추가 중 에러 발생:",error);
        res.status(400).json({
            isSuccess: false,
            message: error.message || "리뷰 추가 중 오류 발생"
        });
    };
}

//목록조회
export const handleListStoreReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    const cursor =
    typeof req.query.cursor === "string"
      ? parseInt(req.query.cursor, 10)
      : 0;

    const reviews = await listStoreReviews(storeId, cursor);

    res.status(StatusCodes.OK).json(reviews);
  } catch (err) {
    next(err);
  }
};