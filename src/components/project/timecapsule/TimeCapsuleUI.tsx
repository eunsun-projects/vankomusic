'use client';

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
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';

const userUUID = uuidv4();

function TimeCapsuleUI() {
  const { focusedObject, timeCapsules, setFocusedObject, setTimeCapsules } = useTimeCapsuleStore(
    useShallow((state) => ({
      focusedObject: state.focusedObject,
      timeCapsules: state.timeCapsules,
      setFocusedObject: state.setFocusedObject,
      setTimeCapsules: state.setTimeCapsules,
    })),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<TimeCapsule>();

  const handleClickAdd = () => {
    setIsPasswordOpen(false);
    setIsModalOpen(false);
    setIsListOpen(false);
    setIsFormOpen((prev) => !prev);
  };

  const handleClickListOpen = () => {
    setIsPasswordOpen(false);
    setIsModalOpen(false);
    setIsFormOpen(false);
    setIsListOpen((prev) => !prev);
  };

  const handleClickList = (timeCapsule: TimeCapsule) => {
    const selectedTimeCapsule: FocusedObject = {
      object: timeCapsule.object as Mesh,
      timeCapsule,
    };
    setFocusedObject(selectedTimeCapsule);
    setIsPasswordOpen(true);
    setIsModalOpen(false);
    setIsFormOpen(false);
    setIsListOpen(false);
  };

  const onAddSubmit = (data: TimeCapsule) => {
    const newTimeCapsule: TimeCapsule = {
      userId: userUUID,
      title: data.title,
      description: data.description,
      password: data.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      position: [generateRandomPosition(), generateRandomPosition(), generateRandomPosition()],
      color: generateColor(),
      object: null,
    };
    setTimeCapsules(newTimeCapsule);
    setIsFormOpen(false);
    reset();
  };

  const onPasswordSubmit = (data: TimeCapsule) => {
    if (data.password === focusedObject?.timeCapsule?.password) {
      setIsPasswordOpen(false);
      setIsModalOpen(true);
      reset();
    } else {
      setError('password', { message: '비밀번호가 틀렸습니다.' });
    }
  };

  useEffect(() => {
    console.log(focusedObject);
    if (!focusedObject) {
      setIsFormOpen(false);
      setIsPasswordOpen(false);
      setIsModalOpen(false);
      return;
    }
    if (focusedObject?.timeCapsule) {
      setIsPasswordOpen(true);
    }
  }, [focusedObject]);

  return (
    <div className="fixed w-full h-full select-none z-50 pointer-events-none">
      <div className="absolute right-0 top-0 flex gap-2">
        <button
          type="button"
          className={cn(
            'bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90 opacity-0',
            {
              'opacity-100':
                timeCapsules.filter((timeCapsule) => timeCapsule.userId === userUUID).length > 0,
            },
          )}
          onClick={handleClickListOpen}
        >
          list
        </button>
        <button
          type="button"
          className="bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90"
          onClick={handleClickAdd}
        >
          ????
        </button>
      </div>
      {isListOpen && (
        <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
          <div className="flex justify-end">
            <IoClose
              className="cursor-pointer"
              onClick={() => {
                setIsListOpen(false);
                setFocusedObject(null);
              }}
            />
          </div>
          {timeCapsules
            .filter((timeCapsule) => timeCapsule.userId === userUUID)
            .map((timeCapsule) => (
              <div
                key={timeCapsule.createdAt}
                className="cursor-pointer"
                onClick={() => handleClickList(timeCapsule)}
              >
                <ul>
                  <li>
                    {'✔ '}
                    {timeCapsule.title}
                    {' - '}
                    {format(new Date(timeCapsule.createdAt), 'yyyy-MM-dd HH:mm:ss')}
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
      {isModalOpen && (
        <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 min-w-[300px] bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
          <div className="flex justify-end">
            <IoClose
              className="cursor-pointer"
              onClick={() => {
                setIsModalOpen(false);
                setFocusedObject(null);
              }}
            />
          </div>
          <p>{focusedObject?.timeCapsule?.title}</p>
          <p>{focusedObject?.timeCapsule?.description}</p>
        </div>
      )}
      {isPasswordOpen && !errors.password?.message && (
        <form
          onSubmit={handleSubmit(onPasswordSubmit)}
          className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90"
        >
          <div className="flex justify-end">
            <IoClose
              className="cursor-pointer"
              onClick={() => {
                setIsPasswordOpen(false);
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
      {isFormOpen && (
        <form
          onSubmit={handleSubmit(onAddSubmit)}
          className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90"
        >
          <div className="flex justify-end">
            <IoClose
              className="cursor-pointer"
              onClick={() => {
                setIsFormOpen(false);
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
          <button type="submit">보관</button>
        </form>
      )}
    </div>
  );
}

export default TimeCapsuleUI;
