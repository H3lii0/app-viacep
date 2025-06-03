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
import { InputSwitchModule } from 'primeng/inputswitch';

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
    ProgressSpinnerModule,
    InputSwitchModule
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
  changeTheme: boolean = false;
  
  constructor(
    private http: HttpClient,
    private viacepApiService: ViacepApiService,
    private messageService: MessageService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const switchContainer = document.querySelector('.themed-switch .p-inputswitch');
      if (switchContainer) {
        const sunIcon = document.createElement('i');
        sunIcon.className = 'pi pi-sun switch-icon-left';
        
        const moonIcon = document.createElement('i');
        moonIcon.className = 'pi pi-moon switch-icon-right';
        
        switchContainer.appendChild(sunIcon);
        switchContainer.appendChild(moonIcon);
      
        this.updateIconVisibility();
      }
    }, 100);
  } 

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

  toggleTheme() {
    this.changeTheme = !this.changeTheme;
    this.updateIconVisibility();
    document.body.classList.toggle('dark-theme', this.changeTheme);
  }

  private updateIconVisibility() {
    setTimeout(() => {
      const sunIcon = document.querySelector('.switch-icon-left');
      const moonIcon = document.querySelector('.switch-icon-right');
      
      if (sunIcon && moonIcon) {
        if (this.changeTheme) {
          (sunIcon as HTMLElement).style.opacity = '0.3';
          (moonIcon as HTMLElement).style.opacity = '1';
        } else {
          (sunIcon as HTMLElement).style.opacity = '1';
          (moonIcon as HTMLElement).style.opacity = '0.3';
        }
      }
    }, 50);
  }

}
