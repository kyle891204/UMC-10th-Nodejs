//1-1. 특정 지역에 가게 추가하기
export interface addStoreRequest{
  name: string; //가게명
  address: string; //가게주소
  addressDetail : string; //가게상세주소
  phoneNum : string; //가게전화번호
}

//1-2. 가게에 리뷰 추가하기
export interface addReviewRequest{
  title: string; //리뷰제목
  description: string; //본문
  score: number;
  date: Date;
}

export interface ReviewListResponse{
  data: ReviewItem[];
  pagination: {
    cursor: number | null;
  };
}

export interface ReviewItem {
    id: number;
    userId: number;
    title: string | null;
    content: string | null;
    score: number | null;
    date: Date;
}

 export const responseFromReviews = (
    reviews: ReviewItem[]
  ): ReviewListResponse => {
    const lastReview = reviews[reviews.length - 1];
  
    return {
      data: reviews,
      pagination: {
        cursor: lastReview ? lastReview.id : null,
      },
    };
  };
