import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

interface ForumTopic {
  id: number;
  category: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
}

const Forum = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);

  const categories = [
    { id: 'support', name: 'Техническая поддержка', icon: 'Headphones', color: 'text-primary' },
    { id: 'news', name: 'Новости сервера', icon: 'Newspaper', color: 'text-secondary' },
    { id: 'rules', name: 'Правила и FAQ', icon: 'BookOpen', color: 'text-primary' },
    { id: 'factions', name: 'Фракции', icon: 'Shield', color: 'text-secondary' },
    { id: 'general', name: 'Общие вопросы', icon: 'MessageSquare', color: 'text-primary' },
    { id: 'reports', name: 'Жалобы', icon: 'Flag', color: 'text-destructive' }
  ];

  const topics: ForumTopic[] = [
    {
      id: 1,
      category: 'news',
      title: 'Открытие новых фракций уже скоро!',
      author: 'Турист-Вагнера',
      replies: 23,
      views: 156,
      lastActivity: '2 часа назад',
      isPinned: true
    },
    {
      id: 2,
      category: 'support',
      title: 'Как получить пароль для входа на сервер?',
      author: 'Игрок123',
      replies: 5,
      views: 42,
      lastActivity: '1 день назад'
    },
    {
      id: 3,
      category: 'factions',
      title: 'Набор в ФСБ - требования и условия',
      author: 'pancake',
      replies: 18,
      views: 89,
      lastActivity: '3 часа назад',
      isPinned: true
    },
    {
      id: 4,
      category: 'general',
      title: 'Где скачать Brick Rigs?',
      author: 'Новичок',
      replies: 7,
      views: 34,
      lastActivity: '5 часов назад'
    },
    {
      id: 5,
      category: 'support',
      title: 'Проблемы с подключением к серверу',
      author: 'User456',
      replies: 12,
      views: 67,
      lastActivity: '1 день назад'
    },
    {
      id: 6,
      category: 'reports',
      title: 'Жалоба на игрока (нарушение правил)',
      author: 'Модератор',
      replies: 3,
      views: 21,
      lastActivity: '4 часа назад'
    }
  ];

  const filteredTopics = selectedCategory
    ? topics.filter(t => t.category === selectedCategory)
    : topics;

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            onClick={() => navigate('/')}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
          >
            Russian Town
          </h1>
          <div className="flex gap-4 items-center">
            <Button onClick={() => navigate('/')} variant="ghost" size="sm">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" size="sm">
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Discord
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Форум поддержки
            </h1>
            <p className="text-xl text-muted-foreground">
              Задай вопрос, получи помощь или обсуди игровые новости
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedCategory === cat.id ? 'border-primary bg-primary/10' : 'bg-card'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${cat.color}/20 flex items-center justify-center`}>
                      <Icon name={cat.icon as any} size={20} className={cat.color} />
                    </div>
                    <CardTitle className="text-lg">{cat.name}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              {selectedCategory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Сбросить фильтр
                </Button>
              )}
            </div>
            <Button onClick={() => setShowNewTopicForm(!showNewTopicForm)} className="bg-primary">
              <Icon name="Plus" size={18} className="mr-2" />
              Создать тему
            </Button>
          </div>

          {showNewTopicForm && (
            <Card className="mb-6 bg-card border-primary/30 animate-fade-in">
              <CardHeader>
                <CardTitle>Новая тема</CardTitle>
                <CardDescription>Опиши свой вопрос или проблему подробно</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Категория</label>
                  <select className="w-full p-2 rounded-lg bg-input border border-border text-foreground">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Заголовок</label>
                  <Input placeholder="Кратко опиши проблему..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Сообщение</label>
                  <Textarea placeholder="Подробное описание..." rows={6} />
                </div>
                <div className="flex gap-3">
                  <Button className="bg-primary">
                    <Icon name="Send" size={18} className="mr-2" />
                    Опубликовать
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewTopicForm(false)}>
                    Отмена
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.isPinned && (
                            <Badge variant="secondary" className="text-xs">
                              <Icon name="Pin" size={12} className="mr-1" />
                              Закреплено
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === topic.category)?.name}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-1 hover:text-primary transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Автор: <span className="font-medium">{topic.author}</span> • {topic.lastActivity}
                        </p>
                      </div>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Icon name="MessageSquare" size={16} />
                          <span>{topic.replies}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Eye" size={16} />
                          <span>{topic.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {filteredTopics.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет тем в этой категории</p>
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-sm">
            © 2026 Russian Town. Brick Rigs Server
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Forum;
