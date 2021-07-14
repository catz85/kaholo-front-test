import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';


const SUBSCRIBE = gql`
subscription messages {
  messages {
   text
   command
   error
 }
}`

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css'],
})
export class ResponseComponent implements OnInit {
  response: [];
  loading: boolean;
  error: null;
  responsequery: QueryRef<any>;
  constructor(private apollo: Apollo) {
    this.responsequery = this.apollo
    .watchQuery({
      query: gql`
        {
          messages {
            text
            command
          }
        }
      `,
    })
    this.responsequery.valueChanges.subscribe(
      (data: any) => {
        this.response = data?.data?.messages;
      },
      (error) => {
        this.loading = false;
        this.error = error;
      }
    );
  }
  subscribeToData() {
    this.responsequery.subscribeToMore({
      document: SUBSCRIBE,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }
        console.log(subscriptionData.data.messages)
        const newFeedItem = subscriptionData.data.messages;
        console.log('newFeedItem',newFeedItem)
        console.log('prev',prev)
        return {
          ...prev,
          messages: [newFeedItem, ...prev.messages]
        };
      }
    });
  }
  ngOnInit() {
    this.subscribeToData()
  }
}
