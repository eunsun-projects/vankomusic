'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useDeleteTimeCapsulesMutation } from '@/hooks/mutations/timecapsules.mutation';
import { useTimeCapsuleStore } from '@/stores/zustand';
import { TimeCapsule } from '@/types/projects.type';
import { format } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { TimeCapsuleUIState } from './TimeCapsuleUI';

interface TimeCapsuleUIListProps {
  setIsOpen: Dispatch<SetStateAction<TimeCapsuleUIState>>;
}

function TimeCapsuleUIList({ setIsOpen }: TimeCapsuleUIListProps) {
  const { setValue } = useFormContext();
  const { timeCapsules, setFocusedObject } = useTimeCapsuleStore();
  const { user } = useAuth();
  const { mutateAsync: mutateDeleteTimeCapsule } = useDeleteTimeCapsulesMutation();

  const handleClickList = (timeCapsule: TimeCapsule) => () => {
    setFocusedObject({ timeCapsule });
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
    setFocusedObject({ timeCapsule });
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

  return (
    <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-1 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
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
          <div key={timeCapsule.created_at} className="cursor-pointer text-xs">
            <ul className="min-w-[375px]">
              <li className="flex gap-2 items-center justify-between">
                <span>{'✔ '}</span>
                <span className="w-28 truncate" onClick={handleClickList(timeCapsule)}>
                  {timeCapsule.title}
                </span>
                <span>{' - '}</span>
                <span className="w-44 text-xs">
                  {format(new Date(timeCapsule.created_at), 'yy-MM-dd HH:mm:ss')}
                </span>
                <span onClick={handleClickEdit(timeCapsule)}>수정</span>
                <span onClick={handleClickDelete(timeCapsule)}>삭제</span>
              </li>
            </ul>
          </div>
        ))}
    </div>
  );
}

export default TimeCapsuleUIList;
