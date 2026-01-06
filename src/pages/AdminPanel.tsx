import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");
  const [customRoleName, setCustomRoleName] = useState("");
  const [customRoleDesc, setCustomRoleDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      
      if (user.role !== 'creator' && user.role !== 'admin') {
        toast({
          title: 'Доступ запрещён',
          description: 'У вас нет прав администратора',
          variant: 'destructive'
        });
        navigate('/forum');
        return;
      }
      
      fetchUsers(user.id);
    } else {
      navigate('/forum');
    }
  }, []);

  const fetchUsers = async (adminId: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/5cc13e4b-248c-4507-b395-fce345f05f59?action=get_all_users&admin_id=${adminId}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список пользователей',
        variant: 'destructive'
      });
    }
  };

  const updateUserSystemRole = async (userId: number, role: string) => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/5cc13e4b-248c-4507-b395-fce345f05f59', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_user_role',
          admin_id: currentUser.id,
          user_id: userId,
          role: role
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Успешно',
          description: data.message
        });
        fetchUsers(currentUser.id);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Не удалось обновить роль',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const assignCustomRole = async () => {
    if (!selectedUser || !customRoleName) {
      toast({
        title: 'Ошибка',
        description: 'Выберите пользователя и укажите название роли',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/5cc13e4b-248c-4507-b395-fce345f05f59', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign_role',
          admin_id: currentUser.id,
          user_id: selectedUser.id,
          role_name: customRoleName,
          role_description: customRoleDesc
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Успешно',
          description: data.message
        });
        setCustomRoleName("");
        setCustomRoleDesc("");
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Не удалось выдать роль',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: any = {
      creator: 'bg-primary text-primary-foreground',
      admin: 'bg-secondary text-secondary-foreground',
      moderator: 'bg-accent text-accent-foreground',
      user: 'bg-muted text-muted-foreground'
    };
    return colors[role] || colors.user;
  };

  const getRoleIcon = (role: string) => {
    if (role === 'creator') return 'Crown';
    if (role === 'admin') return 'Shield';
    if (role === 'moderator') return 'ShieldCheck';
    return 'User';
  };

  if (!currentUser) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            onClick={() => navigate('/')}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
          >
            Russian Town - Админ-панель
          </h1>
          <div className="flex gap-4 items-center">
            <Button onClick={() => navigate('/forum')} variant="outline" size="sm">
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              К форуму
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={24} className="text-primary" />
                  Управление пользователями
                </CardTitle>
                <CardDescription>
                  Изменение системных ролей (creator, admin, moderator, user)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name={getRoleIcon(user.role)} size={20} className="text-primary" />
                        <div>
                          <p className="font-semibold">{user.display_name || user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleBadge(user.role)}>{user.role}</Badge>
                        {currentUser.role === 'creator' && user.id !== currentUser.id && (
                          <Select
                            onValueChange={(value) => updateUserSystemRole(user.id, value)}
                            disabled={loading}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue placeholder="Изменить" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="creator">Creator</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Award" size={24} className="text-secondary" />
                  Выдача игровых ролей
                </CardTitle>
                <CardDescription>
                  Создайте свои роли для игроков (ФСБ, ССО, МВД и т.д.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Выберите игрока</Label>
                  <Select onValueChange={(value) => setSelectedUser(users.find(u => u.id === parseInt(value)))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите пользователя" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.display_name || user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Название роли</Label>
                  <Input
                    placeholder="Например: Офицер ФСБ, Генерал МВД"
                    value={customRoleName}
                    onChange={(e) => setCustomRoleName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Описание роли (необязательно)</Label>
                  <Input
                    placeholder="Краткое описание"
                    value={customRoleDesc}
                    onChange={(e) => setCustomRoleDesc(e.target.value)}
                  />
                </div>

                <Button onClick={assignCustomRole} disabled={loading} className="w-full">
                  {loading ? 'Загрузка...' : 'Выдать роль'}
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Примеры ролей:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Офицер ФСБ', 'Генерал МВД', 'Сотрудник ДПС', 'Боец СОБР', 'Командир ССО', 'Рядовой Росгвардии'].map((role) => (
                      <Badge
                        key={role}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/20"
                        onClick={() => setCustomRoleName(role)}
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Settings" size={24} className="text-primary" />
                Инструкция для главы проекта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={16} className="text-primary mt-0.5" />
                  <p><strong>Системные роли:</strong> Creator → Admin → Moderator → User (для управления форумом)</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={16} className="text-primary mt-0.5" />
                  <p><strong>Игровые роли:</strong> Создавайте свои роли для игроков (фракции, звания)</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={16} className="text-primary mt-0.5" />
                  <p><strong>Модерация тем:</strong> В будущем добавится закрытие/закрепление тем на форуме</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
