import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from './UserContext';

const GitHubIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 fill-current">
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

const FormInput: React.FC<{icon: React.ReactNode, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ icon, ...props }) => (
    <div className="relative flex items-center">
        <span className="absolute left-4 text-neutral-500">{icon}</span>
        <input
            {...props}
            required
            className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg py-3 pr-4 pl-12 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
        />
    </div>
);


const Auth: React.FC = () => {
    const { login, signUp, loginWithGitHub, loading } = useUser();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const { error } = isSignUp
            ? await signUp(email, password, username)
            : await login(email, password);

        if (error) {
            setMessage({ text: error.message, type: 'error' });
        } else if (isSignUp) {
            setMessage({ text: 'Success! Please check your email for a verification link.', type: 'success' });
        }
    };
    
    return (
        <div className="w-full max-w-4xl mx-auto flex rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10">
            {/* Left Panel */}
            <motion.div 
                className="w-1/2 bg-gradient-to-br from-[#2e1a47] via-[#241638] to-[#191027] p-8 text-white hidden md:flex flex-col justify-center items-start"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                    {isSignUp ? "JOIN THE FUTURE" : "WELCOME BACK!"}
                </h1>
                <p className="text-neutral-400">
                    {isSignUp 
                        ? "Create an account to unlock a world of premium digital assets and join a vibrant creator community."
                        : "Access your personalized dashboard, exclusive content, and continue your creative journey."
                    }
                </p>
                <div className="mt-8 w-full h-px bg-gradient-to-r from-violet-500 to-transparent"></div>
            </motion.div>

            {/* Right Panel */}
            <div className="w-full md:w-1/2 bg-[#14101D] p-8 sm:p-12 relative">
                 <motion.div
                    key={isSignUp ? 'signup' : 'login'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                 >
                    <h2 className="text-3xl font-bold text-center text-white mb-2">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                    <p className="text-center text-neutral-400 mb-8">
                       {isSignUp ? 'Get started with Pixer' : 'to continue to your account'}
                    </p>

                    {message && (
                        <div className={`text-center p-3 mb-4 rounded-md text-sm border ${
                            message.type === 'error'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        <AnimatePresence>
                        {isSignUp && (
                             <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
                                exit={{ opacity: 0, height: 0, y: -10, transition: { duration: 0.3, ease: 'easeIn' } }}
                             >
                                <FormInput icon={<UserIcon className="w-5 h-5"/>} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                             </motion.div>
                        )}
                        </AnimatePresence>
                        
                        <FormInput icon={<MailIcon className="w-5 h-5"/>} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <FormInput icon={<LockIcon className="w-5 h-5"/>} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                       
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50"
                            whileHover={{ scale: loading ? 1 : 1.02, filter: loading ? 'none' : 'brightness(1.15)' }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </motion.button>
                    </form>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-700" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#14101D] text-neutral-500">Or sign in with</span>
                      </div>
                    </div>

                    <div>
                        <motion.button 
                            onClick={loginWithGitHub}
                            disabled={loading}
                            className="w-full flex items-center justify-center py-2.5 px-4 bg-[#24292e] text-white font-medium rounded-lg shadow-md disabled:opacity-50 hover:bg-[#333] transition-colors"
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            <GitHubIcon />
                            GitHub
                        </motion.button>
                    </div>

                    <p className="mt-8 text-center text-sm text-neutral-500">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button onClick={() => {setIsSignUp(!isSignUp); setMessage(null)}} className="font-medium text-violet-400 hover:text-violet-300 ml-1">
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                 </motion.div>
            </div>
        </div>
    );
};

export default Auth;