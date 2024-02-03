/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                lightGreen: '#8EB682', //로고 D,T 색
                darkGreen: '#609966' //로고 o색
            },
            keyframes: {
                slideDown: {
                    '0%': {maxHeight: '0px', opacity: '0'},
                    '100%': {maxHeight: '500px', opacity: '1'} // 적절한 최대 높이로 조정
                },
                slideUp: {
                    '0%': {height: '500px', maxHeight: '500px', opacity: '1'},
                    '100%': {height: '0', maxHeight: '0px', opacity: '0'}
                }
            },
            animation: {
                slideDown: 'slideDown 0.3s ease-out forwards',
                slideUp: 'slideUp 0.3s ease-in forwards'
            }
        }
    },
    plugins: [require('@tailwindcss/line-clamp'), require('daisyui')]
}
