import React, {useState} from 'react'
import {FindEmail, FindPassword} from '../../components'

interface FindProps {}

export const Find: React.FC<FindProps> = () => {
    const [activeTab, setActiveTab] = useState<'email' | 'password'>('email')

    function onTabChange(activeTab: 'email' | 'password') {
        setActiveTab(activeTab)
    }

    return (
        <div>
            <div className="flex justify-center">
                <div className="box-border items-center justify-center w-full mb-16">
                    <section className="flex justify-center my-16">
                        {/* Tab buttons */}
                        <div role="tablist" className="w-1/3 h-full tabs tabs-lifted">
                            <input
                                type="radio"
                                name="my_tabs_2"
                                role="tab"
                                className="tab"
                                aria-label="이메일 찾기"
                                checked={activeTab === 'email'}
                                onClick={() => onTabChange('email')}
                            />
                            <div
                                role="tabpanel"
                                className=" tab-content bg-base-100 border-base-300 rounded-box">
                                <FindEmail />
                            </div>

                            <input
                                type="radio"
                                name="my_tabs_2"
                                role="tab"
                                className="tab"
                                checked={activeTab === 'password'}
                                aria-label="비밀번호 찾기"
                                onClick={() => onTabChange('password')}
                            />
                            <div
                                role="tabpanel"
                                className=" tab-content bg-base-100 border-base-300 rounded-box">
                                <FindPassword />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
