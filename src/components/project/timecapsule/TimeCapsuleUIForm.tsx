'use client';

import useAuth from '@/hooks/auth/auth.hook';
import {
  useEditTimeCapsulesMutation,
  useTimeCapsulesMutation,
} from '@/hooks/mutations/timecapsules.mutation';
import { useTimeCapsuleStore } from '@/stores/zustand';
import { TimeCapsule } from '@/types/projects.type';
import { generateColor } from '@/utils/projects/timecapsule/generateColor';
import { generateRandomPosition } from '@/utils/projects/timecapsule/generatePosition';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';
import { TimeCapsuleUIState } from './TimeCapsuleUI';

interface TimeCapsuleUIFormProps {
  isOpen: TimeCapsuleUIState;
  setIsOpen: Dispatch<SetStateAction<TimeCapsuleUIState>>;
}

function TimeCapsuleUIForm({ isOpen, setIsOpen }: TimeCapsuleUIFormProps) {
  const { setFocusedObject, addTimeCapsule, timeCapsules, focusedObject } = useTimeCapsuleStore(
    useShallow((state) => ({
      setFocusedObject: state.setFocusedObject,
      addTimeCapsule: state.addTimeCapsule,
      timeCapsules: state.timeCapsules,
      focusedObject: state.focusedObject,
    })),
  );
  const { register, handleSubmit, reset } = useFormContext<TimeCapsule>();
  const { user } = useAuth();
  const { mutateAsync: mutateAddTimeCapsule } = useTimeCapsulesMutation();
  const { mutateAsync: mutateEditTimeCapsule } = useEditTimeCapsulesMutation();

  const onSubmit = async (data: TimeCapsule) => {
    if (!user) return;
    const timeCapsulePayload: Partial<TimeCapsule> = {
      user_email: user.email,
      title: data.title,
      description: data.description,
      password: data.password,
      position: [generateRandomPosition(), generateRandomPosition(), generateRandomPosition()],
      color: generateColor(),
    };
    let response: TimeCapsule;
    if (isOpen.isEditNow) {
      timeCapsulePayload.id = focusedObject?.timeCapsule?.id;
      response = await mutateEditTimeCapsule(timeCapsulePayload);
    } else {
      response = await mutateAddTimeCapsule(timeCapsulePayload);
    }
    addTimeCapsule(response);
    const timeCapsule = timeCapsules.find((timeCapsule) => timeCapsule.id === response.id);
    if (timeCapsule) setFocusedObject({ timeCapsule });
    reset();
    setIsOpen((prev) => ({
      ...prev,
      isFormOpen: false,
      isEditNow: false,
      isPasswordOpen: true,
      isModalOpen: false,
      isListOpen: false,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90"
    >
      <div className="flex justify-end">
        <IoClose
          className="cursor-pointer"
          onClick={() => {
            setIsOpen((prev) => ({
              ...prev,
              isFormOpen: false,
            }));
            setFocusedObject(null);
          }}
        />
      </div>
      <input
        className="bg-neutral-700 text-neutral-200"
        type="text"
        placeholder="제목"
        {...register('title')}
      />
      <textarea
        className="bg-neutral-700 text-neutral-200"
        placeholder="내용"
        {...register('description')}
      />
      <input
        className="bg-neutral-700 text-neutral-200"
        type="password"
        placeholder="비밀번호"
        {...register('password')}
      />
      <button type="submit">{isOpen.isEditNow ? '수정' : '보관'}</button>
    </form>
  );
}

export default TimeCapsuleUIForm;
