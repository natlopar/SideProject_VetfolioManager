import { useNavigate } from 'react-router-dom';
import HeaderPages from './HeaderPages';
import { useForm } from 'react-hook-form';
import '../styles/signIn.scss';
import { useState } from 'react';
import Scroll from './Scroll';


function SignIn({ publicU, setPublicU, isDark, setIsDark, sendSignUpToApi , message, loginBtn, hiddenClass}) {

  const [registry, setRegistry] = useState({
    userName: "",
    nameVet: "",
    email: "",
    password: "",
    city: "",
    country: "",
    public: 0
  });




  const {
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const handleInput = (ev) => {
    ev.preventDefault();
    const { id, value, checked } = ev.target;
    if (id === 'public') {
      setPublicU(checked);
      setRegistry({ ...registry, [id]: checked ? 1 : 0 });
    } else {
      setRegistry({ ...registry, [id]: value });
    }
  };
 
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    sendSignUpToApi(registry);
  }
  //   fetch("http://localhost:4000/signin", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(registry),
  //   })

  //   .then((response) =>  response.json())
  //   .then((data)=>{
  //     if (data.success) {
  //       setMessage(
  //         "Registro realizado correctamente. Ahora puedes iniciar sesión con tu nombre de usuario y contraseña."
  //       );
  //      setLoginBtn(<LoginBtn />);
     
  //     } else {
  //       setMessage("No te puedes registrar. Revisa tus datos.");
        
  //     }
  //   })
   
  // };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() === '') {
      event.preventDefault();
    }
  };

  const handleCancel = (ev) => {
    ev.preventDefault();
    navigate("/");
  };


  return (
    <>
    <Scroll/>
      <HeaderPages isDark={isDark} setIsDark={setIsDark} />
      <div className="user">
        <h3 className="user__title">Regístrate</h3>
        <form className="user__form" onSubmit={handleSubmit}>
          <label htmlFor="userName" className="user__form--label">
            {' '}
            Nombre usuari@{' '}
          </label>
          <input
            type="text"
            className="user__form--input"
            id="userName"
            autoComplete='userName'
            required
            value={registry.userName}
            onInput={handleInput}
            {...register('userName', { required: true, maxLength: 20 })}
            aria-invalid={errors.userName ? 'true' : 'false'}
          ></input>
          {errors.userName?.type === 'required' && (
            <p role="alert" className="user__form--validation">
              Debes rellenar este campo
            </p>
          )}
           <label htmlFor="nameVet" className="user__form--label">
            {' '}
            Nombre{' '}
          </label>
          <input
            type="text"
            className="user__form--input"
            id="nameVet"
            autoComplete='nameVet'
            required
            value={registry.nameVet}
            onInput={handleInput}
            {...register('nameVet', { required: true, maxLength: 20 })}
            aria-invalid={errors.nameVet ? 'true' : 'false'}
          ></input>
          {errors.nameVet?.type === 'required' && (
            <p role="alert" className="user__form--validation">
              Debes rellenar este campo
            </p>
          )}
          <label htmlFor="email" className="user__form--label">
            {' '}
            Correo electrónico{' '}
          </label>
          <input
            type="email"
            required
            className="user__form--input"
            id="email"
          value={registry.email}
          onInput={handleInput}
            {...register('email', {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Email no válido',
              },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
          ></input>
          {errors.email && (
            <span className="user__form--validation">
              {errors.email.message}
            </span>
          )}
          {errors.email?.type === 'required' && (
            <p role="alert" className="user__form--validation">
              Debes rellenar este campo
            </p>
          )}

          <label htmlFor="password" className="user__form--label">
            {' '}
            Contraseña{' '}
          </label>
          <input
            type="password"
            required
            className="user__form--input"
            id="password"
            value={registry.password}
            onInput={handleInput}
            autoComplete='current-password'
            {...register('password', {
              required: true,
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres',
              },
            })}
            aria-invalid={errors.password ? 'true' : 'false'}
          ></input>
          {errors.password && (
            <span className="user__form--validation">
              {errors.password.message}
            </span>
          )}
          {errors.password?.type === 'required' && (
            <p role="alert" className="user__form--validation">
              Debes rellenar este campo
            </p>
          )}
          <label htmlFor="city" className="user__form--label">
            {' '}
            Provincia{' '}
          </label>
          <input
            type="text"
            required
            className="user__form--input"
            id="city"
            value={registry.city}
            onInput={handleInput}
            {...register('city', { required: true, maxLength: 50 })}
            aria-invalid={errors.city ? 'true' : 'false'}
          ></input>
          {errors.city?.type === 'required' && (
            <p role="alert" className="user__form--validation">
              Debes rellenar este campo
            </p>
          )}

          <label htmlFor="country" className="user__form--label">
            {' '}
            País{' '}
          </label>
          <input
            type="text"
            required
            className="user__form--input"
            id="country"
            value={registry.country}
            onInput={handleInput}
            {...register('country', { required: true, maxLength: 50 })}
            aria-invalid={errors.country ? 'true' : 'false'}
          ></input>
          {errors.country?.type === 'required' && (
            <p role="alert" className="user__form--validation">
              Debes rellenar este campo
            </p>
          )}
          <div className="user__form--check">
            <input 
            type="checkbox" 
            name="public" 
            id="public"
            checked= {publicU}
            onChange={handleInput}
            />

            

            <label className="user__form--label" htmlFor="public">
              Indica si quieres que tus casos sean públicos en esta web
            </label>
          </div>

          <p className="user__form--text">
            En caso de que no quieras publicar ahora todos tus casos, podrás
            publicar cada uno más adelante{' '}
          </p>

          <input
            type="submit"
            value="Aceptar"
            className="user__form--submit btn hover"
            onKeyDown={handleKeyDown}
          />
             <input
  className="user__form--submit btn hover" 
        type="button"
        value="Cancelar"
        onClick={handleCancel}
      />
         
        </form>
        <p className={`${hiddenClass} user__msg`}>{message}</p>
        <div>{loginBtn}</div>
      </div>
     
    </>
  );
}

export default SignIn;
