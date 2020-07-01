import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home-toy-new/home-toy-new.module').then(m => m.HomeToyNewModule)

  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home-toy-new/home-toy-new.module').then(m => m.HomeToyNewModule)

  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
