import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (user: any, token: string) => void;
}

const AuthDialog = ({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    display_name: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/857991c2-32ee-4eaf-b5bb-2abec84c0b7e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: mode === 'login' ? 'Вход выполнен' : 'Регистрация завершена',
          description: `Добро пожаловать, ${data.user.display_name}!`
        });
        onAuthSuccess(data.user, data.token);
        onOpenChange(false);
        setFormData({ username: '', email: '', password: '', display_name: '' });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Что-то пошло не так',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Войдите, чтобы создавать темы на форуме' 
              : 'Создайте аккаунт для участия в форуме'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Логин</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              minLength={3}
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">Отображаемое имя</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="Как вас будут видеть другие"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full bg-primary" disabled={loading}>
            {loading ? (
              <>
                <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              mode === 'login' ? 'Войти' : 'Зарегистрироваться'
            )}
          </Button>

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p className="text-muted-foreground">
                Нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-primary hover:underline"
                >
                  Зарегистрироваться
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline"
                >
                  Войти
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
