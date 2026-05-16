import {
    Body,
    Controller,
    Get,
    Middlewares,
    Post,
    Request,
    Res,
    Route,
    Tags,
    Path,
    Query,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse} from "../dtos/user.dto";
import { userSignUp } from "../services/user.service";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import { listUserReviewsService } from "../services/user.service";
import { ApiResponse } from "../../../common/response/response";
import { success} from "../../../common/response/response";


@Route("users") //라우트경로
@Tags("users") //swagger태그
export class UserController extends Controller{
    @Post("signup") //엔드포인트 정의
    public async handleUserSignUp(
        @Body() body: UserSignUpRequest,
    ): Promise<ApiResponse<UserSignUpResponse>> {
        console.log("회원가입 요청");
        console.log("body:", body);
        const user = await userSignUp(body); //서비스로직;
        return success(user); //성공 응답 보내기
    }
    @Get("guest")
    public async handleGuestPage(): Promise<String> {
        return `
            <h1>게스트 페이지</h1>
            <p>이 페이지는 로그인이 필요 없습니다.</p>
            <ul>
                <li><a href="/api/v1/users/mypage">마이페이지 (로그인 필요)</a></li>
            </ul>
        `;
    }
    @Get("login")
    public async handleLoginPage(): Promise<String> {
        return "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>";
    }
    @Get("mypage")
    @Middlewares(authorizeUser())
    public async handleMypage(@Request() req: ExpressRequest): Promise<String> {
        return `
            <h1>마이페이지</h1>
            <p>환영합니다, ${req.cookies.username}님!</p>
            <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
        `;
    }
    @Get("set-login")
    public async handleSetLogin(@Request() req: ExpressRequest): Promise<String> {
        req.res!.cookie("username", "UMC10th", { maxAge: 3600000 });
        return '로그인 쿠키(username=UMC9th) 생성 완료! <a href="/api/v1/users/mypage">마이페이지로 이동</a>';
    }
    @Get("set-logout")
    public async handleSetLogout(
        @Request() req: ExpressRequest,
    ): Promise<String> {
        req.res!.clearCookie("username");
        return '로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>';
    }
    @Get("{userId}/reviews")
    public async handleListUserReviews(
        @Path() userId: number,    // 알아서 req.params.userId를 숫자로 빼옵니다!
        @Query() cursor?: number   // 알아서 req.query.cursor를 숫자로 빼옵니다!
    ): Promise<any> {
        console.log("===사용자의 리뷰 조회 요청===");
        console.log("요청 유저 번호:", userId);

        // 서비스 로직 호출 (이미 숫자로 바뀌어서 Number() 쓸 필요 없음!)
        const reviews = await listUserReviewsService(userId, cursor);

        // 성공 규격으로 감싸서 리턴! (과제 필수 사항)
        return success(reviews);
    }
}