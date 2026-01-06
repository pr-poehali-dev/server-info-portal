import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Russian Town
          </h1>
          <div className="flex gap-6 items-center">
            <button onClick={() => scrollToSection('about')} className="text-sm hover:text-primary transition-colors">
              О сервере
            </button>
            <button onClick={() => scrollToSection('rules')} className="text-sm hover:text-primary transition-colors">
              Правила
            </button>
            <Button onClick={() => navigate('/forum')} size="sm" variant="outline">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Форум
            </Button>
            <Button onClick={() => scrollToSection('discord')} size="sm" className="bg-primary hover:bg-primary/90">
              Discord
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-slide-up">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Russian Town
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Лучший сервер Brick Rigs на территории России
            </p>
            <p className="text-lg text-muted-foreground/80 mb-2 max-w-2xl mx-auto">
              Лучшее РП только у нас! Пароль для входа только в Discord
            </p>
            <p className="text-sm text-muted-foreground/60 mb-8 max-w-2xl mx-auto">
              Основатель проекта: <span className="text-primary font-semibold">wagners_tourist</span>
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={() => scrollToSection('discord')} size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Присоединиться
              </Button>
              <Button onClick={() => scrollToSection('about')} size="lg" variant="outline" className="text-lg px-8">
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
            О сервере
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:scale-105 transition-transform duration-300 bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
                <CardTitle>Лучшее РП в России</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Уникальные ролевые игры и сценарии только на нашем сервере
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-300 bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-secondary" />
                </div>
                <CardTitle>Защищённый вход</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Пароль для подключения выдаётся только в Discord сервере
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-300 bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Trophy" size={24} className="text-primary" />
                </div>
                <CardTitle>Активное комьюнити</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Дружелюбные игроки и администрация всегда на связи
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-blue-900/20 via-red-900/20 to-blue-900/20">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <div className="text-8xl mb-6 animate-fade-in">🇷🇺</div>
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent">
              Фракции
            </h2>
          </div>
          <Card className="bg-card/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Открытые фракции</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-4">
                Присоединяйся к силовым структурам Российской Федерации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors">
                  <p className="text-xl font-bold text-primary">ФСБ</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors">
                  <p className="text-xl font-bold text-primary">ССО</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors">
                  <p className="text-xl font-bold text-primary">МВД</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors">
                  <p className="text-xl font-bold text-primary">ДПС</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors">
                  <p className="text-xl font-bold text-primary">СОБР</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors">
                  <p className="text-xl font-bold text-primary">Росгвардия</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Получи доступ к уникальной технике и экипировке каждой фракции
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold mb-8 text-muted-foreground/60">
            Закрытые фракции на текущий момент
          </h2>
          <p className="text-lg text-muted-foreground/50 mb-8">
            Скоро будут доступны для вступления
          </p>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="pt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50 opacity-60">
                  <Icon name="Lock" size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xl font-bold text-muted-foreground">ФСИН</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50 opacity-60">
                  <Icon name="Lock" size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xl font-bold text-muted-foreground">СК РФ</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50 opacity-60">
                  <Icon name="Lock" size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xl font-bold text-muted-foreground">ФСО</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50 opacity-60">
                  <Icon name="Lock" size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xl font-bold text-muted-foreground">ФСБ</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50 opacity-60">
                  <Icon name="Lock" size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xl font-bold text-muted-foreground">СБП</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-12">
            Администрация сервера
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:scale-105 transition-transform">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} className="text-secondary" />
                </div>
                <CardTitle className="text-xl">Администратор</CardTitle>
                <CardDescription className="text-lg font-semibold text-primary mt-2">
                  pancake
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:scale-105 transition-transform">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Crown" size={32} className="text-primary" />
                </div>
                <CardTitle className="text-xl">Глава проекта</CardTitle>
                <CardDescription className="text-lg font-semibold text-primary mt-2">
                  Турист-Вагнера
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:scale-105 transition-transform">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} className="text-secondary" />
                </div>
                <CardTitle className="text-xl">Администратор</CardTitle>
                <CardDescription className="text-lg font-semibold text-primary mt-2">
                  CJ
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-12">
            Генералы фракций
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/10 to-card border-primary/30 hover:scale-105 transition-transform">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border-2 border-primary/40">
                  <Icon name="Construction" size={36} className="text-primary" />
                </div>
                <CardTitle className="text-2xl">Генерал ЦОДД</CardTitle>
                <CardDescription className="text-lg font-bold text-primary mt-3">
                  Турист-Вагнера
                </CardDescription>
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  Управление дорожным движением
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-card border-secondary/30 hover:scale-105 transition-transform">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 border-2 border-secondary/40">
                  <Icon name="Swords" size={36} className="text-secondary" />
                </div>
                <CardTitle className="text-2xl">Генерал Армии</CardTitle>
                <CardDescription className="text-lg font-bold text-secondary mt-3">
                  Pancake
                </CardDescription>
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  Командование вооружёнными силами
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="rules" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Правила сервера
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                1. Уважение к игрокам
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Будьте вежливы с другими игроками. Запрещены оскорбления, травля и любые формы дискриминации.
                Создавайте дружелюбную атмосферу для всех участников сервера.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                2. Честная игра
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Использование читов, багов или эксплойтов строго запрещено. Игра должна быть честной для всех.
                Нарушители будут заблокированы без предупреждения.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                3. Постройки и творчество
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Не разрушайте чужие постройки без разрешения владельца. Уважайте творчество других игроков.
                Грифинг карается баном.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                4. Коммуникация
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Общайтесь на русском или английском языках. Запрещен спам, реклама других серверов и флуд в чате.
                Используйте голосовой чат Discord для командной игры.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                5. Администрация
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Решения администрации окончательны. При конфликтах обращайтесь к модераторам в Discord.
                Оспаривание банов только через тикет-систему.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section id="discord" className="py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="animate-scale-in">
            <Icon name="MessageCircle" size={64} className="mx-auto mb-6 text-primary" />
            <h2 className="text-4xl font-bold mb-6">
              Присоединяйся к нашему Discord
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Общайся с игроками, участвуй в событиях и получай последние новости о сервере
            </p>
            <Card className="bg-card border-border p-8 max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Discord сервер</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Здесь ты найдешь всё необходимое для игры
                </CardDescription>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    Для входа в Discord свяжись с основателем в Telegram:
                  </p>
                  <p className="text-base font-semibold text-primary mt-1">
                    @FSB_tourist
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-left">
                  <Icon name="Check" size={20} className="text-primary flex-shrink-0" />
                  <span>Голосовые каналы для игры</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Icon name="Check" size={20} className="text-primary flex-shrink-0" />
                  <span>Помощь и поддержка 24/7</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Icon name="Check" size={20} className="text-primary flex-shrink-0" />
                  <span>Анонсы событий и обновлений</span>
                </div>
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 mt-6"
                  onClick={() => window.open('https://discord.gg/RuBxnxyEV5', '_blank')}
                >
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Присоединиться к Discord
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-sm">
            © 2026 Russian Town. Brick Rigs Server
          </p>
          <p className="text-xs mt-2">
            Не является официальным продуктом Brick Rigs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;