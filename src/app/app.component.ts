import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ViacepApiService } from './viacep-api.service';
import { InputMaskModule } from 'primeng/inputmask';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    CommonModule,
    InputMaskModule,
    FloatLabelModule,
    ToastModule,
    RippleModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  title = 'app-viacep';
  cep: string = '';
  logradouro: string = '';
  bairro: string = '';
  cidade: string = '';
  estado: string = '';
  ibge: string = '';
  loading: boolean = false; 

  constructor(
    private http: HttpClient,
    private viacepApiService: ViacepApiService,
    private messageService: MessageService
  ) {}

  cepConsult(cep: string) {
    this.loading = true;

    this.viacepApiService.getCep(cep).subscribe({
      next: (data: any) => {
        console.log('Data fetched:', data);
        this.logradouro = data.logradouro;
        this.bairro = data.bairro;
        this.cidade = data.localidade;
        this.estado = data.uf;
        this.ibge = data.ibge;
        
        if (data.erro) {
          this.cep = '';
          return this.messageService.add({ severity: 'error', summary: 'Cep invalido', detail: 'CEP não encontrado, tente novamente!' });;
        }
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'CEP encontrado!' });
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      },
      complete: () => {
        console.log('Request completed');
        this.loading = false;
      },
    })
  }

  onCepInput(event: any) {
    const checkInputCep = /^[a-zA-Z]$/.test(event.key);
    if (checkInputCep) {
      this.cep = '';
      event.preventDefault();
    }
  }

  isCepProvided(): boolean {
    return /^\d{8}$/.test(this.cep);
  }

  buttonDisabled(): string {
    if (this.loading) {
      return 'disabled';
    }
    return this.isCepProvided() ? '#007ad9' : '#b0b0b0';
  }

  buttonIconchange(): string {
    return this.isCepProvided() ? 'pi pi-search' : 'pi pi-ban';
  }

}
