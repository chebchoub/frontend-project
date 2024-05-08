import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketRequest } from '../dto/ticket-request';
import { ClientServiceService } from '../service/client-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-rating-ticket',
  templateUrl: './rating-ticket.component.html',
  styleUrl: './rating-ticket.component.css'
})
export class RatingTicketComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, public serviceClient: ClientServiceService, public sanitizer: DomSanitizer) { }
  ratingForm: FormGroup | any;
  @Output() closeModalEvent = new EventEmitter<void>();

  ngOnInit(): void {
    // Initialize form group with FormBuilder
    this.ratingForm = this.formBuilder.group({
      rating: ['', Validators.required]
    });
    // Listen for changes in the rating form control
    this.ratingForm.get('rating').valueChanges.subscribe((value: any) => {
      if (value) {
        this.rateTechnician(value);

      }
    });
  }
  ratingValue: number = 0;
  // Method to submit the rating to the backend
  rateTechnician(value: number) {
    console.log(value)  // Pass the rating value to your backend API
    this.serviceClient.markAsClosed(value, this.serviceClient.ticketIDClosed).subscribe(
      (response: any) => {
        console.log(response)      
        // Fermer la modal après 3 secondes
        setTimeout(() => {
          this.closeModalEvent.emit();
        }, 1000);
        this.router.navigate(['/homeClient/tickets']);


      },
      (error: any) => {
        // Handle error if needed
      }
    );
  }

}
