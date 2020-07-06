import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async showToast(msg: string,duration: number,color: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      color:color
    });
    toast.present();
  }
}
