import { Routes } from '@angular/router';

// Every feature is lazy loaded: the initial bundle only holds the shell.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'fleet' },
  { path: 'fleet', title: 'Flota · RutaViva', loadComponent: () => import('./features/fleet/fleet-list').then((m) => m.FleetList) },
  {
    path: 'fleet/:id',
    title: 'Vehículo · RutaViva',
    loadComponent: () => import('./features/fleet/vehicle-detail').then((m) => m.VehicleDetailPage),
  },
  { path: 'orders', title: 'Órdenes · RutaViva', loadComponent: () => import('./features/orders/order-list').then((m) => m.OrderList) },
  {
    path: 'orders/:id',
    title: 'Orden · RutaViva',
    loadComponent: () => import('./features/orders/order-detail').then((m) => m.OrderDetailPage),
  },
  {
    path: 'notifications',
    title: 'Avisos · RutaViva',
    loadComponent: () => import('./features/notifications/notifications-page').then((m) => m.NotificationsPage),
  },
  {
    path: 'simulator',
    title: 'Simulador · RutaViva',
    loadComponent: () => import('./features/simulator/simulator-page').then((m) => m.SimulatorPage),
  },
  { path: '**', redirectTo: 'fleet' },
];
