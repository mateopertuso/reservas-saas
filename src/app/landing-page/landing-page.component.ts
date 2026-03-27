import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ValueComponent } from './components/value/value.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { CtaComponent } from './components/cta/cta.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    ValueComponent,
    HowItWorksComponent,
    PricingComponent,
    CtaComponent,
    FooterComponent,
  ],
  template: `
    <div class="bg-surface text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <app-navbar />
      <main class="pt-24 md:pt-32">
        <app-hero />
        <app-value />
        <app-how-it-works />
        <app-pricing />
        <app-cta />
      </main>
      <app-footer />
    </div>
  `,
})
export class LandingPageComponent {}
