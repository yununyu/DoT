import {FC} from 'react'
import {Route, Routes} from 'react-router-dom'
import {CourseRegister, DetailedCourse, NotFound, PostPlace, PostRegister} from '../pages'
import {PlaceSearch} from '../pages/placeSearch'
import {PlaceDetails} from '../pages/placeDetails'
import {CourseSearch} from '../pages/CourseSearch'

type BoardRouteProps = {}

export const BoardRoute: FC<BoardRouteProps> = ({}) => {
    return (
        <Routes>
            <Route path="/place">
                <Route index element={<PlaceSearch />} />
                <Route path=":pno" element={<PlaceDetails />} />
                <Route path="posting" element={<PostPlace title="" />} />
                <Route
                    path="posting/register"
                    element={<PostRegister isModify={false} />}
                />
                <Route path="posting/modify" element={<PostRegister isModify={true} />} />
                <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/course">
                <Route index element={<CourseSearch />} />
                <Route path="posting" element={<DetailedCourse title="test" />} />
                <Route
                    path="posting/register"
                    element={<CourseRegister isModify={false} />}
                />
                <Route
                    path="posting/modify"
                    element={<CourseRegister isModify={true} />}
                />
                <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
