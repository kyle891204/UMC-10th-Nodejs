import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config";
import { prisma } from "../../../db.config";

// User 데이터 삽입
export const addUser = async (data: any) => {
  // 1. 이미 존재하는 이메일인지 확인
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  
  if (user) {
    return null;
  }

  // 2. 새로운 유저 생성
  const created = await prisma.user.create({ 
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    } 
  });

  return created.id;
};

export const getUser = async (userId: number) => {
  return await prisma.user.findFirstOrThrow({ where: { id: userId } });
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId: number, foodCategoryId: number) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환 (JOIN)
export const getUserPreferencesByUserId = async (userId: number) => {
  return await prisma.userFavorCategory.findMany({
    where: { userId: userId },
    include: {
      foodCategory: true,
    },
    orderBy: { foodCategoryId: "asc" },
  });
};

export const getReviewsByUserId = async (userId: number, cursor?: number) => {
    const reviews = await prisma.userStoreReview.findMany({
        select: {
            id: true,
            storeId: true,
            title: true,
            content: true,
            score: true,
            date: true,
        },
        where: {
            userId: userId,
            id: cursor ? { gt: cursor } : undefined, 
        },
        orderBy: {
            id: "asc",
        },
        take: 5,
    });
  
    return reviews;
};

export const getUserById = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    return user;
};