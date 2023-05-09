import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
    declarations: [AppComponent, NxWelcomeComponent, DashboardComponent],
    imports: [BrowserModule, RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' })],
    providers: [],
    bootstrap: [AppComponent],
    exports: [DashboardComponent]
})
export class AppModule {}
