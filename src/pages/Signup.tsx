import {useState, useEffect} from 'react'
import { totalLogo, loader, loginBg } from '../assets'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { IoEye , IoEyeOffOutline  } from "react-icons/io5";

type FormInputs = {
    firstname: string
    lastname: string
    email: string
    password: string,
    cpassword: string
}

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormInputs>({
     defaultValues: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        cpassword: ""
    },
     mode: "onSubmit"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);

  const onSubmit = (data: FormInputs) => {
    setIsLoading(true);
    setTimeout(()=>{
      signupUser(data);
    },2000);
  };

  const signupUser = (data: FormInputs) => {
    axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password
      })
      .then(response => {
        if(response.status === 201 || response.status === 200)
            window.location.href = "/login";
      })
      .catch(error => {
        console.error('message: ',error);
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
    // <div className="flex min-h-full h-screen flex-col items-center justify-center px-6 py-12 lg:px-8 bg-gray-50">
    //     <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-2">
    //       <img
    //         alt="Your Company"
    //         src={logo1}
    //         className="mx-auto h-16 w-auto"
    //       />
    //       <h2 className=" text-center text-2xl font-[600] tracking-tight text-black">
    //         Crée ton compte maintenant
    //       </h2>
    //     </div>
    //     <div className='w-1/3 h-11/12 bg-white rounded-lg border border-gray-200 p-10 shadow-md'>
    //     <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
          // <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          //   <div>
          //     <label htmlFor="lastname" className="block text-sm/6 font-medium text-black">
          //       Nom
          //     </label>
          //     <div className="">
          //       <input
          //         id="lastname"
          //         type="text"
          //         {...register("lastname", { required: "Nom requis *" })}
          //         className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
          //       />
          //     </div>
          //      {errors.lastname && <p className='text-sm text-red-600'>{errors.lastname.message}</p>}
          //   </div>

          //    <div>
          //     <label htmlFor="firstname" className="block text-sm/6 font-medium text-black">
          //       Prénom
          //     </label>
          //     <div className="">
          //       <input
          //         id="firstname"
          //         type="text"
          //         {...register("firstname", { required: "Prénom requis *" })}
          //         className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
          //       />
          //     </div>
          //      {errors.firstname && <p className='text-sm text-red-600'>{errors.firstname.message}</p>}
          //   </div>

          //   <div>
          //     <label htmlFor="email" className="block text-sm/6 font-medium text-black">
          //       Adresse e-mail
          //     </label>
          //     <div className="">
          //       <input
          //         id="email"
          //         type="text"
          //         {...register("email", { required: "Email requis *",
          //            pattern: {
          //               value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
          //               message: "Veuillez entrer une adresse e-mail valide"
          //               }
          //          })}
          //         autoComplete="email"
          //         className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
          //       />
          //     </div>
          //      {errors.email && <p className='text-sm text-red-600'>{errors.email.message}</p>}
          //   </div>

          //   <div>
          //     <div className="flex items-center justify-between">
          //       <label htmlFor="password" className="block text-sm/6 font-medium text-black">
          //         Mot de passe
          //       </label>
          //     </div>
          //     <div className="block w-full flex rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6">
          //       <input
          //         id="password"
          //         type={isPasswordVisible ? "text" : "password"}
          //         autoComplete="current-password"
          //         {...register("password", { required: "Mot de passe requis *",
          //            pattern: {
          //               value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
          //               message: "Mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial"
          //               }
          //          })}
          //         className="outline-none w-full bg-transparent placeholder:text-gray-500"
          //       />
          //       {
          //           !isPasswordVisible ?
          //           <IoEyeOffOutline  className='text-gray-400 hover:cursor-pointer' size={20} onClick={()=>setIsPasswordVisible(!isPasswordVisible)}/>
          //           :
          //           <IoEye className='text-gray-400 hover:cursor-pointer' size={20} onClick={()=>setIsPasswordVisible(!isPasswordVisible)}/>
          //       }
          //     </div>
          //      {errors.password && <p className='text-sm text-red-600'>{errors.password.message}</p>}
          //   </div>

          //   <div>
          //     <div className="flex items-center justify-between">
          //       <label htmlFor="cpassword" className="block text-sm/6 font-medium text-black">
          //         Resaisir mot de passe
          //       </label>
          //     </div>
          //     <div className=" block w-full flex rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6">
          //       <input
          //         id="password"
          //         type={isCPasswordVisible ? "text" : "password"}
          //         {...register("cpassword", { required: "Confirmation mot de passe requis *",
          //               validate: (value) =>
          //                   value === watch("password") || "Le mot de passe et sa confirmation ne correspondent pas"
          //          })}
          //         className="outline-none w-full bg-transparent placeholder:text-gray-500"
          //       />
          //       {
          //           !isCPasswordVisible ?
          //           <IoEyeOffOutline  className='text-gray-400 hover:cursor-pointer' size={20} onClick={()=>setIsCPasswordVisible(!isCPasswordVisible)}/>
          //           :
          //           <IoEye className='text-gray-400 hover:cursor-pointer' size={20} onClick={()=>setIsCPasswordVisible(!isCPasswordVisible)}/>
          //       }
          //     </div>
          //      {errors.cpassword && <p className='text-sm text-red-600'>{errors.cpassword.message}</p>}
          //   </div>

          //   <div>
          //     <button
          //       type="submit"
          //       className={`flex w-full justify-center rounded-md bg-black px-3 py-2.5 text-sm/6 font-semibold text-white hover:opacity-70 ${isLoading ? "opacity-70 cursor-not-allowed" : ""} hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
          //       disabled={isLoading}
          //     >
          //       {isLoading ? "Chargement..." : "Creer mon compte"}
          //       {isLoading && <img src={loader} alt="Loading..." className="h-5 w-5 mx-4 animate-spin" />}
          //     </button>
          //   </div>
          // </form>

    //       <p className=" text-center text-sm/6 text-gray-600">
    //         J'ai un compte ?{' '}
    //         <a href="/login" className="font-semibold text-black hover:opacity-70">
    //          Se connecter à mon compte
    //         </a>
    //       </p>
    //     </div>
    //     </div>
    //   </div>
    <div className='flex min-h-full h-screen bg-[whitesmoke] justify-center items-center'>
      <div className='w-3/4 h-11/12 flex'>
        <div className='w-1/2 h-full bg-white flex justify-center items-center'>
          <div className='w-9/12 h-11/12'>
            <img src={totalLogo} alt='logo' className='w-20 h-15 mb-4'/>
            <h2 className='text-lg font-semibold mb-2'>Bienvenue sur la Platforme</h2>
            <p className='text-gray-500 text-sm mb-4'>Crée ton compte sur la plateforme dédiée au correcteur de responses des variantes.</p>
            
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label htmlFor="lastname" className="block text-sm/6 font-medium text-black">
                Nom
              </label>
              <div className="">
                <input
                  id="lastname"
                  type="text"
                  {...register("lastname", { required: "Nom requis *" })}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-black outline-2 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                />
              </div>
               {errors.lastname && <p className='text-sm text-red-600'>{errors.lastname.message}</p>}
            </div>

             <div>
              <label htmlFor="firstname" className="block text-sm/6 font-medium text-black">
                Prénom
              </label>
              <div className="">
                <input
                  id="firstname"
                  type="text"
                  {...register("firstname", { required: "Prénom requis *" })}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-black outline-2 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                />
              </div>
               {errors.firstname && <p className='text-sm text-red-600'>{errors.firstname.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-black">
                Adresse e-mail
              </label>
              <div className="">
                <span className='text-sm text-gray-400'>La forme de votre email doit être de type xxx@xxx.xxx</span>
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
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-black outline-2 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                />
              </div>
               {errors.email && <p className='text-sm text-red-600'>{errors.email.message}</p>}
            </div>
          
          <div className='w-full flex items-center justify-around'>
            <div className='m-1'>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-black">
                  Mot de passe
                </label>
              </div>
              <div className="block w-full flex rounded-md bg-white/5 px-3 py-2 text-base text-black outline-2 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6">
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

            <div className='m-1'>
              <div className="flex items-center justify-between">
                <label htmlFor="cpassword" className="block text-sm/6 font-medium text-black">
                  Resaisir mot de passe
                </label>
              </div>
              <div className=" block w-full flex rounded-md bg-white/5 px-3 py-2 text-base text-black outline-2 -outline-offset-1 outline-gray/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6">
                <input
                  id="password"
                  type={isCPasswordVisible ? "text" : "password"}
                  {...register("cpassword", { required: "Confirmation mot de passe requis *",
                        validate: (value) =>
                            value === watch("password") || "Le mot de passe et sa confirmation ne correspondent pas"
                   })}
                  className="outline-none w-full bg-transparent placeholder:text-gray-500"
                />
                {
                    !isCPasswordVisible ?
                    <IoEyeOffOutline  className='text-gray-400 hover:cursor-pointer' size={20} onClick={()=>setIsCPasswordVisible(!isCPasswordVisible)}/>
                    :
                    <IoEye className='text-gray-400 hover:cursor-pointer' size={20} onClick={()=>setIsCPasswordVisible(!isCPasswordVisible)}/>
                }
              </div>
               {errors.cpassword && <p className='text-xs text-red-600'>{errors.cpassword.message}</p>}
            </div>
          </div>

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-full bg-[#e20000] px-3 py-3 text-sm/6 font-semibold text-white hover:opacity-70 ${isLoading ? "opacity-70 cursor-not-allowed" : ""} hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Creer mon compte"}
                {isLoading && <img src={loader} alt="Loading..." className="h-5 w-5 mx-4 animate-spin" />}
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-sm/6 text-gray-600">
            J'ai déjà un compte ?{' '}
            <a href="/login" className="font-light underline text-[#285aff] hover:opacity-70">
             Se connecter à mon compte
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
