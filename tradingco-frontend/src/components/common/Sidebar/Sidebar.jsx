import { useLocation, useNavigate } from 'react-router-dom';
import useSettingsStore from '../../../store/useSettingsStore';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '📈', label: 'Markets', path: '/markets' },
  { icon: '👁️', label: 'Watchlists', path: '/watchlists' },
  { icon: '💼', label: 'Portfolio', path: '/portfolio' },
  { icon: '📋', label: 'Orders', path: '/orders' },
  { icon: '📰', label: 'News', path: '/news' },
  { icon: '📉', label: 'Analytics', path: '/analytics' },
  { icon: '🔍', label: 'Screener', path: '/screener' },
  { icon: '📅', label: 'Calendar', path: '/calendar' },
  { icon: '📓', label: 'Journal', path: '/journal' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const expanded = useSettingsStore((s) => s.sidebarExpanded);
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar);

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.brandArea} onClick={toggleSidebar}>
        <span className={styles.brandIcon}>📈</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ icon, label, path }) => (
          <button
            key={path}
            className={`${styles.navItem} ${location.pathname.startsWith(path) ? styles.active : ''}`}
            onClick={() => navigate(path)}
            title={!expanded ? label : undefined}
          >
            <span className={styles.navIcon}>{icon}</span>
            <span className={styles.navLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
