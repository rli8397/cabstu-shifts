import './SearchUser.css'
import SearchResults from './SearchResults/SearchResults'
import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
export default function SearchUser ({ onChange }) {
    const [input, setInput] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const getAllUsers = async() => {
        const docRef = await getDoc(doc(db, 'users', 'users'))
        const data = await docRef.data()
        const users = data.users.filter((user)=> { return user.name.slice(0, input.length).toLowerCase() === input.toLowerCase() || user.email.slice(0, input.length) === input })
        setSearchResults(users)
    }

    useEffect (()=> {
        getAllUsers()
    },[input])

    useEffect(()=> {
        onChange(email, name)
    },[email,name])
    return ( 
        <div className='search-user-container'>
            <input
                id='user-search-input' 
                type="text"
                placeholder={'Search for users'} 
                autoComplete='off'
                onChange={(e)=>{ setInput(e.target.value) }}
                onFocus={()=> {setShowResults(true)}}
                onBlur={()=> {
                    setTimeout(() => {
                        setShowResults(false);
                    }, 200);
                }}
            />
            <div className='search-results'>
                {showResults && <SearchResults onChange={(email, name)=> {
                    document.getElementById('user-search-input').value = name;
                    setName(name)
                    setEmail(email)
                    setShowResults(false)
                }} results={searchResults}/>}
            </div>
        </div>
    )
}