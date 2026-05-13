import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { addMissionService } from "../services/mission.service";
import { handleListStoreMissionsService } from "../services/mission.service";

export const addMission = async(req: Request, res: Response, next:NextFunction) => {
    try{
        const {storeId} = req.params;
        const missionData = req.body;
        console.log("==가게 미션 추가 요청==");
        console.log("요청 가게 번호 :", req.body);

        const newMissionId = await addMissionService(Number(storeId), missionData);

        res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: `생성완료`,
            data: req.body
        });
    }   catch (error) {
        console.error("가게 추가 중 에러 발생: ", error);
        res.status(400).json({
            isSuccess: false,
            message: "미션 추가 중 오류 발생"
        });
    };
};

//특정 가게의 미션 목록
export const handleListStoreMissions = async (req:Request, res:Response) => {
    try{
        const {storeId} = req.params;
        console.log("===특정 가게 미션 조회 요청===");
        console.log("요청 가게 번호 :",storeId);
        const cursor = typeof req.query.cursor === "string" ? Number(req.query.cursor):undefined;
        const missions = await handleListStoreMissionsService(Number(storeId), cursor);
        res.status(StatusCodes.OK).json({
            isSuccess: true,
            message: `조회완료`,
            data: missions
        });
    } catch(error: any){
        console.error("미션 조회 중 에러 발생:",error);
        res.status(400).json({
            isSuccess: false,
            message: error.message || "미션 조회 중 실패"
        });
    }
};

