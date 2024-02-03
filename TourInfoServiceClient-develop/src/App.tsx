import './App.css'
import {Login, Main, Manager, NotFound, Sidebar, UserSearch} from './pages'
import {Footer, Logo} from './components'
import {Route, Routes} from 'react-router-dom'
import {AuthRoute, BoardRoute, MyPageRoute, Oauth2Route} from './routers'
import {Signup} from './pages/Signup'
import {Find} from './pages/Find'

//FIXME - 윤서 -Main,Find,Signup pages index파일에 넣어주세요, footer은 공통으로 쓰는 컴포넌트라서 제거하셔도 됩니다
import {ManagerRoute} from './routers/ManagerRoute'

function App() {
    return (
        <div className="App">
            <Routes>
                <Route
                    element={
                        <>
                            <Logo />
                            <Footer />
                        </>
                    }>
                    <Route element={<Sidebar />}>
                        <Route path="/" element={<Main />} />
                        <Route element={<ManagerRoute />}>
                            <Route path="manager" element={<Manager />} />
                        </Route>
                        {/* 아직 작성x - 추후 수정 */}
                        <Route path="board/*" element={<BoardRoute />} />
                        <Route path="mypage/*" element={<MyPageRoute />} />
                        <Route path="search-user" element={<UserSearch />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    <Route element={<AuthRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/sign-up" element={<Signup />} />
                        <Route path="/find-userinfo" element={<Find />} />
                        <Route path="/oauth2" element={<Oauth2Route />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
