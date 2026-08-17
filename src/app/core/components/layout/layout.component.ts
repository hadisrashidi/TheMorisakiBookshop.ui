import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ToastHostComponent } from '../../../shared/components/toast-host/toast-host.component';
import { RouteProgressComponent } from '../../../shared/components/route-progress/route-progress.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, ToastHostComponent, RouteProgressComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
