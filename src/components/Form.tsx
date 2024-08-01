import React from 'react';
import { EyeIcon, EyeOffIcon, Loader } from 'lucide-react';
import { withMask } from 'use-mask-input';
import { useForm } from 'react-hook-form';

export default function Form() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [adress, setAddress] = React.useState({ city: '', street: '' });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm();

  function handlePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  async function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const zipcode = event.target.value;

    const response = await fetch(
      `https://brasilapi.com.br/api/cep/v2/${zipcode}`,
    );

    if (response.ok) {
      const json = await response.json();
      setAddress({ city: json.city, street: json.street });
    }
  }

  async function onSubmit(data: any) {
    console.log('Form submitted');
    console.log(data);

    const response = await fetch(
      'https://apis.codante.io/api/register-user/register',
      { method: 'POST', body: JSON.stringify(data) },
    );
    const json = await response.json();

    console.log(response);
    console.log(json);

    // if (response.ok) {
    // }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input type="text" id="name" {...register('name')} />
        {/* Sugestão de exibição de erro de validação */}
        <div className="min-h-4">
          <p className="text-xs text-red-400 mt-1">O nome é obrigatório.</p>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input className="" type="email" id="email" {...register('email')} />
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            {...register('password')}
          />
          <span className="absolute right-3 top-3">
            <button type="button" onClick={handlePasswordVisibility}>
              {passwordVisible ? (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              ) : (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              )}
            </button>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="confirm-password"
          />
          <span className="absolute right-3 top-3">
            <button type="button" onClick={handlePasswordVisibility}>
              {passwordVisible ? (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              ) : (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              )}
            </button>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <input type="text" id="phone" ref={withMask('(99) 99999-9999')} />
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" ref={withMask('999.999.999-99')} />
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          ref={withMask('99999-999')}
          onBlur={handleBlur}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          value={adress.street}
          disabled
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          value={adress.city}
          disabled
        />
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input type="checkbox" id="terms" className="mr-2 accent-slate-500" />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{' '}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-300 flex items-center justify-center"
      >
        {isSubmitting ? <Loader className="animate-spin" /> : 'Cadastrar'}
      </button>
    </form>
  );
}
