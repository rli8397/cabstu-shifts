import { useState } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import './Auth.css'

export default function Auth({ setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newUser, setNewUser] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Email and password cannot be empty.');
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

            setUser(userCredentials.user);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='auth-container'>
            <h1>{newUser ? 'Sign Up' : 'Login'}</h1>
            <form className='auth-form' onSubmit={handleAuth}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="First and Last Name"
                    />
                </div>

                <div>
                    <label htmlFor="email-address">Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email address"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">
                    {newUser ? 'Sign up' : 'Login'}
                </button>
            </form>

            <button onClick={() => setNewUser(!newUser)}>
                {newUser ? 'Already have an account?' : 'Create an account'}
            </button>
        </div>
    );
}
