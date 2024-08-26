import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/email/'
  }
  async sendEmailTC(to: string, subject: string, text: string){
    try {
      const data = await this.sendEmail(to, subject, text).subscribe(()=>{});
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  sendEmail(to: string, subject: string, text: string){
    const emailData = {
      to: to,
      subject: subject,
      text: text
  };
    let urlAux = this.myAppUrl + this.myApiUrl;
    return this.http.post<void>(urlAux, emailData);
  }
}