import './SearchResults.css'
import { useState } from 'react'
export default function SearchResults ({ onChange, results }) {
    return (
        <div className='results-container'>
            {results.map((user)=> {
                return (
                    <div onClick={()=>{ onChange(user.email, user.name) }} className='user-result'>
                        <p className='user-name'>{user.name}</p>
                        <p className='user-email'>{user.email}</p>
                    </div>
                )
            })}
        </div>
    )
}