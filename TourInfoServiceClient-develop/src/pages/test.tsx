import React from 'react'
import {useNavigate} from 'react-router-dom'

type testProps = {}

const test: React.FC<testProps> = ({}) => {
    const navigate = useNavigate()

    function onTest() {
        navigate('/mypage/test')
    }
    return <button onClick={onTest}>test Component</button>
}

export default test
