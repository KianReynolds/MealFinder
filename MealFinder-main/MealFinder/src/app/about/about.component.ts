import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-about',
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css'
})
export class AboutComponent {

}
