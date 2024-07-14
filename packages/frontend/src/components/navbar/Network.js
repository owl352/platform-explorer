'use client'
import { useState } from 'react'
import './Navbar.scss'

function Network() {
    const [activeNetwork, setActiveNetwork] = useState('testnet')
    return (
        <div className='network'>
            <p>Network:</p>
            <button>{activeNetwork}
                <svg className='arrow' width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L5 1L9 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    )
}

export default Network