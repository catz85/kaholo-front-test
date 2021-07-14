import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
const sendCommand = gql`
  mutation createMessage($text: String!) {
    createMessage(text: $text) {
      text
      command
    }
  }
`;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  submitted = false;
  dataForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private apollo: Apollo) {}

  invalidCommand() {
    return this.submitted && this.dataForm.controls.command.errors != null;
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      command: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.dataForm.invalid == true) {
      return;
    } else {
      //commands here
      this.apollo.mutate({
        mutation: sendCommand,
        variables: {
          text: this.dataForm.getRawValue().command
        }
      }).subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      });

      this.dataForm.reset();
      Object.keys(this.dataForm.controls).forEach((key) => {
        this.dataForm.get(key).setErrors(null);
      });
      this.submitted = false;
    }
  }
}
