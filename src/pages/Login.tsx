import {useState, useEffect} from 'react'
import { totalLogo, loader, loginBg } from '../assets'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { IoEye , IoEyeOffOutline  } from "react-icons/io5";

type FormInputs = {
  email: string
  password: string
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
     defaultValues: {
        email:"",
        password:""
    },
     mode: "onSubmit"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onSubmit = (data: FormInputs) => {
    setIsLoading(true);
    setTimeout(()=>{
      loginUser(data);
    },2000);
  };

  const loginUser = (data: FormInputs) => {
    axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: data.email,
        password: data.password
      })
      .then(response => {
        sessionStorage.setItem('loggedUser', JSON.stringify(response.data.data));
        setLoginError("");
        window.location.replace("/dashboard");
      })
      .catch(error => {
        setLoginError(error.response.data.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(()=>{
    const loggedUser = sessionStorage.getItem('loggedUser');
    if(loggedUser){
      window.location.replace("/dashboard");
    }
  },[])

  return (
    <div className='flex min-h-full h-screen bg-[whitesmoke] justify-center items-center'>
      <div className='w-3/4 h-11/12 flex'>
        <div className='w-1/2 h-full bg-white flex justify-center items-center'>
          <div className='w-9/12 h-11/12'>
            <img src={totalLogo} alt='logo' className='w-30 h-20 my-4 mb-8'/>
            <h2 className='text-lg font-semibold mb-2'>Bienvenue sur la Platforme</h2>
            <p className='text-gray-500 text-sm mb-4'>Connectez-vous à la plateforme dédiée au correcteur de responses des variantes.</p>
            {loginError && <p className='text-md text-red-600'>{loginError}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-black">
                Adresse e-mail
              </label>
              <span className='text-sm text-gray-400'>La forme de votre email doit être de type xxx@xxx.xxx</span>
              <div className="">
                <input
                  id="email"
                  type="text"
                  {...register("email", { required: "Email requis *",
                     pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                        message: "Veuillez entrer une adresse e-mail valide"
                        }
                   })}
                  autoComplete="email"
                  className="block w-full rounded-lg bg-white/5 px-3 py-2 text-base  text-black outline-[2px] -outline-offset-1 outline-gray-700 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                />
              </div>
               {errors.email && <p className='text-sm text-red-600'>{errors.email.message}</p>}
            </div>

            <div className='mb-8'>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-black">
                  Mot de passe
                </label>
              </div>
              <div className="mt-2 block w-full flex rounded-lg bg-white/5 px-3 py-2 text-base text-black outline-2 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6">
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", { required: "Mot de passe requis *",
                     pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                        message: "Mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial"
                        }
                   })}
                  className="outline-none w-full bg-transparent placeholder:text-gray-500"
                />
                {
                    !isPasswordVisible ?
                    <IoEyeOffOutline  className='text-gray-400 hover:cursor-pointer' size={20} onClick={()=>setIsPasswordVisible(!isPasswordVisible)}/>
                    :
                    <IoEye className='text-gray-400 hover:cursor-pointer' size={20} onClick={()=>setIsPasswordVisible(!isPasswordVisible)}/>
                }
              </div>
               {errors.password && <p className='text-sm text-red-600'>{errors.password.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-full bg-[#e20000] px-3 py-3 text-sm/6 font-light text-white hover:opacity-70 ${isLoading ? "opacity-70 cursor-not-allowed" : ""} hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Je me connecte à mon espace"}
                {isLoading && <img src={loader} alt="Loading..." className="h-5 w-5 mx-4 animate-spin" />}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm/6 text-gray-600">
            Je n'ai pas encore de compte ?{' '}
            <a href="/register" className="font-light underline text-[#285aff] hover:opacity-70">
             Créer un compte maintenant
            </a>
          </p>
          </div>
        </div>
        <div
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
          }}
         className='w-1/2 h-full text-white'></div>
      </div>
    </div>
  )
}
