import { createClient } from '@supabase/supabase-js'
import {
  Auth,
  ThemeSupa
} from '@supabase/auth-ui-react'

const supabase = createClient(
  '<INSERT PROJECT URL>',
  '<INSERT PROJECT ANON API KEY>'
)


const Login = () => (
  <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
  />
)

export default Login