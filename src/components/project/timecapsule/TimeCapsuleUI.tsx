'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useTimeCapsuleStore } from '@/stores/zustand';
import { TimeCapsule } from '@/types/projects.type';
import cn from '@/utils/common/cn';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';
import TimeCapsuleUIError from './TimeCapsuleUIError';
import TimeCapsuleUIForm from './TimeCapsuleUIForm';
import TimeCapsuleUIList from './TimeCapsuleUIList';
import TimeCapsuleUIModal from './TimeCapsuleUIModal';
import TimeCapsuleUIPasswordForm from './TimeCapsuleUIPasswordForm';

export type TimeCapsuleUIState = {
  isFormOpen: boolean;
  isPasswordOpen: boolean;
  isModalOpen: boolean;
  isListOpen: boolean;
  isLogInOpen: boolean;
  isEditNow: boolean;
};

function TimeCapsuleUI() {
  const { focusedObject, timeCapsules, queryStringTimeCapsuleId, setFocusedObject } =
    useTimeCapsuleStore(
      useShallow((state) => ({
        focusedObject: state.focusedObject,
        timeCapsules: state.timeCapsules,
        queryStringTimeCapsuleId: state.queryStringTimeCapsuleId,
        setFocusedObject: state.setFocusedObject,
      })),
    );
  const { user, loginWithProvider, logOut } = useAuth();

  const [isOpen, setIsOpen] = useState<TimeCapsuleUIState>({
    isFormOpen: false,
    isPasswordOpen: false,
    isModalOpen: false,
    isListOpen: false,
    isLogInOpen: false,
    isEditNow: false,
  });

  const methods = useForm<TimeCapsule>();

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
    console.log('user ======>', user);
    // if (user && !queryStringTimeCapsuleId) {
    //   setIsOpen((prev) => ({
    //     ...prev,
    //     isLogInOpen: false,
    //     isFormOpen: prev.isPasswordOpen ? false : true,
    //   }));
    // }
  }, [user]);

  useEffect(() => {
    if (!timeCapsules || !queryStringTimeCapsuleId) return;
    const timeCapsule = timeCapsules.find(
      (timeCapsule) => timeCapsule.id === queryStringTimeCapsuleId,
    );
    if (timeCapsule) setFocusedObject({ timeCapsule });
  }, [queryStringTimeCapsuleId, setFocusedObject, timeCapsules]);

  return (
    <FormProvider {...methods}>
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
        {isOpen.isListOpen && <TimeCapsuleUIList setIsOpen={setIsOpen} />}
        {methods.formState.errors.password?.message && <TimeCapsuleUIError setIsOpen={setIsOpen} />}
        {isOpen.isModalOpen && <TimeCapsuleUIModal setIsOpen={setIsOpen} />}
        {isOpen.isLogInOpen && !methods.formState.errors.password?.message && !user && (
          <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 bg-neutral-800/50 text-neutral-200 border border-neutral-700 pointer-events-auto p-2 rounded-md hover:bg-neutral-800/70 active:bg-neutral-800/90">
            <button onClick={() => loginWithProvider('/timecapsule')}>구글로 로그인</button>
          </div>
        )}
        {isOpen.isPasswordOpen && !methods.formState.errors.password?.message && (
          <TimeCapsuleUIPasswordForm setIsOpen={setIsOpen} />
        )}
        {isOpen.isFormOpen && <TimeCapsuleUIForm isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </FormProvider>
  );
}

export default TimeCapsuleUI;
