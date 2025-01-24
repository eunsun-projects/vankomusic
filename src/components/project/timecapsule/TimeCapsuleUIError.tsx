'use client';

import { TimeCapsule } from '@/types/projects.type';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { TimeCapsuleUIState } from './TimeCapsuleUI';

interface TimeCapsuleUIErrorProps {
  setIsOpen: Dispatch<SetStateAction<TimeCapsuleUIState>>;
}

function TimeCapsuleUIError({ setIsOpen }: TimeCapsuleUIErrorProps) {
  const {
    clearErrors,
    formState: { errors },
  } = useFormContext<TimeCapsule>();

  const handleClose = () => {
    clearErrors('password');
    setIsOpen((prev) => ({
      ...prev,
      isPasswordOpen: true,
    }));
  };

  return (
    <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
      <div className="flex justify-end">
        <IoClose className="cursor-pointer" onClick={handleClose} />
      </div>
      <p>{errors.password?.message}</p>
    </div>
  );
}

export default TimeCapsuleUIError;
