import { type User } from 'next-auth';
import { loginSchema } from '@/server/validations/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase-client'; // conexão client-side Firebase para autenticação

export async function authorize(
  credentials: Record<'username' | 'password', string> | undefined,
): Promise<User | null> {
  try {
    const creds = await loginSchema.parseAsync(credentials);

    // Autenticar no Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      creds.username,
      creds.password,
    );
    const user = userCredential.user;

    if (!user) {
      return null;
    }

    // Retornar o objeto User conforme o esperado pelo NextAuth
    const returnUser: User = {
      id: user.uid,
      name: user.displayName || '',
      email: user.email || '',
    };

    return returnUser;
  } catch (error) {
    console.error('Erro no authorize:', error);
    return null;
  }
}
