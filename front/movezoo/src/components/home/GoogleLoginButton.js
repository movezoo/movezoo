import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import './GoogleLogin.css'


const GoogleLoginButton = () => {
    // const clientId = '646007525436-ice4fd79vbt6e0vv0m80lkfihehsfpgn.apps.googleusercontent.com'; // Google Developers Console에서 발급받은 클라이언트 ID
    const navigate = useNavigate();


    return (
        <div>
            <a className="googlelogin" href="/oauth2/authorization/google">
                <img alt="Google로고" className="googleLogo"/>
                Google 계정으로 로그인</a>
        </div>

        // <div className="googlelogin">
        //     {/* GoogleOAuthProvider를 사용하여 OAuth Provider를 설정 */}
        //     <GoogleOAuthProvider clientId={clientId}>
        //         {/* GoogleLogin 컴포넌트를 통해 Google 로그인 버튼을 생성 */}
        //         <GoogleLogin
        //             onSuccess={(res) => {
        //                 // 로그인 성공 시의 동작을 
        //                 navigate('/main')
        //                 console.log(res);
        //             }}
        //             onFailure={(err) => {
        //                 // 로그인 실패 시의 동작을 정의
        //                 alert('로그인에 실패했습니다')
        //                 console.log(err);
        //             }}
        //         />
        //     </GoogleOAuthProvider>
        // </div>
    );
};

export default GoogleLoginButton;
