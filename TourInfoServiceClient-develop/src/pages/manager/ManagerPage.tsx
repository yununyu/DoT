import {Box, FindBox, ReportBox, Title, WaitBox} from '../../components/index'

//관리자 페이지

export const Manager = () => {
    return (
        <Box>
            <Title className="mb-5 text-darkGreen">관리자 페이지</Title>
            <FindBox />
            <WaitBox />
            <ReportBox />
        </Box>
    )
}
