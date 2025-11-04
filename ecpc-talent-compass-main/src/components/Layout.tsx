import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  AlertTriangle,
  TrendingUp,
  Grid3x3,
  Users,
  Database,
  LogOut,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { path: '/assessment', label: '9-Box Assessment', icon: ClipboardCheck },
    { path: '/retention-risks', label: 'Retention Risks', icon: AlertTriangle },
    { path: '/next-steps', label: 'Next Steps', icon: TrendingUp },
    { path: '/9-box-grid', label: '9-Box Grid', icon: Grid3x3 },
  ];

  const hrOnlyItems = [
    { path: '/users', label: 'Users Management', icon: Users },
    { path: '/employees', label: 'Employees Database', icon: Database },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar shadow-md">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-sidebar-border p-6">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">ECPC</h1>
              <p className="text-xs text-muted-foreground">Succession Planning</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="border-b border-sidebar-border p-4">
              <p className="text-sm font-medium text-sidebar-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {user?.role === 'HR' && (
              <>
                <div className="my-2 border-t border-sidebar-border" />
                <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                  HR Management
                </p>
                {hrOnlyItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Logout */}
          <div className="border-t border-sidebar-border p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
