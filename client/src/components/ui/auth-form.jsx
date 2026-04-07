import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Separator } from './separator'
import { Checkbox } from './checkbox'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

// ─── View constants ───────────────────────────────────────
const AuthView = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_SUCCESS: 'reset-success',
}

// ─── Zod schemas ──────────────────────────────────────────
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.boolean().refine((v) => v === true, {
    message: 'You must agree to the terms',
  }),
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// ─── Slide animation ──────────────────────────────────────
const slideVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
}
const slideTransition = { duration: 0.28, ease: 'easeInOut' }

// ─── Shared: AuthError ────────────────────────────────────
function AuthError({ message }) {
  if (!message) return null
  return (
    <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
      {message}
    </div>
  )
}

// ─── Shared: Google OAuth button ──────────────────────────
function AuthSocialButtons({ isLoading }) {
  return (
    <div className="w-full mt-5">
      <button
        type="button"
        disabled={isLoading}
        className={cn(
          'w-full h-10 flex items-center justify-center gap-2 rounded-md',
          'border border-[#2a2a2a] bg-[#111] text-sm text-[#ccc]',
          'hover:bg-[#181818] transition-colors duration-150',
          'disabled:opacity-50 disabled:pointer-events-none',
        )}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>
    </div>
  )
}

// ─── Shared: Divider ──────────────────────────────────────
function AuthDivider({ text = 'Or continue with' }) {
  return (
    <div className="relative mt-5">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-[#111] px-3 text-[#555] tracking-wider">{text}</span>
      </div>
    </div>
  )
}

// ─── Password toggle input ────────────────────────────────
function PasswordInput({ showPassword, onToggle, disabled, error, registration }) {
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        disabled={disabled}
        className={cn(error && 'border-red-500/70 focus-visible:ring-red-500')}
        {...registration}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors p-1"
        onClick={onToggle}
        disabled={disabled}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

// ─── Sign In ──────────────────────────────────────────────
function AuthSignIn({ onForgotPassword, onSignUp }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [showPassword, setShowPassword] = React.useState(false)

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/auth/login', { 
        email: data.email, 
        password: data.password 
      })

      localStorage.setItem('token', response.data.token)

      navigate('/home');

      console.log('Logged in successfully as:', response.data.user.username)
      
    } catch (err){
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={slideTransition}
      className="p-8"
    >
      {/* Header */}
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-semibold text-[#f0f0f0]">Welcome back</h1>
        <p className="mt-1.5 text-sm text-[#666]">Sign in to your DevConnect account</p>
      </div>

      <AuthError message={error} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            type="email"
            placeholder="you@example.com"
            disabled={isLoading}
            className={cn(errors.email && 'border-red-500/70')}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password">Password</Label>
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={isLoading}
              className="text-xs text-[#555] hover:text-[#f5a623] transition-colors duration-150"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            showPassword={showPassword}
            onToggle={() => setShowPassword((p) => !p)}
            disabled={isLoading}
            error={errors.password}
            registration={register('password')}
          />
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full h-10 rounded-md text-sm font-semibold',
            'bg-[#f5a623] text-black hover:bg-[#e09620]',
            'transition-colors duration-150',
            'disabled:opacity-50 disabled:pointer-events-none',
            'flex items-center justify-center gap-2',
          )}
        >
          {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>) : 'Sign in'}
        </button>
      </form>

      <AuthDivider />
      <AuthSocialButtons isLoading={isLoading} />

      <p className="mt-6 text-center text-sm text-[#555]">
        No account?{' '}
        <button
          type="button"
          onClick={onSignUp}
          disabled={isLoading}
          className="text-[#f5a623] hover:underline underline-offset-4 transition-colors disabled:opacity-50"
        >
          Create one
        </button>
      </p>
    </motion.div>
  )
}

// ─── Sign Up ──────────────────────────────────────────────
function AuthSignUp({ onSignIn }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [showPassword, setShowPassword] = React.useState(false)

  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', terms: false },
  })

  const termsChecked = watch('terms')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/auth/register', { 
        username: data.name, 
        email: data.email, 
        password: data.password 
      })
      console.log('Registration successful!', response.data)
      
      localStorage.setItem('token', response.data.token)
      
      navigate('/home');
    } catch (err){
      setError(err.response?.data?.message || 'Failed to create account.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={slideTransition}
      className="p-8"
    >
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-semibold text-[#f0f0f0]">Create account</h1>
        <p className="mt-1.5 text-sm text-[#666]">Start building your developer identity</p>
      </div>

      <AuthError message={error} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-name">Full name</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Alex Johnson"
            disabled={isLoading}
            className={cn(errors.name && 'border-red-500/70')}
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            disabled={isLoading}
            className={cn(errors.email && 'border-red-500/70')}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput
            showPassword={showPassword}
            onToggle={() => setShowPassword((p) => !p)}
            disabled={isLoading}
            error={errors.password}
            registration={register('password')}
          />
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox
            id="signup-terms"
            checked={termsChecked}
            onCheckedChange={(checked) => setValue('terms', checked === true, { shouldValidate: true })}
            disabled={isLoading}
            className="mt-0.5"
          />
          <div>
            <Label htmlFor="signup-terms" className="text-sm cursor-pointer">
              I agree to the{' '}
              <a href="#" className="text-[#f5a623] hover:underline">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-[#f5a623] hover:underline">Privacy Policy</a>
            </Label>
          </div>
        </div>
        {errors.terms && <p className="text-xs text-red-400 -mt-2">{errors.terms.message}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full h-10 rounded-md text-sm font-semibold',
            'bg-[#f5a623] text-black hover:bg-[#e09620]',
            'transition-colors duration-150',
            'disabled:opacity-50 disabled:pointer-events-none',
            'flex items-center justify-center gap-2',
          )}
        >
          {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>) : 'Create account'}
        </button>
      </form>

      <AuthDivider />
      <AuthSocialButtons isLoading={isLoading} />

      <p className="mt-6 text-center text-sm text-[#555]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSignIn}
          disabled={isLoading}
          className="text-[#f5a623] hover:underline underline-offset-4 transition-colors disabled:opacity-50"
        >
          Sign in
        </button>
      </p>
    </motion.div>
  )
}

