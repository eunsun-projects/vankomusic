'use client';

import useAuth from '@/hooks/auth/auth.hook';
import {
  useDeleteTimeCapsulesMutation,
  useEditTimeCapsulesMutation,
  useTimeCapsulesMutation,
} from '@/hooks/mutations/timecapsules.mutation';
import { useTimeCapsuleStore } from '@/stores/zustand';
import { FocusedObject, TimeCapsule } from '@/types/projects.type';
import cn from '@/utils/common/cn';
import { generateColor } from '@/utils/projects/timecapsule/generateColor';
import { generateRandomPosition } from '@/utils/projects/timecapsule/generatePosition';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { Mesh } from 'three';
import { useShallow } from 'zustand/react/shallow';

type OpenState = {
  isFormOpen: boolean;
  isPasswordOpen: boolean;
  isModalOpen: boolean;
  isListOpen: boolean;
  isLogInOpen: boolean;
  isEditNow: boolean;
};

function TimeCapsuleUI() {
  const { focusedObject, timeCapsules, setFocusedObject, addTimeCapsule } = useTimeCapsuleStore(
    useShallow((state) => ({
      focusedObject: state.focusedObject,
      timeCapsules: state.timeCapsules,
      setFocusedObject: state.setFocusedObject,
      addTimeCapsule: state.addTimeCapsule,
    })),
  );
  const { user, loginWithProvider, logOut } = useAuth();
  const { mutateAsync: mutateAddTimeCapsule } = useTimeCapsulesMutation();
  const { mutateAsync: mutateEditTimeCapsule } = useEditTimeCapsulesMutation();
  const { mutateAsync: mutateDeleteTimeCapsule } = useDeleteTimeCapsulesMutation();
  const [isOpen, setIsOpen] = useState<OpenState>({
    isFormOpen: false,
    isPasswordOpen: false,
    isModalOpen: false,
    isListOpen: false,
    isLogInOpen: false,
    isEditNow: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm<TimeCapsule>();

  const handleClickLogInOrFormOpen = () => {
    if (user) {
      setIsOpen((prev) => ({
        ...prev,
        isFormOpen: !prev.isFormOpen,
      }));
      return;
    }
    setIsOpen((prev) => ({
      ...prev,
      isLogInOpen: !prev.isLogInOpen,
    }));
  };

  const handleClickListOpen = () => {
    setIsOpen((prev) => ({
      ...prev,
      isListOpen: !prev.isListOpen,
    }));
  };

  const handleClickList = (timeCapsule: TimeCapsule) => () => {
    const selectedTimeCapsule: FocusedObject = {
      object: timeCapsule.object as Mesh,
      timeCapsule,
    };
    setFocusedObject(selectedTimeCapsule);
    setIsOpen((prev) => ({
      ...prev,
      isPasswordOpen: true,
      isModalOpen: false,
      isFormOpen: false,
      isListOpen: false,
    }));
  };

  const handleClickEdit = (timeCapsule: TimeCapsule) => () => {
    setIsOpen((prev) => ({
      ...prev,
      isPasswordOpen: false,
      isModalOpen: false,
      isListOpen: false,
      isFormOpen: true,
      isEditNow: true,
    }));
    setFocusedObject({
      object: timeCapsule.object as Mesh,
      timeCapsule,
    });
    setValue('title', timeCapsule.title);
    setValue('description', timeCapsule.description);
    setValue('password', timeCapsule.password);
  };

  const handleClickDelete = (timeCapsule: TimeCapsule) => () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const payload = {
        id: timeCapsule.id,
      };
      mutateDeleteTimeCapsule(payload);
    }
  };

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
    if (timeCapsule) {
      setFocusedObject({
        object: timeCapsule.object as Mesh,
        timeCapsule,
      });
    }
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

  useEffect(() => {
    console.log(focusedObject);
    if (!focusedObject) {
      setIsOpen((prev) => ({
        ...prev,
        isFormOpen: false,
        isPasswordOpen: false,
        isModalOpen: false,
      }));
      return;
    }
    if (focusedObject?.timeCapsule) {
      setIsOpen((prev) => ({
        ...prev,
        isPasswordOpen: prev.isFormOpen ? false : true,
      }));
    }
  }, [focusedObject]);

  useEffect(() => {
    // console.log('user ======>', user);
    if (user) {
      setIsOpen((prev) => ({
        ...prev,
        isLogInOpen: false,
        isFormOpen: true,
      }));
    }
  }, [user]);

  return (
    <div className="fixed w-full h-full select-none z-50 pointer-events-none">
      <div className="absolute right-0 top-0 flex gap-2">
        <button
          type="button"
          className={cn(
            'bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90 opacity-0',
            {
              'opacity-100':
                timeCapsules.filter((timeCapsule) => timeCapsule.user_email === user?.email)
                  .length > 0,
            },
          )}
          onClick={handleClickListOpen}
        >
          list
        </button>
        <button
          type="button"
          className="bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90"
          onClick={handleClickLogInOrFormOpen}
        >
          ????
        </button>
        {user && (
          <button
            className="bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90"
            onClick={logOut}
          >
            Sign Out
          </button>
        )}
      </div>
      {isOpen.isListOpen && (
        <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
          <div className="flex justify-end">
            <IoClose
              className="cursor-pointer"
              onClick={() => {
                setIsOpen((prev) => ({
                  ...prev,
                  isListOpen: false,
                }));
                setFocusedObject(null);
              }}
            />
          </div>
          {timeCapsules
            .filter((timeCapsule) => timeCapsule.user_email === user?.email)
            .map((timeCapsule) => (
              <div key={timeCapsule.created_at} className="cursor-pointer">
                <ul className="min-w-[375px]">
                  <li className="flex gap-2 items-center justify-between">
                    <span>{'✔ '}</span>
                    <span className="max-w-[80px] truncate" onClick={handleClickList(timeCapsule)}>
                      {timeCapsule.title}
                    </span>
                    <span>{' - '}</span>
                    <span className="text-xs">
                      {format(new Date(timeCapsule.created_at), 'yy-MM-dd HH:mm:ss')}
                    </span>
                    <span onClick={handleClickEdit(timeCapsule)}>수정</span>
                    <span onClick={handleClickDelete(timeCapsule)}>삭제</span>
                  </li>
                </ul>
              </div>
            ))}
        </div>
      )}
      {errors.password?.message && (
        <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
          <div className="flex justify-end">
            <IoClose
              className="cursor-pointer"
              onClick={() => {
                setError('password', { message: '' });
                setFocusedObject(null);
              }}
            />
          </div>
          <p>{errors.password.message}</p>
        </div>
      )}
      {isOpen.isModalOpen && (
        <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 min-w-[300px] bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
          <div className="flex justify-end">
            <IoClose
              className="cursor-pointer"
              onClick={() => {
                setIsOpen((prev) => ({
                  ...prev,
                  isModalOpen: false,
                }));
                setFocusedObject(null);
              }}
            />
          </div>
          <p>{focusedObject?.timeCapsule?.title}</p>
          <p>{focusedObject?.timeCapsule?.description}</p>
        </div>
      )}
      {isOpen.isLogInOpen && !errors.password?.message && !user && (
        <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
          <button onClick={() => loginWithProvider('/timecapsule')}>구글로 로그인</button>
        </div>
      )}
      {isOpen.isPasswordOpen && !errors.password?.message && (
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
          <input
            className="bg-neutral-700 text-neutral-200"
            type="password"
            placeholder="비밀번호"
            {...register('password')}
          />
          <button type="submit">확인</button>
        </form>
      )}
      {isOpen.isFormOpen && (
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
      )}
    </div>
  );
}

export default TimeCapsuleUI;
