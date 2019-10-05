import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { ChannelComponent } from './features/channel/channel.component';
import { TagManagementComponent } from 'src/app/features/tag-management/tag-management.component';
import { BlankComponent } from './core/dashboard/blank/blank.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './core/auth/forgot-password/forgot-password.component';
import { CanActivateLogin } from './shared/route-guards/login-gaurd';
import { AuthGuard } from './shared/route-guards/auth-gaurd';
import { FileManagerComponent } from './features/file-manager/file-manager.component';



const routes: Routes = [
    {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
    },
    {
        path: 'index',
        component: LoginComponent,
        canActivate: [CanActivateLogin]
    },
    {
        path: 'reset-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'channel/:id',
                component: ChannelComponent
            },
            {
                path: 'tags',
                component: TagManagementComponent
            },
            {
                path: 'files',
                component: FileManagerComponent
            },
            {
                path: 'channel',
                component: ChannelComponent
            },
            {
                path: '',
                //component: BlankComponent
                redirectTo: 'channel',
                pathMatch: 'full'
            }
        ],
        runGuardsAndResolvers: 'always'
    },
    {
        path: '**',
        //component: PageNotFoundComponent
        redirectTo: 'dashboard',
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
