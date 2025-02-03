import { useState } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import './Auth.css'

export default function Auth({ setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('')
    const [newUser, setNewUser] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Email and password cannot be empty.');
            return;
        }

        if (error != '') {
            return;
        }

        try {
            let userCredentials;
            if (newUser) {
                userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredentials.user, { displayName: name });
            } else {
                userCredentials = await signInWithEmailAndPassword(auth, email, password);
            }
            await updateDoc(doc(db, 'users','users'), {
                users: arrayUnion({
                    email: email,
                    name: name,
                })
            })
            setUser(userCredentials.user);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-content'>
                <h1>{newUser ? 'Sign Up' : 'Login'}</h1>
                <form className='auth-form' onSubmit={handleAuth}>
                    <div className='form-field'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="First and Last Name"
                        />
                    </div>

                    <div className='form-field'>
                        <label htmlFor="email-address">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email address"
                        />
                    </div>

                    <div className='form-field'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                if (e.target.value == checkPassword) {
                                    setError('')
                                }
                                setPassword(e.target.value)
                            }}
                            required
                            placeholder="Password"
                        />
                    </div>

                    {newUser && 
                        <div className='form-field'>
                            <label htmlFor="password">Re-enter Password</label>
                            <input
                                type="password"
                                onChange={(e) => {
                                    setCheckPassword(e.target.value)
                                    if (e.target.value != password) {
                                        setError('Passwords don\'t match')
                                    } else {
                                        setError('')
                                    }
                                }}
                                required
                                placeholder="Password"
                            />
                        </div>
                    }
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">
                        {newUser ? 'Sign up' : 'Login'}
                    </button>
                </form>

                <button id='toggle-signIn-createAcc' onClick={() => setNewUser(!newUser)}>
                    {newUser ? 'Already have an account?' : 'Create an account'}
                </button>
            </div>
        </div>
    );
}
