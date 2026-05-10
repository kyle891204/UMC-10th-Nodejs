import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";
import { LEGAL_TCP_SOCKET_OPTIONS } from "mongodb";
import { prisma } from "../../../db.config.js";


export const addMissionRqpository = async(storeId: number, data: any)=>{
    try{
        const {name, description, points, deadline} = data;
        const newMission = await prisma.storeMission.create({
            data: {storeId, name, description, points, deadline}
        });
        return newMission.id;
    } catch(err){
        throw new Error(`미션 추가 중 오류 발생 ${err}`);
    }
}

//특정 가게의 미션 목록
export const getMissionsByStoreId = async (storeId: number, cursor?: number) => {
    const missions = await prisma.storeMission.findMany({
        select: {
            id: true,
            storeId: true,
            name: true,
            description: true,
            points: true,
            deadline: true,
            createdAt: true
        },
        where: {
            storeId: storeId,
            id: cursor ? { gt: cursor } : undefined,
        },
        orderBy: {
            id: "asc", 
        },
        take: 5, 
    });
  
    return missions;
};