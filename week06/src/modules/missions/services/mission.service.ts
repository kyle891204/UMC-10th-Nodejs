import { getStoreById } from "../../stores/repositories/store.repository.js";
import { addMissionRqpository } from "../repositories/mission.repository.js";
import { getMissionsByStoreId } from "../repositories/mission.repository.js";
export const addMissionService = async(storeId: number, data: any) => {
    const insertId = await addMissionRqpository(storeId, data);
    return insertId;
}

//특정 가게의 미션 목록
export const handleListStoreMissionsService = async(storeId: number, cursor?: number) => {
    const store = await getStoreById(storeId);

    if(!store){throw new Error(`존재하지 않는 가게입니다`);}
    const missions = await getMissionsByStoreId(storeId, cursor);
    return missions;
}
