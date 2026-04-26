import { NavItem } from '../../shared/sidebar/sidebar-item/sidebar-item.component';
import { TooltipMessage } from './Tooltip';

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    icon: 'dashboard',
    label: TooltipMessage.SIDEBAR.DASHBOARD,
    route: '/dashboard',
    tooltip: TooltipMessage.SIDEBAR.DASHBOARD,
    showTooltip: false,
  },
  {
    icon: 'pie_chart',
    label: TooltipMessage.SIDEBAR.BREAKDOWN,
    route: '/breakdown',
    tooltip: TooltipMessage.SIDEBAR.BREAKDOWN,
    showTooltip: false,
  },
  {
    icon: 'receipt_long',
    label: TooltipMessage.SIDEBAR.TRANSACTIONS,
    route: '/transactions',
    tooltip: TooltipMessage.SIDEBAR.TRANSACTIONS,
    showTooltip: false,
  },
  {
    icon: 'settings',
    label: TooltipMessage.SIDEBAR.CONFIGURATION,
    route: '/configuration',
    tooltip: TooltipMessage.SIDEBAR.CONFIGURATION,
    showTooltip: false,
  },
];
