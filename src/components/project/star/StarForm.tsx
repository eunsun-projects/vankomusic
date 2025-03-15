'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  sowon: z.string().min(2, { message: '소원은 2글자 이상 입력해주세요.' }).max(50, {
    message: '소원은 50글자 이하로 입력해주세요.',
  }),
});

type StarFormProps = {
  button: string;
};

function StarForm({ button }: StarFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sowon: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

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
        <Button type="submit" variant="secondary">
          {button}
        </Button>
      </form>
    </Form>
  );
}

export default StarForm;
