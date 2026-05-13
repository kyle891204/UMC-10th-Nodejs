import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config";
import { LEGAL_TCP_SOCKET_OPTIONS } from "mongodb";
import { prisma } from "../../../db.config";

//1-1. 지역에 가게 추가하기
export const addStoreRepository = async(regionId: number, data: any) => {
    try{
        const {name, address, detailAddress, phoneNum} = data;
        const newStore = await prisma.store.create({
            data: {regionId, name, address, detailAddress, phoneNum}
        });
        return newStore.id;
    } catch(err){
        throw new Error(`가게 추가중 오류 발생 ${err}`);
    }
};

//1-2. 가게에 리뷰 추가하기
export const addReviewRepository = async(storeId: number,data: any) => {
    try{
        const{userId, title, description, score, date} = data;
        const newReview = await prisma.userStoreReview.create({
            data: {userId, storeId, title, content:description, score, date}
        });
        return newReview.id;
    } catch(err){
        throw new Error(`리뷰 추가 중 오류 발생 ${err}`);
    }
};

//1-2-1. 가게가 있는지 검증
export const getStoreById = async(storeId: number) => {
    try{
        const store = await prisma.store.findUnique({
            where:{id: storeId}
        });
        return store;
    } catch(err) {
        throw new Error(`가게 조회 중 오류 발생: ${err}`);
    }
};

//목록조회
export const getAllStoreReviews = async (
    storeId: number,
    cursor?: number
  ) => {
    const reviews = await prisma.userStoreReview.findMany({
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        score: true,
        date: true,
        user: true,
      },
      where: {
        storeId,
        id: {
          gt: cursor,
        },
      },
      orderBy: {
        id: "asc",
      },
      take: 5,
    });
  
    return reviews;
  };