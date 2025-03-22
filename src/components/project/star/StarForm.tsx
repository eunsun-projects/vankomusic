'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import useAuth from '@/hooks/auth/auth.hook';
import { useStarsMutation } from '@/hooks/mutations/stars.mutation';
import { useStarStore } from '@/stores/zustand';
import { generateColor } from '@/utils/projects/timecapsule/generateColor';
import { generateRandomPosition } from '@/utils/projects/timecapsule/generatePosition';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

const sowonSchema = z.object({
  sowon: z.string().min(2, { message: '소원은 2글자 이상 입력해주세요.' }).max(50, {
    message: '소원은 50글자 이하로 입력해주세요.',
  }),
});

const starSchema = z.object({
  sowon: sowonSchema,
  user_email: z.string().email(),
  power: z.number(),
  last_touched_at: z.string().datetime(),
  color: z.string(),
  positions: z.array(z.number()).length(3),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  id: z.string().optional(),
});

type StarFormProps = {
  button: string;
};

function StarForm({ button }: StarFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: postStar, isPending: isPostStarPending, error, isSuccess } = useStarsMutation();

  const { funnel, setFunnel } = useStarStore(
    useShallow((state) => ({
      funnel: state.funnel,
      setFunnel: state.setFunnel,
    })),
  );

  const form = useForm<z.infer<typeof sowonSchema>>({
    resolver: zodResolver(sowonSchema),
    defaultValues: {
      sowon: '',
    },
  });

  function onSubmit(values: z.infer<typeof sowonSchema>) {
    if (!user) return;

    const star = {
      id: crypto.randomUUID(),
      sowon: values.sowon,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_email: user.email,
      power: 7,
      color: generateColor(),
      positions: [generateRandomPosition(), generateRandomPosition(), generateRandomPosition()],
      last_touched_at: new Date().toISOString(),
    };

    postStar(star);
  }

  useEffect(() => {
    console.log('user 로그인되었나? ====>', user);
    // if (!user) router.push('/star?funnel=0');
  }, [user]);

  useEffect(() => {
    if (error) {
      console.error('Failed to create star:', error);
      router.push('/star?funnel=0');
    }
  }, [error, router]);

  useEffect(() => {
    if (isSuccess) {
      setFunnel(funnel + 1);
    }
  }, [isSuccess, setFunnel, funnel]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full h-full flex flex-col justify-center items-center"
      >
        <FormField
          control={form.control}
          name="sowon"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="소원을 입력해주세요"
                  {...field}
                  className="w-[280px] min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" disabled={isPostStarPending}>
          {isPostStarPending ? '생성 중...' : button}
        </Button>
      </form>
    </Form>
  );
}

export default StarForm;
