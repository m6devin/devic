import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DefaultOptions } from 'apollo-client/ApolloClient';


@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  // providers: [
  //   {
  //     provide: APOLLO_OPTIONS,
  //     useFactory: createApollo,
  //     deps: [HttpLink],
  //   },
  // ],
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {

    const defaultOptions: DefaultOptions = {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    };

    apollo.create({
      link: httpLink.create({ uri: '/api/gql/v1' }),
      cache: new InMemoryCache(),
      defaultOptions: defaultOptions,
    });

    apollo.create({
      link: httpLink.create({ uri: '/api/gql/v1/admin' }),
      cache: new InMemoryCache(),
      defaultOptions: defaultOptions,
    }, 'admin');
    apollo.create({
      link: httpLink.create({ uri: '/api/gql/v1/userarea' }),
      cache: new InMemoryCache(),
      defaultOptions: defaultOptions,
    }, 'userarea');
    apollo.create({
      link: httpLink.create({ uri: '/api/gql/v1/supplier' }),
      cache: new InMemoryCache(),
      defaultOptions: defaultOptions,
    }, 'supplier');
  }
}
