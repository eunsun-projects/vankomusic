'use client';

import { useTimeCapsuleStore } from '@/stores/zustand';
import { TimeCapsule } from '@/types/projects.type';
import { Dispatch, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { TimeCapsuleUIState } from './TimeCapsuleUI';

interface TimeCapsuleUIPasswordFormProps {
  setIsOpen: Dispatch<SetStateAction<TimeCapsuleUIState>>;
}

function TimeCapsuleUIPasswordForm({ setIsOpen }: TimeCapsuleUIPasswordFormProps) {
  const { setFocusedObject, focusedObject } = useTimeCapsuleStore();
  const { register, handleSubmit, setError, reset } = useFormContext<TimeCapsule>();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const onPasswordSubmit = (data: TimeCapsule) => {
    if (data.password === focusedObject?.timeCapsule?.password) {
      setIsOpen((prev) => ({
        ...prev,
        isPasswordOpen: false,
        isModalOpen: true,
      }));
      reset();
    } else {
      setError('password', { message: '비밀번호가 틀렸습니다.' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onPasswordSubmit)}
      className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90"
    >
      <div className="flex justify-end">
        <IoClose
          className="cursor-pointer"
          onClick={() => {
            setIsOpen((prev) => ({
              ...prev,
              isPasswordOpen: false,
            }));
            setFocusedObject(null);
          }}
        />
      </div>
      <div className="w-full flex items-center">
        <input
          className="bg-neutral-700 text-neutral-200"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호"
          {...register('password')}
        />
        <div className="absolute right-3 cursor-pointer" onClick={togglePasswordVisibility}>
          {showPassword ? <FaEye className="text-xs" /> : <FaEyeSlash className="text-xs" />}
        </div>
      </div>
      <button type="submit">확인</button>
    </form>
  );
}

export default TimeCapsuleUIPasswordForm;
