import { Button } from '@renderer/shadcn/components/ui/button'

import { Link, useNavigate } from 'react-router-dom'

import { ChevronsRight, Loader, MonitorCheck } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@renderer/shadcn/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/shadcn/components/ui/form'
import instance from '@renderer/lib/axios'
import { useAuth } from '@renderer/lib/authContext'

const formSchema = z.object({
  email: z.string().email({ message: 'Nieprawidłowy adres email.' }), // Custom message for email validation
  password: z.string().min(8, { message: 'Hasło musi mieć przynajmniej 8 znaków.' }) // Custom message for minimum length validation
})

export default function AuthenticationPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUserData } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await setLoading(true)
    try {
      const response = await instance.post('/auth/login', values)
      if (response.status === 200) {
        localStorage.setItem('token', response.data.accessToken)
        await setUserData(response.data.user)
        await setLoading(false)
        await navigate('/home', { replace: true })
      } else {
        await setLoading(false)
        await setError(response.data.message || 'Wystąpił błąd. Spróbuj ponownie.')
      }
    } catch (error: any) {
      await setLoading(false)
      await setError(error.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie.')
      console.error(error)
    }
  }

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-orange-600 dark:border-r lg:flex">
        <div className="absolute inset-0 bg-orange-100" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and helped me deliver
              stunning designs to my clients faster than ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Zaloguj Się</h1>
            <p className="text-sm text-muted-foreground">
              Aby w pełni korzystać z systemu, należy posiadać konto.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="przykład: jan@kowalski.pl"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło</FormLabel>
                    <FormControl>
                      <Input placeholder="********" {...field} type="password" disabled={loading} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Ładowanie
                  </>
                ) : (
                  <>
                    <ChevronsRight className="mr-2 h-4 w-4" /> Kontynuuj
                  </>
                )}
              </Button>
              {error && (
                <p className="text-sm text-red-500 text-center" role="alert">
                  {error}
                </p>
              )}
            </form>
          </Form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">LUB</span>
            </div>
          </div>

          <Button variant={'outline'}>
            <MonitorCheck className="mr-2 h-4 w-4" /> Sprawdź Wersję Demo
          </Button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Kontynuując zgadzasz się na{' '}
            <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
              Regulamin
            </Link>{' '}
            oraz{' '}
            <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
              Politykę Prywatności
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
