import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit{
    userService = inject(UserService);
  async ngOnInit() {
    try{
        await this.userService.getUsers().toPromise();
    }catch(error){console.log(error);
    }
    window.scrollTo(0, 0);
    document.addEventListener("DOMContentLoaded", function () {
      const faders = document.querySelectorAll('.fade-in');
  
      const appearOptions = {
          threshold: 0.3, // Porcentaje de visibilidad necesario para activar la animación
          rootMargin: "0px 0px -100px 0px"
      };
  
      const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
          entries.forEach(entry => {
              if (!entry.isIntersecting) {
                  return;
              } else {
                  entry.target.classList.add('show');
                  appearOnScroll.unobserve(entry.target);
              }
          });
      }, appearOptions);
  
      faders.forEach(fader => {
          appearOnScroll.observe(fader);
      });
  });  
  }
}
