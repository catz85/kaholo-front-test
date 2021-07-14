import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { ResponseComponent } from './response/response.component';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
interface Definintion {
  kind: string;
  operation?: string;
};
@NgModule({
  declarations: [AppComponent, FormComponent, ResponseComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const http = httpLink.create({
          uri: 'http://localhost:4001/graphql',
        });

        // Create a WebSocket link:
        const ws = new WebSocketLink({
          uri: `ws://localhost:4001/graphql`,
          options: {
            reconnect: true,
          },
        });
        const link = split(
          // split based on operation type
          ({ query }) => {
            const { kind, operation }:Definintion = getMainDefinition(query);
            return (
              kind === 'OperationDefinition' && operation === 'subscription'
            );
          },
          ws,
          http
        );
        return {
          cache: new InMemoryCache(),
          link
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
