import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Eye, 
  Briefcase, 
  ClipboardList, 
  Newspaper, 
  BarChart3, 
  Sliders, 
  Calendar, 
  BookOpen, 
  Settings, 
  TrendingUp 
} from 'lucide-react';
import useSettingsStore from '../../../store/useSettingsStore';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: LineChart, label: 'Markets', path: '/markets' },
  { icon: Eye, label: 'Watchlists', path: '/watchlists' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: ClipboardList, label: 'Orders', path: '/orders' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Sliders, label: 'Screener', path: '/screener' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const expanded = useSettingsStore((s) => s.sidebarExpanded);
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar);
  const setSidebarExpanded = useSettingsStore((s) => s.setSidebarExpanded);

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setSidebarExpanded(false);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.brandArea} onClick={toggleSidebar}>
        <span className={styles.brandIcon}>
          <TrendingUp size={22} strokeWidth={2.5} style={{ color: 'var(--accent-blue)' }} />
        </span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            className={`${styles.navItem} ${location.pathname.startsWith(path) ? styles.active : ''}`}
            onClick={() => handleNavClick(path)}
            title={!expanded ? label : undefined}
          >
            <span className={styles.navIcon}>
              <Icon size={18} strokeWidth={2} />
            </span>
            <span className={styles.navLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
