import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-summary-form',
  templateUrl: './summary-form.component.html',
  styleUrls: ['./summary-form.component.scss']
})
export class SummaryFormComponent implements OnInit {

  myForm: FormGroup;

  formErrors = {
    name: '',
    addresses: [
      { city: '', country: '' }
    ]
  };

  validationMessages = {
    name: {
      required: 'Name is required'
    },
    addresses: {
      city: {
        required: 'City is required'
      },
      country: {
        required: 'Country is required'
      }
    }
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      addresses: this.fb.array([
        this.createAddress()
      ])
    });

    //Look for changes
    this.myForm.valueChanges.subscribe(values => {
      this.validateForm();
    });
  }

  //========== Getters ===========
  get NameForm() {
    return this.myForm.get('name');
  }

  get AddressForm() {
    return this.myForm.get('addresses') as FormArray;
  }

  validateForm() {
    for (let field in this.formErrors) {
      //Loop through the errors and set them to empty to start
      this.formErrors[field] = '';

      //focus on current input field
      let input = this.myForm.get(field);

      if (input.invalid && input.dirty) {
        for (let error in input.errors) {
          this.formErrors[field] = this.validationMessages[field][error];
        }
      }
    }

    this.validateAddresses();
  }

  validateAddresses() {
    //Clear the error messages array for emails to start
    this.formErrors.addresses = [];

    for (let i = 1; i <= this.AddressForm.length; i++) {
      //start with an empty error message for each email in the array
      this.formErrors.addresses.push({ city: '', country: '' });

      //Reference the current email formgroup in the formarray
      let address = this.AddressForm.at(i - 1) as FormGroup;

      for (let field in address.controls) {
        //focus on the current field in email formgroup
        let input = address.get(field);
        if (input.invalid && input.dirty) {
          for (let error in input.errors) {
            this.formErrors.addresses[i - 1][field] = this.validationMessages.addresses[field][error];
          }
        }
      }
    }
  }

  createAddress() {
    return this.fb.group({
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  addAddress() {
    this.AddressForm.push(this.createAddress());
  }

  removeAddress(index: number) {
    this.AddressForm.removeAt(index);
  }

  onSubmit(f: FormGroup) {
    console.log(f);
  }

}