// ─── Forgot Password ──────────────────────────────────────
function AuthForgotPassword({ onSignIn, onSuccess }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 1400))
      onSuccess()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={slideTransition}
      className="p-8"
    >
      <button
        type="button"
        onClick={onSignIn}
        disabled={isLoading}
        className="absolute left-4 top-4 p-2 rounded-md text-[#555] hover:text-[#f0f0f0] hover:bg-[#181818] transition-colors disabled:opacity-50"
        aria-label="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="mb-7 text-center">
        <h1 className="text-2xl font-semibold text-[#f0f0f0]">Reset password</h1>
        <p className="mt-1.5 text-sm text-[#666]">Enter your email to receive a reset link</p>
      </div>

      <AuthError message={error} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            disabled={isLoading}
            className={cn(errors.email && 'border-red-500/70')}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full h-10 rounded-md text-sm font-semibold',
            'bg-[#f5a623] text-black hover:bg-[#e09620]',
            'transition-colors duration-150',
            'disabled:opacity-50 disabled:pointer-events-none',
            'flex items-center justify-center gap-2',
          )}
        >
          {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>) : 'Send reset link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#555]">
        Remember your password?{' '}
        <button
          type="button"
          onClick={onSignIn}
          disabled={isLoading}
          className="text-[#f5a623] hover:underline underline-offset-4 transition-colors disabled:opacity-50"
        >
          Sign in
        </button>
      </p>
    </motion.div>
  )
}

// ─── Reset Success ────────────────────────────────────────
function AuthResetSuccess({ onSignIn }) {
  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={slideTransition}
      className="flex flex-col items-center p-8 text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20">
        <MailCheck className="h-8 w-8 text-[#f5a623]" />
      </div>
      <h1 className="text-2xl font-semibold text-[#f0f0f0]">Check your email</h1>
      <p className="mt-2 text-sm text-[#666] max-w-xs">
        We sent a password reset link to your email. Check your inbox and follow the instructions.
      </p>
      <button
        type="button"
        onClick={onSignIn}
        className={cn(
          'mt-6 w-full max-w-xs h-10 rounded-md text-sm',
          'border border-[#2a2a2a] text-[#f0f0f0] hover:bg-[#181818]',
          'transition-colors duration-150',
        )}
      >
        Back to sign in
      </button>
      <p className="mt-4 text-xs text-[#444]">
        No email? Check your spam folder.
      </p>
    </motion.div>
  )
}

// ─── Root Auth component (manages view state) ─────────────
function Auth({ initialView = AuthView.SIGN_IN, className }) {
  const [view, setView] = React.useState(initialView)

  // When initialView prop changes (e.g. switching between log-in and sign-up from outside)
  React.useEffect(() => {
    setView(initialView)
  }, [initialView])

  return (
    <div className={cn('mx-auto w-full max-w-md', className)}>
      <div className="relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111]/90 shadow-2xl backdrop-blur-sm">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623]/3 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {view === AuthView.SIGN_IN && (
              <AuthSignIn
                key="sign-in"
                onForgotPassword={() => setView(AuthView.FORGOT_PASSWORD)}
                onSignUp={() => setView(AuthView.SIGN_UP)}
              />
            )}
            {view === AuthView.SIGN_UP && (
              <AuthSignUp
                key="sign-up"
                onSignIn={() => setView(AuthView.SIGN_IN)}
              />
            )}
            {view === AuthView.FORGOT_PASSWORD && (
              <AuthForgotPassword
                key="forgot-password"
                onSignIn={() => setView(AuthView.SIGN_IN)}
                onSuccess={() => setView(AuthView.RESET_SUCCESS)}
              />
            )}
            {view === AuthView.RESET_SUCCESS && (
              <AuthResetSuccess
                key="reset-success"
                onSignIn={() => setView(AuthView.SIGN_IN)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export { Auth, AuthView, AuthSignIn, AuthSignUp, AuthForgotPassword, AuthResetSuccess }
