import { addStoreRepository } from "../repositories/store.repository";
import { addReviewRepository } from "../repositories/store.repository";
import { getStoreById } from "../repositories/store.repository";
import { getAllStoreReviews } from "../repositories/store.repository";
import { ReviewListResponse, responseFromReviews, ReviewItem} from '../dtos/store.dto';

export const addStoreService = async (regionId: number, data: any) => {
    const insertId = await addStoreRepository(regionId, data);
    return insertId;
};


export const addReviewService = async(storeId: number, data: any) => {
    const store = await getStoreById(storeId);
    if (!store) {
        throw new Error("존재하지 않는 가게");
    }
    const insertId = await addReviewRepository(storeId, data);
    return insertId;
}

export const listStoreReviews = async(
    storeId: number,
    cursor?: number,
): Promise<ReviewListResponse> => {
    const reviews = await getAllStoreReviews(storeId, cursor);
    const mappedReviews: ReviewItem[] = reviews.map((r) => ({
        id: r.id,
        userId: r.userId,
        title: r.title,
        content: r.content,
        score: r.score,
        date: r.date,
    }));
    return responseFromReviews(reviews);
};