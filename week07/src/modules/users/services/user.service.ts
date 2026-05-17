import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto"; //인터페이스 가져오기
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository";
import { AppError} from "../../../common/errors/app.error";

import { getUserById } from "../repositories/user.repository";
import { getReviewsByUserId } from "../repositories/user.repository";
import { DuplicateUserEmailError } from "../../../common/errors/error";

export const userSignUp = async (data: UserSignUpRequest) : Promise<UserSignUpResponse> => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: new Date(data.birth), // 문자열을 Date 객체로 변환해서 넘겨줍니다.
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

    if (joinUserId === null) {
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const userId = user!.id;
  const preferences = (await getUserPreferencesByUserId(joinUserId)).map(
      (obj : any)=>obj.foodType.name,
  );
  return <UserSignUpResponse>{
      id: user!.id,
      email: data.email,
      name: data.name,
      preferCategory: preferences,
  };
};

export const listUserReviewsService = async(userId: number, cursor?:number) => {
  const user = await getUserById(userId);
    if (!user) {
        throw new AppError({
            statusCode: 404,
            errorCode: "USER_NOT_FOUND",
            message: "존재하지 않는 유저입니다."
        });
    }
  const reviews = await getReviewsByUserId(userId, cursor);
  return reviews;
}