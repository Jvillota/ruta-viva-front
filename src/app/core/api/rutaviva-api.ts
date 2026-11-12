import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ClockView,
  DailyCheckSummary,
  NotificationEntry,
  OdometerReadingEntry,
  OdometerReadingResult,
  ServiceOrder,
  ServiceOrderStatus,
  VehicleDetail,
  VehicleSummary,
  Workshop,
} from './models';

/** Relative base URL: the dev proxy (proxy.conf.json) and nginx (Docker) forward /api to the backend. */
export const API_BASE_URL = '/api/v1';

@Injectable({ providedIn: 'root' })
export class FleetApi {
  private readonly http = inject(HttpClient);

  workshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${API_BASE_URL}/workshops`);
  }

  vehicles(): Observable<VehicleSummary[]> {
    return this.http.get<VehicleSummary[]>(`${API_BASE_URL}/vehicles`);
  }

  vehicle(vehicleId: string): Observable<VehicleDetail> {
    return this.http.get<VehicleDetail>(`${API_BASE_URL}/vehicles/${vehicleId}`);
  }
}

@Injectable({ providedIn: 'root' })
export class TelemetryApi {
  private readonly http = inject(HttpClient);

  sendReading(vehicleId: string, km: number): Observable<OdometerReadingResult> {
    return this.http.post<OdometerReadingResult>(`${API_BASE_URL}/vehicles/${vehicleId}/odometer-readings`, { km });
  }

  readings(vehicleId: string, take = 20): Observable<OdometerReadingEntry[]> {
    const params = new HttpParams().set('take', take);
    return this.http.get<OdometerReadingEntry[]>(`${API_BASE_URL}/vehicles/${vehicleId}/odometer-readings`, { params });
  }
}

@Injectable({ providedIn: 'root' })
export class ServiceOrdersApi {
  private readonly http = inject(HttpClient);

  list(status?: ServiceOrderStatus | null, vehicleId?: string | null): Observable<ServiceOrder[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (vehicleId) {
      params = params.set('vehicleId', vehicleId);
    }
    return this.http.get<ServiceOrder[]>(`${API_BASE_URL}/service-orders`, { params });
  }

  get(orderId: string): Observable<ServiceOrder> {
    return this.http.get<ServiceOrder>(`${API_BASE_URL}/service-orders/${orderId}`);
  }

  quote(orderId: string, amountCop: number): Observable<ServiceOrder> {
    return this.http.post<ServiceOrder>(`${API_BASE_URL}/service-orders/${orderId}/quote`, { amountCop });
  }

  approve(orderId: string): Observable<ServiceOrder> {
    return this.action(orderId, 'approve');
  }

  reject(orderId: string): Observable<ServiceOrder> {
    return this.action(orderId, 'reject');
  }

  cancel(orderId: string): Observable<ServiceOrder> {
    return this.action(orderId, 'cancel');
  }

  start(orderId: string): Observable<ServiceOrder> {
    return this.action(orderId, 'start');
  }

  complete(orderId: string, serviceKm: number, serviceDate: string): Observable<ServiceOrder> {
    return this.http.post<ServiceOrder>(`${API_BASE_URL}/service-orders/${orderId}/complete`, { serviceKm, serviceDate });
  }

  private action(orderId: string, action: string): Observable<ServiceOrder> {
    return this.http.post<ServiceOrder>(`${API_BASE_URL}/service-orders/${orderId}/${action}`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  private readonly http = inject(HttpClient);

  list(take = 50): Observable<NotificationEntry[]> {
    return this.http.get<NotificationEntry[]>(`${API_BASE_URL}/notifications`, { params: new HttpParams().set('take', take) });
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/notifications/${notificationId}/read`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class SystemApi {
  private readonly http = inject(HttpClient);

  clock(): Observable<ClockView> {
    return this.http.get<ClockView>(`${API_BASE_URL}/system/clock`);
  }

  advance(days: number): Observable<ClockView> {
    return this.http.post<ClockView>(`${API_BASE_URL}/system/clock/advance`, { days });
  }

  runDailyCheck(): Observable<DailyCheckSummary> {
    return this.http.post<DailyCheckSummary>(`${API_BASE_URL}/system/daily-check`, {});
  }
}
