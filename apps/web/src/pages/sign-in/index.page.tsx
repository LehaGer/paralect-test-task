import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { TextInput, PasswordInput, Button, Group, Stack, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { RoutePath } from 'routes';
import { handleError } from 'utils';
import { Link } from 'components';
import { accountApi, accountConstants } from 'resources/account';
import { useStyles } from './styles';

const schema = z.object({
  email: z.string().regex(accountConstants.emailRegex, 'Email format is incorrect.'),
  password: z.string().min(1, 'Please enter password'),
});

type SignInParams = z.infer<typeof schema> & { credentials?: string };

const SignIn: NextPage = () => {
  const {
    register, handleSubmit, formState: { errors }, setError,
  } = useForm<SignInParams>({ resolver: zodResolver(schema) });

  const { mutate: signIn, isLoading: isSignInLoading } = accountApi.useSignIn<SignInParams>();

  const onSubmit = (data: SignInParams) => signIn(data, {
    onError: (e) => handleError(e, setError),
  });

  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack className={classes.wrapper}>
          <Title order={1} className={classes.title}>Sign In</Title>
          <Stack spacing="1.25rem" sx={{ width: 'inherit' }}>
            <TextInput
              {...register('email')}
              label="Email Address"
              placeholder="Email Address"
              error={errors.email?.message}
            />
            <PasswordInput
              {...register('password')}
              label="Password"
              placeholder="Enter password"
              error={errors.password?.message}
            />
            {errors!.credentials && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {errors.credentials.message}
            </Alert>
            )}
          </Stack>
          <Button
            loading={isSignInLoading}
            type="submit"
            fullWidth
          >
            Sign in
          </Button>
          <Group className={classes.additionalOptions}>
            Don’t have an account?
            <Link
              type="router"
              href={RoutePath.SignUp}
              underline={false}
              inherit
            >
              Sign up
            </Link>
          </Group>
        </Stack>
      </form>
    </>
  );
};

export default SignIn;
