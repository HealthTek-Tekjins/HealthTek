import { useAuth } from '../hooks/useAuth';

export default function TestHook() {
  const { user } = useAuth();
  return <Text>User: {user?.email || 'No user'}</Text>;
}