import { z } from 'zod';
import { useState, useEffect, FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Button,
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Title,
  Text,
  SimpleGrid,
  Flex,
} from '@mantine/core';

import config from 'config';
import { RoutePath } from 'routes';
import { handleError } from 'utils';
import { Link } from 'components';

import { accountApi, accountConstants } from 'resources/account';

import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { useStyles } from './styles';

const schema = z.object({
  email: z
    .string()
    .regex(accountConstants.emailRegex, 'Email format is incorrect.'),
  password: z
    .string()
    .regex(
      accountConstants.passwordRegex,
      'The password must contain 8 or more characters with at least one lover case letter (a-z) and one number (0-9).',
    ),
});

type SignUpParams = z.infer<typeof schema>;

interface IRuleFormat {
  title: string,
  done: boolean,
}

const passwordRules: IRuleFormat[] = [
  {
    title: 'Must be at least 8 characters',
    done: false,
  },
  {
    title: 'Must contain at least 1 number',
    done: false,
  },
  {
    title: 'Must contain lover case and capital letters',
    done: false,
  },
];

const RulePoint: FC<{ ruleData: IRuleFormat }> = ({
  ruleData,
}) => (
  <Flex
    gap="md"
    justify="flex-start"
    align="center"
    direction="row"
    wrap="wrap"
    style={{ color: '#ababab' }}
  >
    {ruleData.done ? (
      <IconCircleCheck style={{ color: '#339af0' }} />
    ) : (
      <IconCircleX style={{ color: '#fa5252' }} />
    )}
    {ruleData.title}
  </Flex>
);

const SignUp: NextPage = () => {
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [signupToken, setSignupToken] = useState();

  const [passwordRulesData, setPasswordRulesData] = useState(passwordRules);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignUpParams>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    const updatedPasswordRulesData = [...passwordRules];

    updatedPasswordRulesData[0].done = passwordValue.length >= 8 && passwordValue.length <= 50;
    updatedPasswordRulesData[1].done = /\d/.test(passwordValue);
    updatedPasswordRulesData[2].done = /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue);

    setPasswordRulesData(updatedPasswordRulesData);
  }, [passwordValue]);

  const { mutate: signUp, isLoading: isSignUpLoading } = accountApi.useSignUp<SignUpParams>();

  const onSubmit = (data: SignUpParams) => signUp(data, {
    onSuccess: (response: any) => {
      if (response.signupToken) setSignupToken(response.signupToken);

      setRegistered(true);
      setEmail(data.email);
    },
    onError: (e) => handleError(e, setError),
  });

  const { classes } = useStyles();

  if (registered) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>
        <Stack sx={{ width: '450px' }}>
          <Title order={2}>Thanks!</Title>
          <Text size="md" sx={({ colors }) => ({ color: colors.gray[5] })}>
            Please follow the instructions from the email to complete a sign up
            process. We sent an email with a confirmation link to
            {' '}
            <b>{email}</b>
          </Text>
          {signupToken && (
            <div>
              You look like a cool developer.
              {' '}
              <Link
                size="sm"
                href={`${config.API_URL}/account/verify-email?token=${signupToken}`}
              >
                Verify email
              </Link>
            </div>
          )}
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack className={classes.wrapper}>
          <Title order={1} className={classes.title}>Sign Up</Title>
          <Stack spacing="1.25rem">
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
            <SimpleGrid cols={1} spacing=".5rem" p={5}>
              {passwordRulesData.map((ruleData) => (
                <RulePoint ruleData={ruleData} />
              ))}
            </SimpleGrid>
          </Stack>
          <Button type="submit" loading={isSignUpLoading} fullWidth>
            Create Account
          </Button>
          <Group className={classes.additionalOptions}>
            Have an account?
            <Link
              type="router"
              href={RoutePath.SignIn}
              inherit
              underline={false}
            >
              Sign In
            </Link>
          </Group>
        </Stack>
      </form>
    </>
  );
};

export default SignUp;
