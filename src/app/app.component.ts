import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ViacepApiService } from './services/viacep-api.service';
import { InputMaskModule } from 'primeng/inputmask';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OpenStreetMapService } from './services/open-street-map.service';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { AutoFocusModule } from 'primeng/autofocus';
import { DialogModule } from 'primeng/dialog';

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
    InputSwitchModule,
    LeafletMapComponent,
    AutoFocusModule,
    DialogModule
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
  latitude: string = '';
  logitude: string = '';
  visible: boolean = false;
  geoLocation: any = null;
  consultCepSucess: boolean = false;

  constructor(
    private viacepApiService: ViacepApiService,
    private messageService: MessageService,
    private geoLocationService: OpenStreetMapService 
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

  isCepProvided(): boolean {
    const cepWithoutMask = this.cep.replace(/\D/g, '');
    return /^\d{8}$/.test(cepWithoutMask);
  }

  cepConsult(cep: string) {
    this.loading = true;

    this.viacepApiService.getCep(cep).subscribe({
      next: (data: any) => {
        this.logradouro = data.logradouro;
        this.bairro = data.bairro;
        this.cidade = data.localidade;
        this.estado = data.uf;
        this.ibge = data.ibge;
        
        if (data) {
          const queryParams = encodeURIComponent(data.logradouro);
          this.geoLocationService.getGeoLocation(queryParams).subscribe({
            next: (geoData: any) => {
              this.latitude = geoData[0].lat;
              this.logitude = geoData[0].lon;
            },
            error: (error: any) => {
              console.error('Error fetching geolocation data:', error);
            }
          })
        }
      
        if (data.erro) {
          this.cep = '';
          this.consultCepSucess = false;
          return this.messageService.add({ severity: 'error', summary: 'Cep invalido', detail: 'CEP não encontrado, tente novamente!' });;
        }
        this.consultCepSucess = true;
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
  
  showMap() {
      this.visible = true;
  }

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
      'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    const isNumber = /^[0-9]$/.test(event.key);
    const isAllowedKey = allowedKeys.includes(event.key);
    const isCtrlCmd = event.ctrlKey || event.metaKey;
    
    if (!isNumber && !isAllowedKey && !isCtrlCmd) {
      event.preventDefault();
      return;
    }
    
    const currentValue = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (isNumber && currentValue.length >= 8) {
      event.preventDefault();
    }
  }
  
  onCepInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    
    this.cep = value;
    event.target.value = value;
    
    setTimeout(() => {
      const input = event.target as HTMLInputElement;
      input.setSelectionRange(value.length, value.length);
    }, 0);
  }
  
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const numbersOnly = pastedText.replace(/\D/g, '').substring(0, 8);
    
    let formattedValue = numbersOnly;
    if (numbersOnly.length > 5) {
      formattedValue = numbersOnly.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    
    this.cep = formattedValue;
    const target = event.target as HTMLInputElement;
    target.value = formattedValue;
  }
}
