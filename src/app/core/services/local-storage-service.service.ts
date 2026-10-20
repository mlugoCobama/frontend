import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  constructor() { }
  setItem(key: string, value: any): void {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to local storage', error);
    }
  }
  // Get item from local storage
  getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
      
    } catch (error) {
      console.error('Error reading from local storage', error);
      return null;
    }
  }
  // Remove item from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  // Clear all local storage
  clear(): void {
    localStorage.clear();
  }

  getLocalUser(){
    const u:any = this.getItem('currentUser');
    return {
      id: u.role.id,
      nombreCompleto: u.role.name,
      nombre: u['usuarioActivo'][0].puesto ?? 'N/D',
      apellidos: u['usuarioActivo'][0].puesto ?? 'N/D',
      email: u.role.email,
      intercompania: u.role.intercompania,
      isAgencia: u['usuarioActivo'][0].isAgencia ?? false,
      empresa: u['usuarioActivo'][0].empresa ?? 'N/D',
      puesto: u['usuarioActivo'][0].puesto ?? 'N/D',
      multiselect: u['usuarioActivo'][0].multiselect ?? false, 
      empresas: u['usuarioActivo'][0].empresas,
    }
  }
}
