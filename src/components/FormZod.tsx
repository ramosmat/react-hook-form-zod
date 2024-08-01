import React from 'react';
import { EyeIcon, EyeOffIcon, Loader } from 'lucide-react';
import { useHookFormMask } from 'use-mask-input';
import { FieldValues, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UserRegister } from '../schema';
import { userRegisterSchema } from '../schema';
import toast from 'react-hot-toast';

export default function FormZod() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister>({ resolver: zodResolver(userRegisterSchema) });

  const registerWithMask = useHookFormMask(register);

  function handlePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  async function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const zipcode = event.target.value;

    const response = await fetch(
      `https://brasilapi.com.br/api/cep/v2/${zipcode}`,
    );

    if (response.ok) {
      const data = await response.json();
      // setAddress({ city: json.city, street: json.street });
      setValue('address', data.street);
      setValue('city', data.city);
    }
  }

  async function onSubmit(data: FieldValues) {
    console.log('Form submitted');

    const response = await fetch(
      'https://apis.codante.io/api/register-user/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    );

    const resData = await response.json();

    if (!response.ok) {
      for (const field in resData.errors) {
        setError(field as keyof UserRegister, {
          type: 'manual',
          message: resData.errors[field],
        });
      }
      toast.error('Erro ao cadastrar usuário');
    } else {
      console.log(response);
      console.log(resData);

      toast.success('Usuário cadastrado com sucesso');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input type="text" id="name" {...register('name')} />
        {/* Sugestão de exibição de erro de validação */}
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="name" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input className="" type="email" id="email" {...register('email')} />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="email" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            {...register('password')}
          />
          <p className="text-xs text-red-400 mt-1">
            <ErrorMessage errors={errors} name="password" />
          </p>
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
            {...register('password_confirmation')}
          />
          <p className="text-xs text-red-400 mt-1">
            <ErrorMessage errors={errors} name="password_confirmation" />
          </p>

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
        <input
          type="text"
          id="phone"
          {...registerWithMask('phone', '(99) 99999-9999')}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="phone" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          {...registerWithMask('cpf', '999.999.999-99')}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="cpf" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          {...registerWithMask('zipcode', '99999-999', { onBlur: handleBlur })}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="zipcode" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          disabled
          {...register('address')}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          disabled
          {...register('city')}
        />
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          {...register('terms')}
        />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{' '}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="terms" />
        </p>
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
