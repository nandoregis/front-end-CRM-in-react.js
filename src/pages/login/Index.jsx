import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Validate from '../validate/Index';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {

    const { addToast } = useToast();
    const { login } = useAuth();
    
    const [btnClicked, setBtnClicked] = useState(false);
    const [email, setEmail] = useState();
    const [isLogin, setIsLogin] = useState(false);
    const [password, setPassword] = useState();
    const [rateLimit, setRateLimit] = useState();

    const baseUriApi = 'http://api-projects.localhost';
    
    const handleLogin = (e) => {
        e.preventDefault();
        setBtnClicked(true);

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const validate = new Validate();
        validate.validateEmail(email);
        validate.ValidatePassword(password);

        if(validate.hasErros()) {
            const errors = validate.getErrors();
            addToast('error', errors[0]);
            setBtnClicked(false);
            return;
        }

        axios.post(`${baseUriApi}/v1/auth`, {
            email: email,
            password : password
        })
        .then( data => {
            login(data.data.data.token)
            addToast('success', 'Login realizado com sucesso');
            setTimeout(() => {
                setBtnClicked(false);
                setIsLogin(true);
            }, 3000)

        }).catch(err => {
            
            setTimeout(() => {
                setBtnClicked(false);
            }, 3000)

            if(err.response.data.code === 429) setRateLimit(err.response.data.attempt_in);
            addToast('error',  typeof err.response.data.message == "string" ? err.response.data.message : "Não foi possível realizar o login.");

        })
    
    }
    
    return (
        <>
        {
            isLogin && <Navigate to="/dashboard" />
        }
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Entre em sua conta.</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

            <form method="POST" className="space-y-6">
                <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                    Endereço de email
                </label>
                <div className="mt-2">
                    <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                </div>
                </div>

                <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                    Senha
                    </label>
                    <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                        Esqueceu sua senha?
                    </a>
                    </div>
                </div>
                <div className="mt-2">
                    <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                </div>
                </div>

                <div>
                    {
                      
                        <button
                            onClick={handleLogin}
                            disabled={btnClicked}
                            type="submit"
                            className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                             {btnClicked ? (
                                <>
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                            
                            
                    }
                    
                </div>
            </form>

            
            </div>
        </div>
      
        </>
    )
}

export default Login;